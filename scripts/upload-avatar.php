<?php
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

if ($localDb->connect_error) {
    die("Local Database Connection Failed: " . $localDb->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['profile_pic'])) {
        $file = $_FILES['profile_pic'];

        $uploadDir = 'profile_imgs/';
        $uploadPath = $uploadDir . $file['name'];


        echo 'File Name: ' . $file['name'] . '<br>';
        echo 'File Size: ' . $file['size'] . '<br>';
        echo 'Temporary File Path: ' . $file['tmp_name'] . '<br>';
        echo 'Upload Directory: ' . $uploadDir . '<br>';

        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            $username = $_POST['username'];

            if ($localDb->connect_error) {  // Change $db to $localDb here
                echo json_encode(['success' => false, 'error' => $localDb->connect_error]);  // Change $db to $localDb here
            } else {
                $sql = "UPDATE student SET profile_pic = ? WHERE student_lrn = ?";
                $stmt = $localDb->prepare($sql);  // Change $db to $localDb here
                $stmt->bind_param("ss", $uploadPath, $username);

                if ($stmt->execute()) {
                    echo json_encode(['success' => true]);
                } else {
                    echo json_encode(['success' => false, 'error' => $localDb->error]);  // Change $db to $localDb here
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