<?php
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$baseDirectory = "C:/xampp/htdocs/"; // base directory

if (isset($_GET["file"])) {
    $documentPath = $_GET["file"];
    $file = $baseDirectory . $documentPath;

    if (file_exists($file)) {
        $ext = pathinfo($file, PATHINFO_EXTENSION);
        $contentTypes = [
            "pdf" => "application/pdf",
            "jpg" => "image/jpeg",
            "jpeg" => "image/jpeg",
            "png" => "image/png",
            "gif" => "image/gif",
        ];

        $contentType = $contentTypes[$ext] ?? 'application/octet-stream';

        header('Content-Type: ' . $contentType);
        header('Content-Disposition: inline; filename="' . basename($file) . '"');
        readfile($file);
        exit;
    } else {
        echo "File not found.";
    }
} else {
    echo "File parameter not provided.";
}
?>
