<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

$fileId = $input['fileId'] ?? null;
$status = $input['status'] ?? null;
$adminNotes = $input['adminNotes'] ?? null;
$reviewedBy = $input['reviewedBy'] ?? 'System Administrator';

// Validate required fields
if (!$fileId || !$status) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields: fileId and status']);
    exit;
}

// Validate status value
if (!in_array($status, ['pending', 'approved', 'rejected'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid status. Must be: pending, approved, or rejected']);
    exit;
}

try {
    // Update file status
    $stmt = $conn->prepare(
        "UPDATE pwd_file_uploads 
         SET status = ?, 
             admin_notes = ?, 
             reviewed_by = ?, 
             reviewed_at = CURRENT_TIMESTAMP 
         WHERE id = ?"
    );
    
    $stmt->bind_param('sssi', $status, $adminNotes, $reviewedBy, $fileId);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'File status updated successfully',
            'fileId' => $fileId,
            'status' => $status
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'No file found with the given ID or no changes made'
        ]);
    }
    
    $stmt->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
