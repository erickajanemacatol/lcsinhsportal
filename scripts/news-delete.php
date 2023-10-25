<?php
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type");

// Local Database Connection
$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

// Delete image logic in delete-image.php
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Retrieve the image ID to be deleted from the query string
    $imageId = $_GET['imageId'];

    error_log("Received imageId: " . $imageId);

    // Use $imageId in your SQL query
    $sql = "DELETE FROM news WHERE news_cont = ?";
    $stmt = $localDb->prepare($sql);
    $stmt->bind_param("s", $imageId);


    // Execute the prepared statement
    if ($stmt->execute()) {
        $response = ['success' => true];
    } else {
        $response = ['success' => false, 'error' => $stmt->error];
    }

    echo json_encode($response);
}

$localDb->close();
?>