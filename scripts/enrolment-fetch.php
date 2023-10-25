<?php

header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Local Database Connection
$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

$enrolID = 1;

$stmt = $localDb->prepare("SELECT enrolment_link FROM enrolment WHERE enrolment_id = ?");
if ($stmt) {
    $stmt->bind_param("i", $enrolID); // 'i' for integer

    if ($stmt->execute()) {
        $stmt->bind_result($enrolLink);
        $stmt->fetch();

        if ($enrolLink) {
            $response = ['enrolLink' => $enrolLink];
        } else {
            $response = ['enrolLink' => null]; 
        }
    } else {
        $response = ['error' => $localDb->error];
    }

    $stmt->close();
} else {
    $response = ['error' => $localDb->error];
}

header('Content-Type: application/json');
echo json_encode($response);
 
$localDb->close();
?>
