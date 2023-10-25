<?php
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

if ($localDb->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit; // Terminate script on connection failure
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $qrCode = $_POST['student_lrn'];

    date_default_timezone_set('Asia/Manila');

    // Query the database to retrieve student information based on the QR code
    $sql = "SELECT * FROM student WHERE student_lrn = ?";
    $stmt = $localDb->prepare($sql);
    $stmt->bind_param("s", $qrCode);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        // Student found, return the student information
        $student = $result->fetch_assoc();

        // Log the attendance to the attendance table
        $attendanceDate = date('Y-m-d');
        $attendanceTime = date('h:i A');

        // Check if attendance entry already exists for the same student on the same day
        $attendanceExistsSql = "SELECT * FROM attendance WHERE student_lrn = ? AND attendance_date = ?";
        $attendanceExistsStmt = $localDb->prepare($attendanceExistsSql);
        $attendanceExistsStmt->bind_param("ss", $qrCode, $attendanceDate);
        $attendanceExistsStmt->execute();
        $attendanceExistsResult = $attendanceExistsStmt->get_result();

        if ($attendanceExistsResult->num_rows === 0) {
            // No attendance entry exists for the same student on the same day, insert a new entry
            $attendanceSql = "INSERT INTO attendance (student_lrn, attendance_date, attendance_time) VALUES (?, ?, ?)";
            $attendanceStmt = $localDb->prepare($attendanceSql);
            $attendanceStmt->bind_param("sss", $qrCode, $attendanceDate, $attendanceTime);

            if ($attendanceStmt->execute()) {
                // Attendance successfully logged
                echo json_encode(['success' => true, 'student' => $student, 'attendanceDate' => $attendanceDate, 'attendanceTime' => $attendanceTime]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Failed to log attendance']);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'Attendance entry already exists for the student on this day']);
        }

        $attendanceExistsStmt->close();
        $attendanceStmt->close();
    } else {
        echo json_encode(['success' => false, 'error' => 'Student not found']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
}
?>
