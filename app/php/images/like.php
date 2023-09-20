<?php
session_start();

require_once '../db_connection.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'You must be logged in to like this image.']);
    exit;
}

$request_body = file_get_contents('php://input');
$data = json_decode($request_body);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Missing image ID.']);
    exit;
}

$user_id = $_SESSION['user_id'];
$image_id = $data->image_id;

try {
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("SELECT * FROM likes WHERE user_id = :user_id AND image_id = :image_id");
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':image_id', $image_id);
    $stmt->execute();
    $existing_like = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existing_like) {
        $stmt = $pdo->prepare("DELETE FROM likes WHERE user_id = :user_id AND image_id = :image_id");
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':image_id', $image_id);
        $stmt->execute();
        echo json_encode(['success' => true, 'action' => 'unlike']);
    }
    else {
        $stmt = $pdo->prepare("INSERT INTO likes (user_id, image_id) VALUES (:user_id, :image_id)");
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':image_id', $image_id);
        $stmt->execute();
        echo json_encode(['success' => true, 'action' => 'like']);
    }
}
catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
