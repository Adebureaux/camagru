#!/bin/bash

# Define the path to your SQLite database file
DATABASE_FILE="/var/data/database.sqlite"

# Check if the database file already exists
if [ ! -f "$DATABASE_FILE" ]; then
  echo "Creating SQLite database..."

  # Run the SQLite command to create the database and necessary tables
  sqlite3 "$DATABASE_FILE" <<EOF
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      notification TINYINT(1) NOT NULL DEFAULT 1,
      verified TINYINT(1) NOT NULL DEFAULT 0,
      activation_token VARCHAR(255),
      reset_token VARCHAR(255)
    );
EOF
  chmod 777 $DATABASE_FILE
  echo "SQLite database created."
fi