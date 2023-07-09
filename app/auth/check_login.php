<?php
session_start();

// Check if the user is logged in
if (isset($_SESSION['user_id']) && isset($_SESSION['username'])) {
  // User is logged in
  $response = array(
    'logged' => true
  );
} else {
  // User is not logged in
  $response = array(
    'logged' => false
  );
}

// Return the response as JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
