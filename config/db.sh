#!/bin/bash

# Define the path to your SQLite database file
DATABASE_FILE="/var/data/database.sqlite"

if [ ! -f "$DATABASE_FILE" ]; then
  echo "Creating SQLite database..."
fi

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
  reset_token VARCHAR(255),
  last_reset_request DATETIME
);
CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  image_data BLOB,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  image_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (image_id) REFERENCES images(id),
  UNIQUE(user_id, image_id)
);
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (image_id) REFERENCES images(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
EOF

chmod 777 $DATABASE_FILE
chown -R www-data:www-data /var/data

