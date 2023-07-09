#!/bin/bash

ufw allow "WWW Full"
ufw enable

cd /etc/apache2/certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout private.key -out certificate.crt -subj "/C=FR/ST=FRANCE/L=PARIS/O=42/OU=42PARIS/CN=localhost"
a2ensite ssl-default >> /dev/null
a2enmod ssl >> /dev/null

