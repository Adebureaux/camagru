<?php
require_once '../db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body, true);
    
    $token = $_GET['token'];
    $newPassword = $data['password'];

    $checkPassword = isValidPassword($newPassword);
    if (!$checkPassword[0]) {
      $response = array(
        'success' => false,
        'error' => 'Password does not meet the complexity requirements: ' . $checkPassword[1]
      );
      echo json_encode($response);
      exit;
    }

    if ($token && $newPassword) {
      $stmt = $pdo->prepare("SELECT * FROM users WHERE reset_token = :token");
      $stmt->bindParam(':token', $token);
      $stmt->execute();
      
      $user = $stmt->fetch(PDO::FETCH_ASSOC);
      
      if ($user) {
          $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
          $stmt = $pdo->prepare("UPDATE users SET password = :password, reset_token = NULL WHERE reset_token = :token");
          $stmt->bindParam(':password', $hashedPassword);
          $stmt->bindParam(':token', $token);
          $stmt->execute();
          
          if ($stmt->rowCount() > 0) {
              $response = [
                  'success' => true,
                  'message' => 'Password updated successfully.'
              ];
          }
          else {
              $response = [
                  'success' => false,
                  'message' => 'Failed to update the password.'
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
  else {
      $response = [
          'success' => false,
          'message' => 'Token and new password are required.'
      ];
  }

  header('Content-Type: application/json');
  echo json_encode($response);
}

function isValidPassword($password) {
  $minimumLength = 8;
  $uppercaseRequired = true;
  $lowercaseRequired = true;
  $numberRequired = true;
  $specialCharacterRequired = true;

  if (strlen($password) < $minimumLength)
    return [false, 'must be at least 8 characters long.'];
  if ($uppercaseRequired && !preg_match('/[A-Z]/', $password))
    return [false, 'must have at least 1 uppercase character.'];
  if ($lowercaseRequired && !preg_match('/[a-z]/', $password))
    return [false, 'must have at least 1 lowercase character.'];
  if ($numberRequired && !preg_match('/[0-9]/', $password))
    return [false, 'must have at least 1 number character.'];
  if ($specialCharacterRequired && !preg_match('/[^a-zA-Z0-9]/', $password))
    return [false, 'must have at least 1 special character.'];
  return [true, 'successfull register.'];
}
?>
