<?php
session_set_cookie_params(86400 * 7);
session_start();

if (isset($_SESSION['user_id']) && isset($_SESSION['username'])) {
  $response = true;
}
else {
  $response = false;
}


header('Content-Type: application/json');
echo json_encode($response);
?>
