<?php
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

if ($localDb->connect_error) {
    die("Local Database Connection Failed: " . $localDb->connect_error);
}

$maxFileSize = 3 * 1024 * 1024; // 3MB in bytes

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['news'])) {
        $file = $_FILES['news'];

        // Check if the file size exceeds the limit
        if ($file['size'] > $maxFileSize) {
            echo json_encode(['success' => false, 'error' => 'File size exceeds the maximum allowed size.']);
            exit;
        }

        // Debug: Log POST and FILES data
        error_log("POST data: " . print_r($_POST, true));
        error_log("FILES data: " . print_r($_FILES, true));

        // Retrieve the latest news_id from the database
        $latest_news_id = 0;
        $sql_get_latest_id = "SELECT MAX(news_id) AS latest_id FROM news";
        $result = $localDb->query($sql_get_latest_id);
        if ($result) {
            $row = $result->fetch_assoc();
            if ($row && !is_null($row['latest_id'])) {
                $latest_news_id = intval($row['latest_id']);
            }
        }

        // Increment the news_id to generate the next filename
        $news_id = $latest_news_id + 1;

        // Combine "news" with the news_id as the filename
        $file_name = 'news_' . $news_id . '_' . $file['name'];
        $uploadDir = 'news/';
        $uploadPath = $uploadDir . $file_name;

        // Debug: Log file-related information
        error_log("File Name: " . $file_name);
        error_log("File Size: " . $file['size']);
        error_log("Temporary File Path: " . $file['tmp_name']);
        error_log("Upload Directory: " . $uploadDir);

        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            if ($localDb->connect_error) {
                echo json_encode(['success' => false, 'error' => $localDb->connect_error]);
            } else {
                $sql = "INSERT INTO news (news_cont, news_id) VALUES (?, ?)";
                $stmt = $localDb->prepare($sql);
                $stmt->bind_param("ss", $uploadPath, $news_id);

                if ($stmt->execute()) {
                    echo json_encode(['success' => true]);
                } else {
                    echo json_encode(['success' => false, 'error' => $localDb->error]);
                }

                $stmt->close();
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'File upload failed']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'No file uploaded']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
}



$localDb->close();
?>
