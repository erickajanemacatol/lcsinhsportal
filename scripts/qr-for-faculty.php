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

$query = "SELECT A.*, S.f_name, S.l_name
          FROM attendance A
          JOIN student S ON A.student_lrn = S.student_lrn";

$result = $localDb->query($query);

if ($result) {
    $attendanceData = [];
    while ($row = $result->fetch_assoc()) {
        $attendanceData[] = $row;
    }

    echo json_encode($attendanceData);
} else {
    echo json_encode(['error' => 'Failed to fetch attendance data.']);
}

$localDb->close();
?>
