#!/bin/bash

bash db.sh
bash mail.sh
bash ssl.sh

# Start the Apache server in the foreground
exec apache2-foreground