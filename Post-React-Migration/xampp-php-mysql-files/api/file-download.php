<?php
require_once '../config.php';

$fileId = $_GET['fileId'] ?? null;

if (!$fileId) {
    http_response_code(400);
    exit('No file ID provided');
}

// Get file info from database
$stmt = $conn->prepare("SELECT file_path, original_filename, mime_type FROM pwd_file_uploads WHERE id = ?");
$stmt->bind_param('i', $fileId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    exit('File not found');
}

$row = $result->fetch_assoc();
$filePath = __DIR__ . '/../' . $row['file_path'];

if (!file_exists($filePath)) {
    http_response_code(404);
    exit('File not found on server');
}

// Serve the file
header('Content-Type: ' . $row['mime_type']);
header('Content-Length: ' . filesize($filePath));
header('Content-Disposition: attachment; filename="' . $row['original_filename'] . '"');

readfile($filePath);

$stmt->close();
$conn->close();
?>
