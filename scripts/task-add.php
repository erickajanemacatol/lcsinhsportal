<?php
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Local Database Connection
$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

// Check the connection to the local database
if ($localDb->connect_error) {
    die("Local Database Connection Failed: " . $localDb->connect_error);
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve the task details from the request
    $data = json_decode(file_get_contents("php://input"));

    // Extract the task details from the data
    $act_desc = $data->act_desc;
    $priority = $data->priority;
    $category = $data->category; // Cast category to string
    $due_date = $data->due_date;
    $student_lrn = $data->student_lrn;

    // Insert the task into the database
    $sql = "INSERT INTO activities (act_desc, priority, category, due_date, student_lrn) VALUES (?, ?, ?, ?, ?)";
    $stmt = $localDb->prepare($sql);

    // Adjust the bind_param to match the data types and variable order correctly
    $stmt->bind_param('sisss', $act_desc, $priority, $category, $due_date, $student_lrn);

    if ($stmt->execute()) {
        $newTask = [
            'activity_id' => $stmt->insert_id,
            'act_desc' => $act_desc,
            'priority' => $priority,
            'category' => $category,
            'due_date' => $due_date,
            'student_lrn' => $student_lrn,
        ];
        $response = ['success' => true, 'data' => $newTask];
    } else {
        $response = ['success' => false, 'error' => $localDb->error];
    }

    echo json_encode($response);
}

$localDb->close();
?>