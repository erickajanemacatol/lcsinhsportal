<?php
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$baseDirectory = "C:/xampp/htdocs/"; // Your base directory

if (isset($_GET["file"]) && isset($_GET["category"])) {
    $relativePath = $_GET["file"];
    $category = $_GET["category"]; // The parameter contains the category of the file
    $file = $baseDirectory . $relativePath;

    if (file_exists($file)) {
        $ext = pathinfo($file, PATHINFO_EXTENSION);
        $contentTypes = [
            "pdf" => "application/pdf",
            "jpg" => "image/jpeg",
            "jpeg" => "image/jpeg",
            "png" => "image/png",
            "gif" => "image/gif",
            "doc" => "application/msword",  // For older .doc files
            "docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",  // For newer .docx files
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
    echo "File parameter or category not provided.";
}
?>