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

    if (!isset($data->email) || empty(trim($data->email))) {
        sendResponse(false, 'Email is required.');
        exit;
    }

    $newEmail = filter_var($data->email, FILTER_SANITIZE_EMAIL);

    if (!filter_var($newEmail, FILTER_VALIDATE_EMAIL)) {
        sendResponse(false, 'Invalid email format.');
        exit;
    }

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = :email");
    $stmt->execute(['email' => $newEmail]);
    $exists = $stmt->fetchColumn();

    if ($exists) {
        sendResponse(false, 'Email already exists.');
        exit;
    }

    $stmt = $pdo->prepare("UPDATE users SET email = :email WHERE id = :id");
    $result = $stmt->execute(['email' => $newEmail, 'id' => $_SESSION['user_id']]);

    if ($result) {
        sendResponse(true, 'Email updated successfully.');
    } else {
        sendResponse(false, 'Error updating email. Please try again.');
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
