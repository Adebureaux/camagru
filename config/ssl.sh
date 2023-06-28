#!/bin/bash

SSL_DIR="/root/.ssl"

ufw allow 80/tcp
ufw allow 443/tcp

if [ ! -d "$SSL_DIR" ]; then
  echo "Generate SSL certificate..."
  
  mkdir .ssl
  cd .ssl
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout private.key -out certificate.crt -subj "/C=FR/ST=FRANCE/L=PARIS/O=42/OU=42PARIS/CN=localhost"

  echo "SSL certificate created."
fi