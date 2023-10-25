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

$query = "SELECT * FROM student";
$result = $localDb->query($query);

if ($result) {
    $students = [];
    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }

    echo json_encode($students);
} else {
    echo json_encode(['error' => 'Failed to fetch students.']);
}

$localDb->close();
?>