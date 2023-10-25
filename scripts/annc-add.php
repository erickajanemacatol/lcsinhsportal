<?php
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Local Database Connection
$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

// Check the connection to the local database
if ($localDb->connect_error) {
    die("Local Database Connection Failed: " . $localDb->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve the announcement data from the request
    $data = json_decode(file_get_contents("php://input"));

    // Extract the title and description from the data
    $title = $data->title;
    $description = $data->description;

    // Insert the announcement into the database
    $sql = "INSERT INTO announcements (title, description) VALUES ('$title', '$description')";

    if ($localDb->query($sql) === TRUE) { // Change $conn to $localDb here
        $response = ['success' => true];
    } else {
        $response = ['success' => false, 'error' => $localDb->error]; // Change $conn to $localDb here
    }

    echo json_encode($response);
}

$localDb->close();
?>
