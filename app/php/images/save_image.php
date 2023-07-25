<?php
require_once '../db_connection.php';

session_start();

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $user_id = $_SESSION['user_id'];

    // Récupération des informations du fichier
    $file_name = $_FILES['image']['name'];
    $file_tmp = $_FILES['image']['tmp_name'];

    // Lire le contenu du fichier
    $image_data = file_get_contents($file_tmp);

    // Préparation et exécution de la requête d'insertion
    try {
        $stmt = $conn->prepare("INSERT INTO images (user_id, image_data) VALUES (:user_id, :image_data)");
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':image_data', $image_data, PDO::PARAM_LOB);
        $stmt->execute();
        
        echo "L'image a été ajoutée avec succès.";
    }
    catch(PDOException $e) {
      echo "Erreur lors de l'insertion de l'image : " . $e->getMessage();
    }
}
else {
    echo "Veuillez sélectionner une image à télécharger.";
}

?>