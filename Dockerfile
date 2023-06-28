FROM php:7.4-apache

# Install required packages
RUN apt-get update \
    && apt-get install -y libsqlite3-dev sqlite3 ufw

# Install required extensions
RUN docker-php-ext-install pdo pdo_sqlite

WORKDIR /root

# Copy the app and the configuration files to the container
COPY app/ /var/www/html
COPY config/db.sh .
COPY config/ssl.sh .

# Configure Apache
RUN a2enmod rewrite
RUN a2enmod headers
RUN a2enmod ssl
COPY config/apache-config.conf /etc/apache2/sites-available/000-default.conf
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Set permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html
RUN chmod +x db.sh
RUN chmod +x ssl.sh

# Run the configuration scripts
# RUN bash ssl.sh
RUN bash db.sh

# Set the working directory
WORKDIR /var/www/html

# Run Apache
CMD ["apache2-foreground"]

