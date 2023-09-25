<?php
require_once '../db_connection.php';

session_start();
$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (isset($_SESSION['user_id']))
      $user_id = $_SESSION['user_id'];
    else {
        $response = [
            'success' => false,
            'message' => 'You must be logged in to delete an image.'
        ];
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    }
    $request_data = file_get_contents('php://input');
    $data = json_decode($request_data);

    if (isset($data->image_id)) {
      $image_id = $data->image_id;

      $stmt = $pdo->prepare("SELECT user_id FROM images WHERE id = :image_id");
      $stmt->bindParam(':image_id', $image_id, PDO::PARAM_INT);
      $stmt->execute();
      $result = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($result && $result['user_id'] == $user_id) {
          $stmt = $pdo->prepare("DELETE FROM images WHERE id = :image_id");
          $stmt->bindParam(':image_id', $image_id, PDO::PARAM_INT);
          $stmt->execute();

          $response = [
              'success' => true,
              'message' => 'Image deleted successfully.'
          ];
      }
      else {
          $response = [
              'success' => false,
              'message' => "You don't have permission to delete this image."
          ];
      }
    }
    else {
      $response = [
        'success' => false,
        'message' => 'Invalid object.'
    ];
    }
  }
  else {
      $response = [
          'success' => false,
          'message' => 'Invalid request method.'
      ];
  }

header('Content-Type: application/json');
echo json_encode($response);
?>
