<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Include DB connection
require_once "../config.php";

// Read JSON input
$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode(["success" => false, "message" => "No data received"]);
    exit;
}

// Extract registration number, status, and rejection reason
$regNumber = $input["regNumber"] ?? null;
$status = $input["status"] ?? null;
$rejectionReason = $input["rejectionReason"] ?? null;

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
    // Prepare SQL statement to prevent SQL injection
    $stmt = $conn->prepare("UPDATE pwd_users SET status = ?, rejectionReason = ? WHERE regNumber = ?");
    $stmt->bind_param("sss", $status, $rejectionReason, $regNumber);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode([
                "success" => true,
                "message" => "Application status updated successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "No user found with the provided registration number"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Error updating application status"
        ]);
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error updating application status: " . $e->getMessage()
    ]);
}

$conn->close();
?>
