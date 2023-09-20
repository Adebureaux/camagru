<?php
session_start();

require_once '../db_connection.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'You must be logged in to leave a comment.']);
    exit;
}

$request_body = file_get_contents('php://input');
$data = json_decode($request_body);

if (!$data || !isset($data->image_id) || !isset($data->comment)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid data provided.']);
    exit;
}

$user_id = $_SESSION['user_id'];
$image_id = $data->image_id;
$comment = $data->comment;

if (strlen($comment) > 2200) {
    echo json_encode(['status' => 'error', 'message' => 'Comment is too long.']);
    exit;
}

if (!strlen($comment)) {
    echo json_encode(['status' => 'error', 'message' => 'Comment must contain at least one character.']);
    exit;
}

try {
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("INSERT INTO comments (image_id, user_id, comment) VALUES (:image_id, :user_id, :comment)");
    $stmt->bindParam(':image_id', $image_id);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':comment', $comment);
    $stmt->execute();

    $stmt = $pdo->prepare("SELECT u.email, u.notification FROM images i JOIN users u ON i.user_id = u.id WHERE i.id = :image_id");
    $stmt->bindParam(':image_id', $image_id);
    $stmt->execute();
    $imageOwner = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($imageOwner) {
        if ($imageOwner['notification'] == 1) {
            $to = $imageOwner['email'];
            $subject = 'New Comment on Your Image';
            $message = 'You have received a new comment on your image. Check it out!' . "\nComment: " . $comment;
            $headers = 'From: camagruft@gmail.com';

            $isEmailSent = mail($to, $subject, $message, $headers);

            if ($isEmailSent) {
                echo json_encode(['status' => 'success', 'message' => 'Comment added successfully. Email notification sent to image owner.']);
            } else {
                echo json_encode(['status' => 'warning', 'message' => 'Comment added successfully, but email notification could not be sent to image owner.']);
            }
        } else {
            echo json_encode(['status' => 'success', 'message' => 'Comment added successfully. Email notification not sent as notification setting is not enabled.']);
        }
    } else {
        echo json_encode(['status' => 'success', 'message' => 'Comment added successfully. Image owner not found for email notification.']);
    }
}
catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
