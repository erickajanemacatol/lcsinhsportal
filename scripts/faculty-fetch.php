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

// Query to retrieve faculty information from the database
$sql = "SELECT title, fname, lname, employee_no FROM faculty";

$result = $localDb->query($sql);

if ($result) {
    $facultyList = [];
    
    while ($row = $result->fetch_assoc()) {
        $facultyList[] = $row;
    }
    
    echo json_encode($facultyList);
} else {
    echo "Error: " . $localDb->error;
}

$localDb->close();

?>