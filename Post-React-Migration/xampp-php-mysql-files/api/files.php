<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../config.php';

$regNumber = $_GET['regNumber'] ?? null;

if (!$regNumber) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No registration number provided']);
    exit;
}

$stmt = $conn->prepare(
    "SELECT id, file_type, original_filename, stored_filename, file_path, file_size, status, uploaded_at 
    FROM pwd_file_uploads 
    WHERE regNumber = ? 
    ORDER BY uploaded_at DESC"
);

$stmt->bind_param('s', $regNumber);
$stmt->execute();
$result = $stmt->get_result();

$files = [];
while ($row = $result->fetch_assoc()) {
    $files[] = [
        'id' => $row['id'],
        'type' => $row['file_type'],
        'originalFilename' => $row['original_filename'],
        'storedFilename' => $row['stored_filename'],
        'path' => $row['file_path'],
        'size' => $row['file_size'],
        'status' => $row['status'],
        'uploadedAt' => $row['uploaded_at']
    ];
}

echo json_encode([
    'success' => true,
    'files' => $files
]);

$stmt->close();
$conn->close();
?>
