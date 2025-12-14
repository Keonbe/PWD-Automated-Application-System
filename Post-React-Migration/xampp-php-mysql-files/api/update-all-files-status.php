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

$regNumber = $input['regNumber'] ?? null;
$status = $input['status'] ?? null;
$adminNotes = $input['adminNotes'] ?? null;
$reviewedBy = $input['reviewedBy'] ?? 'System Administrator';

// Validate required fields
if (!$regNumber || !$status) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields: regNumber and status']);
    exit;
}

// Validate status value
if (!in_array($status, ['pending', 'approved', 'rejected'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid status. Must be: pending, approved, or rejected']);
    exit;
}

try {
    // Update all files for this registration number
    $stmt = $conn->prepare(
        "UPDATE pwd_file_uploads 
         SET status = ?, 
             admin_notes = ?, 
             reviewed_by = ?, 
             reviewed_at = CURRENT_TIMESTAMP 
         WHERE regNumber = ?"
    );
    
    $stmt->bind_param('ssss', $status, $adminNotes, $reviewedBy, $regNumber);
    $stmt->execute();
    
    $affectedRows = $stmt->affected_rows;
    
    if ($affectedRows > 0) {
        echo json_encode([
            'success' => true,
            'message' => "Updated $affectedRows file(s) successfully",
            'regNumber' => $regNumber,
            'status' => $status,
            'filesUpdated' => $affectedRows
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'No files found for this registration number or no changes made'
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
