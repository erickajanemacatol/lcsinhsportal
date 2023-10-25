<?php
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Local Database Connection
$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

// Check the connection to the local database
if ($localDb->connect_error) {
    die("Local Database Connection Failed: " . $localDb->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Get the activity ID from the request
    $activityId = $_GET['activityId'];

    // Query to delete the activity based on its ID
    $sql = "DELETE FROM activities WHERE activity_id = ?";

    $stmt = $localDb->prepare($sql);
    $stmt->bind_param("i", $activityId);

    if ($stmt->execute()) {
        // Activity deleted successfully
        echo json_encode(array('success' => true));
    } else {
        // Handle delete error
        echo json_encode(array('success' => false, 'error' => $localDb->error));
    }

    $stmt->close();
} else {
    echo json_encode(array('error' => 'Invalid request method'));
}

$localDb->close();
?>
