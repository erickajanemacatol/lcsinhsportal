<?php
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents("php://input"));
  $calId = $data->cal_id;

  $query = "DELETE FROM calendar WHERE cal_id = ?";
  $stmt = $localDb->prepare($query);
  $stmt->bind_param("i", $calId);

  if ($stmt->execute()) {
    echo json_encode(["message" => "Event deleted successfully"]);
  } else {
    echo json_encode(["error" => "Error deleting event"]);
  }

  $stmt->close();
}

$localDb->close();
?>
