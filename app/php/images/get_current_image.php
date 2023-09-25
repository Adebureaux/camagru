<?php
require_once '../db_connection.php';

session_start();
$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_SESSION['user_id'])) {
        $user_id = $_SESSION['user_id'];

        try {
            $stmt = $pdo->prepare("SELECT * FROM images WHERE user_id = :id ORDER BY created_at DESC LIMIT 1");
            $stmt->bindParam(':id', $user_id);
            $stmt->execute();

            $image = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($image) {
                $image['image_data'] = base64_encode($image['image_data']);
                $response = [
                    'success' => true,
                    'message' => 'Image fetched successfully.',
                    'image' => $image
                ];
            }
            else {
                $response = [
                    'success' => false,
                    'message' => 'No images found for this user.'
                ];
            }
        }
        catch(PDOException $e) {
            $response = [
                'success' => false,
                'message' => 'Error while fetching the image: ' . $e->getMessage()
            ];
        }
    }
    else {
        $response = [
            'success' => false,
            'message' => 'Please log in to view your image.'
        ];
    }

    header('Content-Type: application/json');
    echo json_encode($response);
}
?>
