<?php

// Your PHP script (create-event.php)
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    $eventName = $data->eventName;
    $startDate = $data->startDate;
    $endDate = $data->endDate;
    $description = $data->description;

    $localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');


    $sql = "INSERT INTO calendar (event_name, start_date, end_date, description) VALUES (?, ?, ?, ?)";
    
    if ($stmt = $localDb->prepare($sql)) {
        $stmt->bind_param("ssss", $eventName, $startDate, $endDate, $description);

        if ($stmt->execute()) {
            $response = ['success' => true];
        } else {
            $response = ['success' => false, 'error' => $localDb->error];
        }

        $stmt->close();
    } else {
        $response = ['success' => false, 'error' => $localDb->error];
    }

    $localDb->close();

    echo json_encode($response);
}


?>