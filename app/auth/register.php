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

  error_log('Fields not filled: username=' . $username . ', email=' . $email . ', password=' . $password); // Debug statement

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

  // Check if the username or email is already taken
  $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = :username OR email = :email");
  $stmt->execute(['username' => $username, 'email' => $email]);
  $count = $stmt->fetchColumn();

  if ($count > 0) {
    $response = array(
      'success' => false,
      'error' => 'Username or email is already taken'
    );
    echo json_encode($response);
    exit;
  }

  // Generate activation token (optional)
  $activationToken = bin2hex(random_bytes(32));

  // Insert the new user into the database
  $stmt = $pdo->prepare("INSERT INTO users (username, email, password, activation_token) VALUES (:username, :email, :password, :activation_token)");
  $stmt->execute(['username' => $username, 'email' => $email, 'password' => $hashedPassword, 'activation_token' => $activationToken]);

  // Prepare the response data
  $response = array(
    'success' => true,
    'message' => 'Registration successful'
  );

  header('Content-Type: application/json');
  echo json_encode($response);
  exit;
}
?>
