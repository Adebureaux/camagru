<?php
require_once '../db_connection.php';

session_set_cookie_params(86400 * 7);
session_start();

// Check if the form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Retrieve the form data
  $request_body = file_get_contents('php://input');
  // Decode the JSON data
  $data = json_decode($request_body);

  // Check if the JSON decoding was successful
  if (!$data) {
    $response = array(
      'success' => false,
      'error' => 'Invalid JSON data'
    );
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
  }

  // Retrieve form data from the JSON object
  $username = $data->username;
  $password = $data->password;

  // Prepare the query to check the user credentials
  $stmt = $pdo->prepare("SELECT id, username, password, verified FROM users WHERE username = :username");
  $stmt->execute(['username' => $username]);
  $user = $stmt->fetch();

  $response = array(
    'success' => false,
    'error' => 'Invalid username or password.'
  );

  // Check if a user with the provided username exists
  if ($user) {
    // Verify the password
    if ($user['verified']) {
      if (password_verify($password, $user['password'])) {
        // Password is correct, create a session for the user
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
  
        $response = array(
          'success' => true,
          'message' => 'Login successful.'
        );
      }
    }
    else {
      $response = array(
        'success' => false,
        'error' => 'Account is not verified, check your emails.'
      );
    }
  }
  header('Content-Type: application/json');
  echo json_encode($response);
}
?>
