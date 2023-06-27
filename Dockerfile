FROM php:7.4-apache

# Install required packages
RUN apt-get update \
    && apt-get install -y libsqlite3-dev sqlite3

# Install required extensions
RUN docker-php-ext-install pdo pdo_sqlite

# Set the working directory
WORKDIR /var/www/html

# Copy the application files and the configuration file to the container
COPY app/ /var/www/html
COPY config/setup.sh /setup.sh

# Configure Apache
RUN a2enmod rewrite
COPY config/apache-config.conf /etc/apache2/sites-available/000-default.conf
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Set permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html
RUN chmod +x /setup.sh

# Run start script
CMD ["bash", "/setup.sh"]

