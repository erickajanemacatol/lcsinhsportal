<?php

header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

if ($localDb->connect_error) {
    die("Local Database Connection Failed: " . $localDb->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    $emergencyContact = $data->emergencyContact;
    $emergencyNumber = $data->emergencyNumber;
    $emergencyAddress = $data->emergencyAddress;
    $username = $data->username;

    $sql = "UPDATE student SET emergency_co = ?, emergency_no = ?, emergency_add = ? WHERE student_lrn = ?";
    $stmt = $localDb->prepare($sql);
    $stmt->bind_param("ssss", $emergencyContact, $emergencyNumber, $emergencyAddress, $username);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $localDb->error]);
    }

    $stmt->close();
    $localDb->close();
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
}
?>
