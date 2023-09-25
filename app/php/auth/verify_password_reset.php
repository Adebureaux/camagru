<?php
require_once '../db_connection.php';

$token = $_GET['token'];

if (!$token) {
    sendResponse(false, 'Token is required.');
    exit;
}

$stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE reset_token = :token");
$stmt->bindParam(':token', $token);
$stmt->execute();
$count = $stmt->fetchColumn();

if ($count > 0) {
    sendResponse(true, 'Token is valid.');
}
else {
    sendResponse(false, 'Invalid or expired token.');
}

function sendResponse($success, $message) {
    $responseType = $success ? 'message' : 'error';
    $response = array(
        'success' => $success,
        $responseType => $message
    );
    header('Content-Type: application/json');
    echo json_encode($response);
}
?>