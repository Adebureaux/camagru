<?php

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  session_set_cookie_params(86400 * 7);
  session_start();
  $response = false;
  if (isset($_SESSION['user_id']) && isset($_SESSION['username']))
    $response = true;
  header('Content-Type: application/json');
  echo json_encode($response);
}
?>
