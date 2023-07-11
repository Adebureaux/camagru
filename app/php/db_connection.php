<?php
$dbFile = '/var/data/database.sqlite';

try {
  $pdo = new PDO("sqlite:$dbFile");
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch (PDOException $e) {
  die("Connection failed: " . $e->getMessage());
}
?>
