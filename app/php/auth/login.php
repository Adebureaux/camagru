<?php
require_once '../db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  session_set_cookie_params(86400 * 7);
  session_start();

  $request_body = file_get_contents('php://input');
  $data = json_decode($request_body);

  if (!$data) {
    $response = array(
      'success' => false,
      'error' => 'Invalid JSON data'
    );
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
  }

  $username = $data->username;
  $password = $data->password;

  $stmt = $pdo->prepare("SELECT id, username, password, verified FROM users WHERE username = :username");
  $stmt->execute(['username' => $username]);
  $user = $stmt->fetch();

  $response = array(
    'success' => false,
    'error' => 'Invalid username or password.'
  );

  if ($user) {
    if ($user['verified']) {
      if (password_verify($password, $user['password'])) {
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
