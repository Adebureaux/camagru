<?php
require_once '../db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Retrieve the raw request body
  $request_body = file_get_contents('php://input');
  // Decode the JSON data
  $data = json_decode($request_body);
  
  // Check if the JSON decoding was successful
  if (!$data) {
    $response = array(
      'success' => false,
      'error' => 'Invalid JSON data'
    );
    echo json_encode($response);
    exit;
  }
  
  // Retrieve form data from the JSON object
  $username = $data->username;
  $email = $data->email;
  $password = $data->password;
  
  error_log('username=' . $username . ', email=' . $email . ', password=' . $password); // Debug statement
  
  // Perform form validation
  if (empty($username) || empty($email) || empty($password)) {
    $response = array(
      'success' => false,
      'error' => 'Please fill in all the fields'
    );
    echo json_encode($response);
    exit;
  }

  // Sanitize the input
  $username = filter_var($username, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
  $email = filter_var($email, FILTER_SANITIZE_EMAIL);

  // Hash the password
  $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

  $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = :username");
  $stmt->execute(['username' => $username]);
  $count = $stmt->fetchColumn();
  
  if ($count > 0) {
    $response = array(
      'success' => false,
      'error' => 'Username is already taken'
    );
    echo json_encode($response);
    exit;
  }
  $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = :email");
  $stmt->execute(['email' => $email]);
  $count = $stmt->fetchColumn();
  if ($count > 0) {
    $response = array(
      'success' => false,
      'error' => 'Email is already taken'
    );
    echo json_encode($response);
    exit;
  }

  $activationToken = bin2hex(random_bytes(32));
  $resetToken = bin2hex(random_bytes(32));

  $stmt = $pdo->prepare("INSERT INTO users (username, email, password, activation_token, reset_token) VALUES (:username, :email, :password, :activation_token, :reset_token)");
  $stmt->execute([
    'username' => $username,
    'email' => $email,
    'password' => password_hash($password, PASSWORD_DEFAULT),
    'activation_token' => $activationToken,
    'reset_token' => $resetToken,
  ]);

  // Send the activation email
  $subject = 'Account Activation';
  $message = 'Thank you for registering! Please click the following link to activate your account: ' . generateActivationLink($activationToken);
  $headers = 'From: camagruft@gmail.com';
  $isEmailSent = mail($email, $subject, $message, $headers);

  if ($isEmailSent) {
    $response = array(
      'success' => true,
      'message' => 'Registration successful. An activation email has been sent to your email address.'
    );
  }
  else {
    $response = array(
      'success' => false,
      'error' => 'Failed to send activation email. Please contact support.'
    );
  }
  header('Content-Type: application/json');
  echo json_encode($response);
  exit;
}

function generateActivationLink($activationToken) {
  $baseUrl = 'https://localhost';
  return $baseUrl . '/activate?token=' . $activationToken;
}
?>
