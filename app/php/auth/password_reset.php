<?php

require_once '../db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body);
    if (!$data) {
        sendResponse(false, 'Invalid JSON data');
        exit;
    }

    $email = $data->email;

    if (empty($email)) {
        sendResponse(false, 'Email is required.');
        exit;
    }

    $email = filter_var($email, FILTER_SANITIZE_EMAIL);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(false, 'Invalid email format.');
        exit;
    }

    $resetToken = bin2hex(random_bytes(32));

    $stmt = $pdo->prepare("UPDATE users SET reset_token = :reset_token WHERE email = :email");
    $result = $stmt->execute(['reset_token' => $resetToken, 'email' => $email]);

    if (!$result) {
        sendResponse(false, 'Error updating reset token.');
        exit;
    }

    $resetLink = generateResetLink($resetToken);
    $subject = 'Password Reset';
    $message = 'Click on the following link to reset your password: ' . $resetLink;
    $headers = 'From: camagru@gmail.com';

    $isEmailSent = mail($email, $subject, $message, $headers);
    if ($isEmailSent) {
        sendResponse(true, 'Password reset email sent successfully.');
    }
    else {
        sendResponse(false, 'Failed to send password reset email. Please try again.');
    }
}

function generateResetLink($resetToken) {
    $baseUrl = 'https://localhost';
    return $baseUrl . '/reset-password?token=' . $resetToken;
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
