<?php
require_once '../db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['user_id'])) {
        $user_id = $_GET['user_id'];

        try {
            $stmt = $pdo->prepare("SELECT username FROM users WHERE id = :user_id");
            $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result) {
                $response = [
                    'success' => true,
                    'username' => $result['username']
                ];
            } else {
                $response = [
                    'success' => false,
                    'message' => 'User not found with the provided user_id.'
                ];
            }
        } catch (PDOException $e) {
            $response = [
                'success' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ];
        }
    } else {
        $response = [
            'success' => false,
            'message' => 'Please provide a user_id.'
        ];
    }
} else {
    $response = [
        'success' => false,
        'message' => 'Invalid request method.'
    ];
}

header('Content-Type: application/json');
echo json_encode($response);
?>
