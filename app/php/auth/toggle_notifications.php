<?php
require_once '../db_connection.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'User not logged in.'
    ]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['state'])) {
    $state = $data['state'] ? 1 : 0;

    $stmt = $pdo->prepare("UPDATE users SET notification = :state WHERE id = :user_id");
    $result = $stmt->execute([
        'state' => $state,
        'user_id' => $_SESSION['user_id']
    ]);

    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Notification setting updated successfully.'
        ]);
    }
    else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to update the notification setting.'
        ]);
    }
}
else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request.'
    ]);
}
?>
