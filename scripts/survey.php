<?php

header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Local Database Connection
$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve the survey data from the request
    $data = json_decode(file_get_contents("php://input"));

    // Extract the updated survey link
    $surveyLink = $data->surveyLink;

    // Use prepared statements to prevent SQL injection
    $stmt = $localDb->prepare("SELECT survey_link FROM survey WHERE survey_id = ?");

    // Specify the survey_id (1 in this case)
    $surveyID = 1;

    if ($stmt) {
        $stmt->bind_param("i", $surveyID); // 'i' for integer
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows === 0) {
            // If no record exists, insert a new one
            $stmt->close();
            $stmt = $localDb->prepare("INSERT INTO survey (survey_id, survey_link) VALUES (?, ?)");
            if ($stmt) {
                $stmt->bind_param("is", $surveyID, $surveyLink);
                if ($stmt->execute()) {
                    $response = ['success' => true, 'error' => null]; // Set error to null on success
                } else {
                    $response = ['success' => false, 'error' => $localDb->error];
                }
            }
        } else {
            // If a record exists, update it
            $stmt->close();
            $stmt = $localDb->prepare("UPDATE survey SET survey_link = ? WHERE survey_id = ?");
            if ($stmt) {
                $stmt->bind_param("si", $surveyLink, $surveyID);
                if ($stmt->execute()) {
                    $response = ['success' => true, 'error' => null];
                } else {
                    $response = ['success' => false, 'error' => $localDb->error];
                }
            }
        }
    } else {
        $response = ['success' => false, 'error' => $localDb->error];
    }

    echo json_encode($response);
}

$localDb->close();
?>