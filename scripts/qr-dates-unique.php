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

$query = "SELECT DISTINCT attendance_date FROM attendance";
$result = $localDb->query($query);

if ($result) {
    $dates = [];
    while ($row = $result->fetch_assoc()) {
        $dates[] = $row['attendance_date'];
    }

    echo json_encode($dates);
} else {
    echo json_encode(['error' => 'Failed to fetch dates.']);
}

$localDb->close();
?>
