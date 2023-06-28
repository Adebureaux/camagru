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
      activation_token VARCHAR(255),
      reset_token VARCHAR(255)
    );

    INSERT INTO users (username, email, password, activation_token, reset_token)
    VALUES ('test', 'test@example.com', 'test', 'activation_token_here', 'reset_token_here');
EOF
  chmod -R 777 /var/data/
  echo "SQLite database created."
fi

apache2-foreground