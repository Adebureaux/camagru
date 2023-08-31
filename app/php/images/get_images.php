<?php
require_once '../db_connection.php';

session_start();
$response = [];

const IMAGES_PER_PAGE = 5;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

    try {
        $stmt = $pdo->prepare("SELECT i.*, 
      (SELECT COUNT(*) FROM likes l WHERE l.image_id = i.id) as like_count,
      (SELECT COUNT(*) FROM comments c WHERE c.image_id = i.id) as comment_count
      FROM images i
      ORDER BY i.created_at DESC 
      LIMIT ".IMAGES_PER_PAGE." OFFSET :offset");
        
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
        } else {
            $response = [
                'status' => 'no-more-images',
                'message' => 'No more images to fetch.'
            ];
        }
    } catch(PDOException $e) {
        $response = [
            'status' => 'error',
            'message' => 'Error while fetching the images: ' . $e->getMessage()
        ];
    }

    header('Content-Type: application/json');
    echo json_encode($response);
}
?>
