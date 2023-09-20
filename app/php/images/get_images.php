<?php
require_once '../db_connection.php';

session_start();
$response = [];

const IMAGES_PER_PAGE = 5;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

    if (isset($_SESSION['user_id'])) {
        $user_id = $_SESSION['user_id'];
    } else {
        $user_id = null; // Utilisateur non connecté
    }

    try {
        $stmt = $pdo->prepare("
            SELECT 
                i.*, 
                (SELECT COUNT(*) FROM likes l WHERE l.image_id = i.id) as like_count,
                (CASE WHEN (SELECT COUNT(*) FROM likes l WHERE l.image_id = i.id AND l.user_id = :user_id) > 0 THEN 1 ELSE 0 END) as liked_by_user
            FROM 
                images i
            ORDER BY 
                i.created_at DESC 
            LIMIT ".IMAGES_PER_PAGE." OFFSET :offset");

        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();

        $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($images) {
            foreach ($images as &$image) {
                $image['image_data'] = base64_encode($image['image_data']);
                
                // Récupérez tous les commentaires pour cette image
                $stmt = $pdo->prepare("
                    SELECT 
                        c.user_id AS comment_user_id,
                        c.comment AS comment_text,
                        c.created_at AS comment_created_at
                    FROM 
                        comments c
                    WHERE 
                        c.image_id = :image_id
                    ORDER BY 
                        c.created_at DESC
                ");
                $stmt->bindParam(':image_id', $image['id'], PDO::PARAM_INT);
                $stmt->execute();
                $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $image['comments'] = $comments;
            }

            $response = [
                'success' => true,
                'message' => 'Images with comments fetched successfully.',
                'images' => $images
            ];
        } else {
            $response = [
                'success' => false,
                'message' => 'No more images to fetch.'
            ];
        }
    } catch(PDOException $e) {
        $response = [
            'success' => false,
            'message' => 'Error while fetching the images: ' . $e->getMessage()
        ];
    }

    header('Content-Type: application/json');
    echo json_encode($response);
}
?>
