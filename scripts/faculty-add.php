<?php
// Enable CORS (Cross-Origin Resource Sharing) for web requests
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Local Database Connection
$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

// Check the connection to the local database
if ($localDb->connect_error) {
    die("Local Database Connection Failed: " . $localDb->connect_error);
}

// Receive the faculty data from the request
$data = json_decode(file_get_contents("php://input"));

if (empty($data)) {
    echo "No data received.";
    die();
}

// Extract faculty information
$title = $data->title;
$firstName = $data->fname;
$lastName = $data->lname;
$employeeNumber = $data->employee_no;

// SQL query to insert faculty data into the database
$sql = "INSERT INTO faculty (title, fname, lname, employee_no) VALUES (?, ?, ?, ?)";
$stmt = $localDb->prepare($sql);
$stmt->bind_param("ssss", $title, $firstName, $lastName, $employeeNumber);

// Execute the prepared statement
if ($stmt->execute()) {
    echo "Faculty added successfully.";
} else {
    echo "Error adding faculty: " . $stmt->error;
}

$stmt->close();
$localDb->close();
?>
