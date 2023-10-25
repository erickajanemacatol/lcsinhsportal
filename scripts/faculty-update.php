<?php
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: PUT, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

if ($localDb->connect_error) {
    die("Local Database Connection Failed: " . $localDb->connect_error);
}

$response = array();

// Retrieve updated faculty details from the request
$data = json_decode(file_get_contents("php://input"));

// Retrieve the current employee number from the hidden input field
$currentEmployeeNumber = $data->current_employee_no;

// Update the faculty details in the database
$sql = "UPDATE faculty SET title=?, fname=?, lname=?, employee_no=? WHERE employee_no=?";
$stmt = $localDb->prepare($sql);
$stmt->bind_param("ssssi", $data->title, $data->fname, $data->lname, $data->employee_no, $currentEmployeeNumber);

// Execute the SQL query
if ($stmt->execute()) {
    $response['success'] = true;
} else {
    $response['success'] = false;
    $response['error'] = $stmt->error;
}

$stmt->close();
$localDb->close();

echo json_encode($response);
?>
