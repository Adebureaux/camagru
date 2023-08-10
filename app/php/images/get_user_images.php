<?php
require_once '../db_connection.php';

session_start();
$response = [];

const IMAGES_PER_PAGE = 10; // Number of images to return per request

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_SESSION['user_id'])) {
        $user_id = $_SESSION['user_id'];
        
        // Get offset from request or default to 0
        $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

        try {
            $stmt = $pdo->prepare("SELECT * FROM images WHERE user_id = :id ORDER BY created_at DESC LIMIT ".IMAGES_PER_PAGE." OFFSET :offset");
            $stmt->bindParam(':id', $user_id);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();

            $images = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if ($images) {
                foreach ($images as $key => $image) {
                    $images[$key]['image_data'] = base64_encode($image['image_data']);
                }

                $response = [
                    'status' => 'success',
                    'message' => 'Images fetched successfully.',
                    'images' => $images
                ];
            }
        } catch(PDOException $e) {
            $response = [
                'status' => 'error',
                'message' => 'Error while fetching the images: ' . $e->getMessage()
            ];
        }
    } else {
        $response = [
            'status' => 'error',
            'message' => 'Please log in to view your images.'
        ];
    }

    header('Content-Type: application/json');
    echo json_encode($response);
}
?>
