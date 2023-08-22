<?php
require_once '../db_connection.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_SESSION['user_id'])) {
        sendResponse(false, 'User not authenticated.');
        exit;
    }

    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body);

    if (!isset($data->username) || empty(trim($data->username))) {
        sendResponse(false, 'Username is required.');
        exit;
    }

    $newUsername = filter_var($data->username, FILTER_SANITIZE_FULL_SPECIAL_CHARS);

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = :username");
    $stmt->execute(['username' => $newUsername]);
    $exists = $stmt->fetchColumn();

    if ($exists) {
        sendResponse(false, 'Username already exists.');
        exit;
    }

    $stmt = $pdo->prepare("UPDATE users SET username = :username WHERE id = :id");
    $result = $stmt->execute(['username' => $newUsername, 'id' => $_SESSION['user_id']]);

    if ($result) {
        sendResponse(true, 'Username updated successfully.');
    } else {
        sendResponse(false, 'Error updating username. Please try again.');
    }
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
