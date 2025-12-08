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

// Extract login credentials and normalize
$adminEmail = $input["adminEmail"] ?? null;
$adminPassword = $input["adminPassword"] ?? null;

// Normalize input to avoid mismatches caused by casing or extra spaces
$adminEmail_norm = $adminEmail ? strtolower(trim($adminEmail)) : null;
$adminPassword_norm = $adminPassword ? trim($adminPassword) : null;

// Validate required fields
if (!$adminEmail_norm || !$adminPassword_norm) {
    echo json_encode([
        "success" => false,
        "message" => "Please provide both email and password"
    ]);
    exit;
}

try {
    // Prepare SQL statement to prevent SQL injection
    // Use LOWER(TRIM(adminEmail)) to match normalized input value
    $stmt = $conn->prepare("SELECT 
        id, adminEmail, adminName, createdAt
    FROM admin_users 
    WHERE LOWER(TRIM(adminEmail)) = ? AND adminPassword = ?
    LIMIT 1");
    
    $stmt->bind_param("ss", $adminEmail_norm, $adminPassword_norm);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $admin = $result->fetch_assoc();
        
        // Return success with admin data
        echo json_encode([
            "success" => true,
            "message" => "Admin login successful",
            "admin" => $admin
        ]);
    } else {
        // Invalid credentials
        echo json_encode([
            "success" => false,
            "message" => "Invalid admin credentials"
        ]);
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Admin login error: " . $e->getMessage()
    ]);
}

$conn->close();
?>
