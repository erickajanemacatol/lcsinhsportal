<?php

// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during options requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

require 'data_sync.php';

// Local Database Connection
$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

// Check the connection to the local database
if ($localDb->connect_error) {
    die("Local Database Connection Failed: " . $localDb->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON data from the request body
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);

    if (!empty($data['username']) && !empty($data['password'])) {
        $username = $data['username'];
        $password = $data['password'];

        // Role-based login query based on role_id
        $loginQuery = "SELECT * FROM users WHERE username = ? AND password_hash = ?";

        // Mapping role ID to role (1-admin, 0-student, 2-faculty)
        $roleMapping = [
            0 => "student",
            1 => "admin",
            2 => "faculty"
        ];

        // Create a prepared statement
        $stmt = $localDb->prepare($loginQuery);

        // Bind parameters
        $stmt->bind_param("ss", $username, $password);

        // Execute the query
        $stmt->execute();

        // Get the result
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            // Login successful
            $user = $result->fetch_assoc();
            $roleName = $roleMapping[$user['role_id']]; // Get the role name from the mapping
            echo json_encode(['success' => true, 'role_id' => $user['role_id']]);
        } else {
            // Login failed
            // You can redirect or return an error response here
            echo json_encode(['success' => false]);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    }
}

$localDb->close();
?>
