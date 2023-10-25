<?php
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: DELETE, PUT"); // Change the allowed method to DELETE
header("Access-Control-Allow-Headers: Content-Type");

// Local Database Connection
$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

// Delete announcement logic in delete-annc.php
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Retrieve the announcement ID to be deleted from the request
    $data = json_decode(file_get_contents("php://input"));
    $announcement_id = $data->id;

    // Use SQL to delete the announcement
    $sql = "DELETE FROM announcements WHERE annc_id = $announcement_id";

    // Execute the SQL query
    if ($localDb->query($sql) === TRUE) {
        $response = ['success' => true];
    } else {
        $response = ['success' => false, 'error' => $localDb->error];
    }

    echo json_encode($response);
}

$localDb->close();
?>