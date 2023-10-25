<?php
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $events = [];

    $query = "SELECT * FROM calendar ORDER BY start_date"; 
    $result = $localDb->query($query);

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $date = date("F j, Y", strtotime($row['start_date']));
            $row['start_date'] = $date;

            if ($row['end_date'] !== null) {
                $date = date("F j, Y", strtotime($row['end_date']));
                $row['end_date'] = $date;
            } else {
                $row['end_date'] = null;
            }

            $events[] = $row;
        }
        $result->free();
    } else {
        die('Error: ' . $localDb->error);
    }

    header('Content-Type: application/json');
    echo json_encode($events);
}


$localDb->close();
?>
