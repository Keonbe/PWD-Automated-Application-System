<?php
header('Access-Control-Allow-Origin: http://localhost:3000');

require_once __DIR__ . '/../config.php';

$fileId = $_GET['fileId'] ?? '';

if (empty($fileId)) {
    http_response_code(400);
    echo 'Missing fileId';
    exit;
}

try {
    $stmt = $conn->prepare("SELECT original_filename, file_path, mime_type FROM pwd_file_uploads WHERE id = ?");
    $stmt->bind_param('i', $fileId);
    $stmt->execute();
    $result = $stmt->get_result();
    $file = $result->fetch_assoc();
    
    if (!$file) {
        http_response_code(404);
        echo 'File not found';
        exit;
    }
    
    $fullPath = __DIR__ . '/../' . $file['file_path'];
    
    if (!file_exists($fullPath)) {
        http_response_code(404);
        echo 'File not found on disk';
        exit;
    }
    
    // Serve file inline (for viewing in browser)
    header('Content-Type: ' . $file['mime_type']);
    header('Content-Disposition: inline; filename="' . $file['original_filename'] . '"');
    header('Content-Length: ' . filesize($fullPath));
    
    readfile($fullPath);
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo 'Error: ' . $e->getMessage();
}
?>
