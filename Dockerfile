FROM php:8.2-apache

# Install required packages
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y libsqlite3-dev sqlite3 ufw libsasl2-modules vim libfreetype6-dev libjpeg62-turbo-dev libpng-dev

RUN docker-php-ext-configure gd --with-freetype --with-jpeg && docker-php-ext-install gd

RUN echo "postfix postfix/mailname string camagru.local" | debconf-set-selections
RUN echo "postfix postfix/main_mailer_type string 'Internet Site'" | debconf-set-selections
RUN apt-get install -y postfix

# Postfix configuration
COPY config/main.cf /etc/postfix/main.cf
COPY config/php.ini /usr/local/etc/php/php.ini

# Install required extensions
RUN docker-php-ext-install pdo pdo_sqlite

WORKDIR /root

# Copy the configuration files to the container
COPY config/db.sh .
COPY config/mail.sh .
COPY config/ssl.sh .
COPY config/entrypoint.sh .

# Configure Apache
COPY config/default.conf /etc/apache2/sites-available/000-default.conf
COPY config/default-ssl.conf /etc/apache2/sites-available/ssl-default.conf
RUN a2enmod headers
RUN a2enmod rewrite

# Set permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html
RUN chmod +x db.sh
RUN chmod +x mail.sh
RUN chmod +x ssl.sh
RUN chmod +x entrypoint.sh

# Run the configurations scripts
ENTRYPOINT [ "bash", "/root/entrypoint.sh" ]