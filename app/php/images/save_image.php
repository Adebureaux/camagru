<?php
require_once '../db_connection.php';

session_start();

$max_size = 8388608; // Taille maximale en octets (8 MB)

if (isset($_FILES['webcamImage'], $_FILES['superposableImage']) &&
    $_FILES['webcamImage']['error'] === UPLOAD_ERR_OK &&
    $_FILES['superposableImage']['error'] === UPLOAD_ERR_OK &&
    $_FILES['webcamImage']['size'] <= $max_size) {

    $user_id = $_SESSION['user_id'];

    // Récupération des dimensions originales
    $originalDimensions = json_decode($_POST['originalDimensions']);
    $originalWidth = $originalDimensions->width;
    $originalHeight = $originalDimensions->height;

    // Récupération des fichiers temporaires
    $webcam_image_tmp = $_FILES['webcamImage']['tmp_name'];
    $superposable_image_tmp = $_FILES['superposableImage']['tmp_name'];

    // Convertir les images à partir de leurs fichiers temporaires
    $webcam_image_bw = imagecreatefromstring(file_get_contents($webcam_image_tmp));
    $superposable_image = imagecreatefromstring(file_get_contents($superposable_image_tmp));

    // Créez une nouvelle image avec un fond blanc à la taille d'origine
    $webcam_image = imagecreatetruecolor($originalWidth, $originalHeight);
    $white = imagecolorallocate($webcam_image, 255, 255, 255);
    imagefilledrectangle($webcam_image, 0, 0, $originalWidth, $originalHeight, $white);
    imagecopyresampled($webcam_image, $webcam_image_bw, 0, 0, 0, 0, $originalWidth, $originalHeight, imagesx($webcam_image_bw), imagesy($webcam_image_bw));

    // Obtenez les données de position
    $position = json_decode($_POST['position']);

    // Ajustez les coordonnées x et y pour centrer superposable_image
    $x = $originalWidth * $position->x / 100;
    $y = $originalHeight * $position->y / 100;

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

    // Libérez la mémoire
    imagedestroy($webcam_image_bw);
    imagedestroy($webcam_image);
    imagedestroy($superposable_image);
}
else {
    error_log("Webcam or superposable image not set or error occurred while uploading.");
    $response = [
        'status' => 'error',
        'message' => 'Please select an image to upload.'
    ];
}

header('Content-Type: application/json');
echo json_encode($response);


?>
