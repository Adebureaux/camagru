<?php
require_once '../db_connection.php';

try {
    $stmt = $pdo->query("SELECT COUNT(*) FROM images");
    $row = $stmt->fetch(PDO::FETCH_NUM);

    if ($row) {
        $count = $row[0];
        $response = [
            'success' => true,
            'message' => 'Number of rows fetched successfully.',
            'count' => $count
        ];
    } else {
        $response = [
            'success' => false,
            'message' => 'No rows found in the table.'
        ];
    }
} catch(PDOException $e) {
    $response = [
        'success' => false,
        'message' => 'Error while fetching the number of rows: ' . $e->getMessage()
    ];
}

header('Content-Type: application/json');
echo json_encode($response);
?>
