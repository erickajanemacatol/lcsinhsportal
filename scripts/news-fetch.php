<?php

header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

if ($localDb->connect_error) {
    die("Local Database Connection Failed: " . $localDb->connect_error);
}

// Perform a database query to retrieve image paths from the 'news' table
$sql = "SELECT news_cont FROM news";
$result = $localDb->query($sql);

if ($result) {
    $imageUrls = [];
    while ($row = $result->fetch_assoc()) {
        $imageUrls[] = "http://localhost/" . $row['news_cont'];
    }

    // Return the list of image URLs as a JSON response
    echo json_encode(["success" => true, "images" => $imageUrls]);
} else {
    echo json_encode(["success" => false, "error" => "Failed to retrieve images"]);
}

$localDb->close();
?>

