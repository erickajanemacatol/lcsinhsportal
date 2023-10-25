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

// Get the student's LRN from the request (you should validate and sanitize this value)
$studentLRN = $_GET['studentLRN'];

// Query to retrieve activities for the specified student
$sql = "SELECT activity_id, act_desc, priority, category, due_date FROM activities WHERE student_lrn = ?";

// Prepare the statement
$stmt = $localDb->prepare($sql);
$stmt->bind_param('s', $studentLRN);

// Execute the query
if ($stmt->execute()) {
    $result = $stmt->get_result();
    $activities = array();
    while ($row = $result->fetch_assoc()) {
        $formattedDateTime = date('F j, Y, g:i A', strtotime($row['due_date']));
        $row['dateandtime'] = $formattedDateTime;
        $activities[] = $row;
    }

    // Return activities as JSON
    echo json_encode($activities);
} else {
    // Handle query error
    echo json_encode(array('error' => $stmt->error));
}

$stmt->close();
$localDb->close();
?>
