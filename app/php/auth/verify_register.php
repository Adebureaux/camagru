<?php
require_once '../db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $token = $_GET['token'];
  if ($token) {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE activation_token = :token");
    $stmt->bindParam(':token', $token);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
      if (!$user['verified']) {
        $stmt = $pdo->prepare("UPDATE users SET verified = 1 WHERE activation_token = :token");
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
          $response = [
              'success' => true,
              'message' => 'Account activated successfully.'
          ];
      }
      else {
          $response = [
              'success' => false,
              'message' => 'Failed to activate the account.'
          ];
      }
      }
      else {
        $response = [
          'success' => true,
          'message' => 'Your account is already activated.'
        ];
      }
    }
    else {
      $response = [
          'success' => false,
          'message' => 'Invalid token.'
      ];
    }
  }
  header('Content-Type: application/json');
  echo json_encode($response);
}
?>