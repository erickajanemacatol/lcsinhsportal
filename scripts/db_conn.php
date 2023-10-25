<?php

// Remote Database Connection
$remoteDb = new mysqli('srv1041.hstgr.io', 'u306800464_lcsinhsuser', 'wCJ/PwY!8', 'u306800464_lcsinhs');

// Check the connection to the remote database
if ($remoteDb->connect_error) {
    die("Remote Database Connection Failed: " . $remoteDb->connect_error);
}  else {
    echo "Database connection is successful. HIIII";
}

// Local Database Connection
$localDb = new mysqli('localhost', 'lcsinhs_portal', 'wK5z88EImGNUU*9h', 'lcsinhs_portal');

// Check the connection to the local database
if ($localDb->connect_error) {
    die("Local Database Connection Failed: " . $localDb->connect_error);
} else {
    echo "Database connection is successful. HIIII";
}

// Close database connections when you're done
$remoteDb->close();
$localDb->close();
?>
