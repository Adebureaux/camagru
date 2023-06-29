FROM php:7.4-apache

# Install required packages
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y libsqlite3-dev sqlite3 ufw

# Install required extensions
RUN docker-php-ext-install pdo pdo_sqlite

WORKDIR /root

# Copy the app and the configuration files to the container
COPY app/ .
COPY config/db.sh .
COPY config/ssl.sh .
COPY config/entrypoint.sh .

# Configure Apache
COPY config/ssl-params.conf /etc/apache2/conf-available/ssl-params.conf
COPY config/apache-config.conf /etc/apache2/sites-available/000-default.conf
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN echo "LogLevel debug" >> /etc/apache2/apache2.conf
RUN a2enmod rewrite
RUN a2enmod headers
RUN a2enmod ssl
RUN a2enconf ssl-params

# Set permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html
RUN chmod +x db.sh
RUN chmod +x ssl.sh
RUN chmod +x entrypoint.sh

# Run the configurations scripts

ENTRYPOINT [ "bash", "/root/entrypoint.sh" ]