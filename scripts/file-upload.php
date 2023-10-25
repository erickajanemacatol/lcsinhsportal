<?php
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Local Database Connection
$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

// Check the connection to the local database
if ($localDb->connect_error) {
    die("Local Database Connection Failed: " . $localDb->connect_error);
}

if (isset($_FILES["file"]) && isset($_POST["student_lrn"]) && isset($_POST["input_index"])) {
    $file = $_FILES["file"];
    $studentLRN = $_POST["student_lrn"];
    $inputIndex = $_POST["input_index"];

    if ($file["error"] == UPLOAD_ERR_OK) {
        $uploadDir = "local_folder/"; // Use the absolute path to your directory
        $originalFileName = basename($file["name"]);

        // Fetch the student's last name from the database based on LRN
        $stmt = $localDb->prepare("SELECT l_name FROM student WHERE student_lrn = ?");
        $stmt->bind_param("s", $studentLRN);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($lastName);
        $stmt->fetch();
        $stmt->free_result();
        $stmt->close();

        if ($lastName) {
            // Define an array of file name suffixes based on the index
            $fileNameSuffixes = array(
                1 => 'CoR',
                2 => 'form_137',
                3 => 'good_moral',
                4 => 'CoEnrolment',
                5 => 'CoRanking',
            );

            // Generate a new file name based on your desired pattern
            $newFileName = $studentLRN . '_' . $lastName . '_' . $fileNameSuffixes[$inputIndex] . '.' . pathinfo($originalFileName, PATHINFO_EXTENSION);

            $uploadFile = $uploadDir . $newFileName; // Define the upload file with the new file name

            if (move_uploaded_file($file["tmp_name"], $uploadFile)) {
                // Check if a student with the same LRN already exists
                $checkQuery = $localDb->prepare("SELECT * FROM student WHERE student_lrn = ?");
                $checkQuery->bind_param("s", $studentLRN); // Bind the studentLRN variable
                $checkQuery->execute();
                $existingStudent = $checkQuery->get_result()->fetch_assoc();

                if ($existingStudent) {
                    // Update the student record based on the input index
                    $updateField = $fileNameSuffixes[$inputIndex];

                    // Construct the SQL query dynamically
                    $sql = "UPDATE student SET $updateField = ? WHERE student_lrn = ?";
                    $stmt = $localDb->prepare($sql);
                    $stmt->bind_param("ss", $uploadFile, $studentLRN);
                } else {
                    $response = array('success' => false, 'error' => 'Student with LRN not found.');
                    echo json_encode($response);
                    exit;
                }

                if ($stmt->execute()) {
                    $response = array('success' => true, 'message' => 'File uploaded successfully');
                    echo json_encode($response);
                } else {
                    $response = array('success' => false, 'error' => 'Error updating student record: ' . $stmt->error);
                    echo json_encode($response);
                }
            } else {
                $response = array('success' => false, 'error' => 'Error moving the uploaded file.');
                echo json_encode($response);
            }
        } else {
            $response = array('success' => false, 'error' => 'Student with LRN not found.');
            echo json_encode($response);
        }
    } else {
        $response = array('success' => false, 'error' => 'File upload error: ' . $file['error']);
        echo json_encode($response);
    }
}

// Close the database connection
$localDb->close();
?>
