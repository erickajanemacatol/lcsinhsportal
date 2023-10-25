<?php
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json"); // Set the response content type to JSON

// Local Database Connection
$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

// Check the connection to the local database
if ($localDb->connect_error) {
    die("Local Database Connection Failed: " . $localDb->connect_error);
}

// Update announcement logic in update-annc.php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve updated announcement data from the request
    $data = json_decode(file_get_contents("php://input"));

    // Extract data like title, description, and id
    $annc_id = $data->id;
    $title = $data->title;
    $description = $data->description;

    // Initialize the SQL query
    $sql = "";

    if (isset($annc_id)) {
        // Use SQL to update the announcement
        $sql = "UPDATE announcements SET title = '$title', description = '$description' WHERE annc_id = $annc_id";
    } else {
        $response = ['success' => false, 'error' => 'ID is not set in the request.'];
    }

    if (!empty($sql)) {
        // Execute the SQL query
        if ($localDb->query($sql) === TRUE) {
            $response = ['success' => true];
        } else {
            $response = ['success' => false, 'error' => $localDb->error];
        }
    }

    echo json_encode($response);
}

$localDb->close();
?>
