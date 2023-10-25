<?php

header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Local Database Connection
$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

$surveyID = 1;

$stmt = $localDb->prepare("SELECT survey_link FROM survey WHERE survey_id = ?");
if ($stmt) {
    $stmt->bind_param("i", $surveyID); // 'i' for integer

    if ($stmt->execute()) {
        $stmt->bind_result($surveyLink);
        $stmt->fetch();

        if ($surveyLink) {
            $response = ['surveyLink' => $surveyLink];
        } else {
            $response = ['surveyLink' => null]; // If no survey link is found
        }
    } else {
        $response = ['error' => $localDb->error];
    }

    $stmt->close();
} else {
    $response = ['error' => $localDb->error];
}

$localDb->close();

header('Content-Type: application/json');
echo json_encode($response);
 
$localDb->close();
?>