<?php

//database connection
$remoteDb = new mysqli('srv1041.hstgr.io', 'u306800464_lcsinhsuser', 'wCJ/PwY!8', 'u306800464_lcsinhs');
$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

function synchronizeData($remoteDb, $localDb)
{
    $userSql = "SELECT * FROM accounts WHERE ustatus = 1";
    $userResult = $remoteDb->query($userSql);

    while ($userRow = $userResult->fetch_assoc()) {
        $existingUsername = $userRow['uname'];
        $checkSql = "SELECT COUNT(*) as count FROM users WHERE username = '$existingUsername'";
        $checkResult = $localDb->query($checkSql);
        $count = $checkResult->fetch_assoc()['count'];

        if ($count == 0) {
            $insertSql = "INSERT INTO users (username, password_hash, role_id) VALUES ('" . $userRow['uname'] . "', '" . $userRow['upass'] . "', '" . $userRow['utype'] . "')";
            $localDb->query($insertSql);
        }
    }

    // Synchronize student data
    $studentSql = "SELECT lname, fname, lrn FROM appform WHERE stat = '1'";
    $studentResult = $remoteDb->query($studentSql);

    while ($studentRow = $studentResult->fetch_assoc()) {
        $existingLRN = $studentRow['lrn'];
        $checkSql = "SELECT COUNT(*) as count FROM student WHERE student_lrn = '$existingLRN'";
        $checkResult = $localDb->query($checkSql);
        $count = $checkResult->fetch_assoc()['count'];

        if ($count == 0) {
            $lname = $studentRow['lname'];
            $fname = $studentRow['fname'];
            $lrn = $studentRow['lrn'];

            $insertSql = "INSERT INTO student (f_name, l_name, student_lrn ) VALUES ('$fname', '$lname', '$lrn')";
            $localDb->query($insertSql);
        }
    }

    $facultySql = "SELECT employee_no FROM faculty";
    $facultyResult = $localDb->query($facultySql);
    
    while ($facultyRow = $facultyResult->fetch_assoc()) {
        $existingEmp = $facultyRow['employee_no'];

        $checkSql = "SELECT COUNT(*) as count FROM users WHERE username = '$existingEmp'";
        $checkResult = $localDb->query($checkSql);
        $count = $checkResult->fetch_assoc()['count'];
    
        if ($count == 0) {
            $fusername = $facultyRow['employee_no'];
            $fpass = $facultyRow['employee_no'];
            $role_id = 2;
    
            $insertSql = "INSERT INTO users (username, password_hash, role_id) VALUES ('$fusername', '$fpass', '$role_id')";
            $localDb->query($insertSql);
    
            // Debugging output
            echo "Inserted new user: $fusername<br>";
        }
    }
    

}
// Synchronize data from the remote to the local database
synchronizeData($remoteDb, $localDb);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT * FROM users";
    $result = $localDb->query($query);

    $data = array();
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    if ($result) {
        header('Content-Type: application/json');
        echo json_encode($data);
    } else {
        echo "Error: " . $localDb->error;
    }
}


?>