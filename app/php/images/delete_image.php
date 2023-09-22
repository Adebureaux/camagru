<?php
require_once '../db_connection.php';

session_start();
$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Vérifier si l'utilisateur est connecté
    if (isset($_SESSION['user_id'])) {
        $user_id = $_SESSION['user_id'];
    } else {
        $response = [
            'success' => false,
            'message' => 'You must be logged in to delete an image.'
        ];
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    }

    // Récupérer l'ID de l'image à supprimer depuis les paramètres de la requête
    $image_id = $_GET['image_id'];

    // Vérifier si l'utilisateur est le propriétaire de l'image
    $stmt = $pdo->prepare("SELECT user_id FROM images WHERE id = :image_id");
    $stmt->bindParam(':image_id', $image_id, PDO::PARAM_INT);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result && $result['user_id'] == $user_id) {
        // L'utilisateur est le propriétaire de l'image, supprimer l'image
        $stmt = $pdo->prepare("DELETE FROM images WHERE id = :image_id");
        $stmt->bindParam(':image_id', $image_id, PDO::PARAM_INT);
        $stmt->execute();

        $response = [
            'success' => true,
            'message' => 'Image deleted successfully.'
        ];
    } else {
        // L'utilisateur n'est pas autorisé à supprimer cette image
        $response = [
            'success' => false,
            'message' => "You don't have permission to delete this image."
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
