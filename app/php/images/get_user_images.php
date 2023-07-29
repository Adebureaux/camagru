<?php
require_once '../db_connection.php';

session_start();

$response = [];

if (isset($_SESSION['user_id'])) {

    $user_id = $_SESSION['user_id'];


    // Préparation de la requête pour récupérer toutes les images du user
    try {

      $stmt = $pdo->prepare("SELECT * FROM images WHERE user_id = :id ORDER BY created_at DESC");
      $stmt->bindParam(':id', $user_id);
      $stmt->execute();
      
      // Fetching all the images
      $images = $stmt->fetchAll(PDO::FETCH_ASSOC);
      
      // If images found
      if ($images) {
        // Convert each image to base64
        foreach ($images as $key => $image) {
          // Assuming `image_data` is the field containing the binary image data
          $images[$key]['image_data'] = base64_encode($image['image_data']);
        }

        $response = [
          'status' => 'success',
          'message' => 'Images fetched successfully.',
          'images' => $images
        ];
      }
    }
    catch(PDOException $e) {
        $response = [
            'status' => 'error',
            'message' => 'Error while fetching the images: ' . $e->getMessage()
        ];
    }
}
else {
    $response = [
        'status' => 'error',
        'message' => 'Please log in to view your images.'
    ];
}

header('Content-Type: application/json');
echo json_encode($response);

?>
