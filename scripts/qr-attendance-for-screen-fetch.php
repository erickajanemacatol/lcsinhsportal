<?php
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $studentLRN = $_GET['student_lrn'];

    $localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

    if ($localDb->connect_error) {
        echo json_encode(['success' => false, 'error' => 'Database connection failed']);
        exit; // Terminate script on connection failure
    }

    $sql = "SELECT * FROM student WHERE student_lrn = ?";
    $stmt = $localDb->prepare($sql);
    $stmt->bind_param("s", $studentLRN);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $student = $result->fetch_assoc();
        echo json_encode(['success' => true, 'student' => $student]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Student not found']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
}

$localDb->close();
?>
