<?php
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type");

$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

if ($localDb->connect_error) {
    die("Local Database Connection Failed: " . $localDb->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Retrieve the employee number to be deleted from the request
    $data = json_decode(file_get_contents("php://input"));
    $employeeNumber = $data->employee_no; // Make sure it matches your frontend code

    // Use SQL to delete the faculty by employee number
    $sql = "DELETE FROM faculty WHERE employee_no=?";

    // Prepare the SQL statement
    $stmt = $localDb->prepare($sql);
    $stmt->bind_param("s", $employeeNumber); // Assuming the employee number is a string

    // Execute the SQL query
    if ($stmt->execute()) {
        $response = ['success' => true];
    } else {
        $response = ['success' => false, 'error' => $stmt->error];
    }

    $stmt->close();
} else {
    $response = ['success' => false, 'error' => 'Invalid request method'];
}

echo json_encode($response);
?>
