<?php
header('Access-Control-Allow-Origin: http://localhost:3000');

require_once __DIR__ . '/../config.php';

$filePath = $_GET['path'] ?? '';

if (empty($filePath)) {
    http_response_code(400);
    echo 'Missing file path';
    exit;
}

// Security: Ensure the path is within uploads directory
$uploadsDir = __DIR__ . '/../uploads/';

// Normalize the file path (remove any directory traversal attempts)
$filePath = str_replace(['../', '..\\'], '', $filePath);

// Remove "uploads/" prefix if it exists in the path (since we're already adding it)
$filePath = preg_replace('#^uploads[/\\\\]#', '', $filePath);

// Build the full path
$fullPath = $uploadsDir . $filePath;

// Check if file exists before doing realpath (realpath returns false if file doesn't exist)
if (!file_exists($fullPath)) {
    http_response_code(404);
    echo 'File not found at path: ' . htmlspecialchars($filePath);
    exit;
}

// Get real path and verify it's within uploads directory
$realFullPath = realpath($fullPath);
$realUploadsDir = realpath($uploadsDir);

if (!$realFullPath || strpos($realFullPath, $realUploadsDir) !== 0) {
    http_response_code(403);
    echo 'Access denied - Invalid path';
    exit;
}

try {
    // Detect MIME type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $realFullPath);
    finfo_close($finfo);
    
    // Get filename from path
    $filename = basename($realFullPath);
    
    // Serve file INLINE (for viewing in browser)
    header('Content-Type: ' . $mimeType);
    header('Content-Disposition: inline; filename="' . $filename . '"');
    header('Content-Length: ' . filesize($realFullPath));
    
    readfile($realFullPath);
    
} catch (Exception $e) {
    http_response_code(500);
    echo 'Error: ' . $e->getMessage();
}
?>
