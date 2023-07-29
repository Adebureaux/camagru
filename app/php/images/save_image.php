<?php
require_once '../db_connection.php';

session_start();

$response = [];

if (isset($_FILES['webcamImage']) && $_FILES['webcamImage']['error'] === UPLOAD_ERR_OK
    && isset($_FILES['superposableImage']) && $_FILES['superposableImage']['error'] === UPLOAD_ERR_OK) {

    $user_id = $_SESSION['user_id'];

    // Récupération des informations des fichiers
    $webcam_image_tmp = $_FILES['webcamImage']['tmp_name'];
    $superposable_image_tmp = $_FILES['superposableImage']['tmp_name'];

    // Lire le contenu des fichiers
    $webcam_image = imagecreatefromstring(file_get_contents($webcam_image_tmp));
    $superposable_image = imagecreatefromstring(file_get_contents($superposable_image_tmp));

    // Obtenez les données de position à partir de la requête POST et décodez le JSON en un objet PHP
    $position = json_decode($_POST['position']);

    // Convertissez les valeurs de pourcentage en valeurs absolues pour les dimensions de l'image
    $x = imagesx($webcam_image) * $position->x / 100;
    $y = imagesy($webcam_image) * $position->y / 100;

    // Superpose l'image superposable sur l'image de la webcam
    imagecopy($webcam_image, $superposable_image, $x, $y, 0, 0, imagesx($superposable_image), imagesy($superposable_image));

    // Convertir l'image résultante en chaîne de caractères
    ob_start();
    imagepng($webcam_image);
    $image_data = ob_get_clean();

    // Préparation et exécution de la requête d'insertion
    try {
        $stmt = $pdo->prepare("INSERT INTO images (user_id, image_data) VALUES (:user_id, :image_data)");
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':image_data', $image_data, PDO::PARAM_LOB);
        $stmt->execute();
        
        $response = [
            'status' => 'success',
            'message' => 'Image added successfully.'
        ];
    }
    catch(PDOException $e) {
        $response = [
            'status' => 'error',
            'message' => 'Error while adding the image: ' . $e->getMessage()
        ];
    }
}
else {
  error_log("Webcam or superposable image not set or error occurred while uploading.");

  // Log individual file errors
  if (isset($_FILES['webcamImage'])) {
      error_log("Webcam image upload error: " . $_FILES['webcamImage']['error']);
  }
  if (isset($_FILES['superposableImage'])) {
      error_log("Superposable image upload error: " . $_FILES['superposableImage']['error']);
  }
  
  $response = [
    'status' => 'error',
    'message' => 'Please select an image to upload.'
  ];
}

header('Content-Type: application/json');
echo json_encode($response);

?>
