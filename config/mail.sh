#!/bin/bash

ufw allow Postfix
echo "relayhost = $SMTP_SERVER" >> /etc/postfix/main.cf
echo "$SMTP_SERVER $SMTP_ACCESS" > /etc/postfix/sasl_passwd
postmap /etc/postfix/sasl_passwd
service postfix start