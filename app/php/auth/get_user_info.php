<?php
require_once '../db_connection.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    sendResponse(false, 'User not logged in.');
    exit;
}

$userId = $_SESSION['user_id'];

$stmt = $pdo->prepare("SELECT username, email, notification FROM users WHERE id = :user_id");
$stmt->bindParam(':user_id', $userId);
$stmt->execute();

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user)
    sendResponse(true, 'User data fetched successfully.', $user);
else
    sendResponse(false, 'Failed to fetch user data.');

function sendResponse($success, $message, $data = null) {
  $response = array(
      'success' => $success,
      'message' => $message
  );

    if ($data)
      $response['data'] = $data;

    header('Content-Type: application/json');
    echo json_encode($response);
}
?>
