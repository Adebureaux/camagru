<?php
require_once '../db_connection.php';

$token = $_GET['token'];

error_log('token=' . $token); // Debug statement



// Verify and activate the user account based on the token
if ($token) {
  // Prepare and execute a query to find the user by token
  $stmt = $pdo->prepare("SELECT * FROM users WHERE activation_token = :token");
  $stmt->bindParam(':token', $token);
  $stmt->execute();
  
  // Fetch the user record from the database
  $user = $stmt->fetch(PDO::FETCH_ASSOC);
  
  // Check if a matching user record was found
  if ($user) {
      // Update the account status to activated
      $stmt = $pdo->prepare("UPDATE users SET verified = 1 WHERE activation_token = :token");
      $stmt->bindParam(':token', $token);
      $stmt->execute();
      
      // Check if the update was successful
      if ($stmt->rowCount() > 0) {
          // Account activated successfully
          $response = [
              'success' => true,
              'message' => 'Account activated successfully.'
          ];
      } else {
          // Failed to activate the account
          $response = [
              'success' => false,
              'message' => 'Failed to activate the account.'
          ];
      }
  } else {
      // No matching user found with the token
      $response = [
          'success' => false,
          'message' => 'Invalid token.'
      ];
  }
} else {
  // Token is missing
  $response = [
      'success' => false,
      'message' => 'Token parameter is missing.'
  ];
}

// Return the response as JSON
header('Content-Type: application/json');
echo json_encode($response);
?>