#!/bin/bash

# Define the path to your SQLite database file
DATABASE_FILE="/var/data/database.sqlite"

# Check if the database file already exists
if [ ! -f "$DATABASE_FILE" ]; then
  echo "Creating SQLite database..."

  # Run the SQLite command to create the database and necessary tables
  sqlite3 "$DATABASE_FILE" <<EOF
    CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, pwd TEXT);
    CREATE TABLE new (id INTEGER PRIMARY KEY, name TEXT, password TEXT);
EOF
  echo "SQLite database created."
fi

apache2-foreground