<?php
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Local Database Connection
$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

// Check the connection to the local database
if ($localDb->connect_error) {
    die("Local Database Connection Failed: " . $localDb->connect_error);
}

// Query to retrieve announcements from the database
$sql = "SELECT annc_id, title, description, dateandtime  FROM announcements";

$result = $localDb->query($sql);

if ($result) {
    $announcements = array();
    while ($row = $result->fetch_assoc()) {
        $formattedDateTime = date('F j, Y, g:i A', strtotime($row['dateandtime']));

        // Replace the 'dateandtime' value with the formatted date and time
        $row['dateandtime'] = $formattedDateTime;

        $announcements[] = $row;
    }

    // Return announcements as JSON
    echo json_encode($announcements);
} else {
    // Handle query error
    echo json_encode(array('error' => $localDb->error));
}



$localDb->close();
?>