<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include DB connection
require_once "../config.php";

// Read JSON input
$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode(["success" => false, "message" => "No data received"]);
    exit;
}

// Extract registration number, status, rejection reason, and admin name
$regNumber = $input["regNumber"] ?? null;
$status = $input["status"] ?? null;
$rejectionReason = $input["rejectionReason"] ?? null;
$adminName = $input["adminName"] ?? 'System Administrator';

// Validate required fields
if (!$regNumber || !$status) {
    echo json_encode([
        "success" => false,
        "message" => "Please provide registration number and status"
    ]);
    exit;
}

// Ensure status is either 'accepted' or 'denied'
if ($status !== 'accepted' && $status !== 'denied') {
    echo json_encode([
        "success" => false,
        "message" => "Invalid status provided. Must be 'accepted' or 'denied'."
    ]);
    exit;
}

try {
    // Start transaction
    $conn->begin_transaction();
    
    // Update application status
    $stmt = $conn->prepare("UPDATE pwd_users SET status = ?, rejectionReason = ? WHERE regNumber = ?");
    $stmt->bind_param("sss", $status, $rejectionReason, $regNumber);
    
    if (!$stmt->execute()) {
        throw new Exception("Error updating application: " . $stmt->error);
    }
    
    if ($stmt->affected_rows === 0) {
        $conn->rollback();
        echo json_encode([
            "success" => false,
            "message" => "No user found with the provided registration number: " . $regNumber
        ]);
        exit;
    }
    
    $stmt->close();
    
    // Update file status to match application status
    $fileStatus = ($status === 'accepted') ? 'approved' : 'rejected';
    $adminNotes = ($status === 'denied' && $rejectionReason) ? $rejectionReason : null;
    
    $fileStmt = $conn->prepare(
        "UPDATE pwd_file_uploads 
         SET status = ?, 
             admin_notes = ?, 
             reviewed_by = ?, 
             reviewed_at = CURRENT_TIMESTAMP 
         WHERE regNumber = ?"
    );
    $fileStmt->bind_param("ssss", $fileStatus, $adminNotes, $adminName, $regNumber);
    $fileStmt->execute();
    $filesUpdated = $fileStmt->affected_rows;
    $fileStmt->close();
    
    // Commit transaction
    $conn->commit();
    
    $responseData = [
        "success" => true,
        "message" => "Application status updated successfully",
        "filesUpdated" => $filesUpdated
    ];
    
    // Add rejection reason to response if status is denied
    if ($status === 'denied' && $rejectionReason) {
        $responseData["rejectionReason"] = $rejectionReason;
    }
    
    echo json_encode($responseData);
    
} catch (Exception $e) {
    $conn->rollback();
    error_log("Update status error: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Error updating application status: " . $e->getMessage()
    ]);
}

$conn->close();
?>
