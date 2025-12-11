<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once "../config.php";

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode(["success" => false, "message" => "No input received"]);
    exit;
}

$regNumber = isset($input['regNumber']) ? trim($input['regNumber']) : null;
$email = isset($input['email']) ? trim(strtolower($input['email'])) : null;
$newPassword = isset($input['newPassword']) ? trim($input['newPassword']) : null;

// Validate required fields
if (!$regNumber || !$email || !$newPassword) {
    echo json_encode([
        "success" => false,
        "message" => "Registration number, email, and new password are required"
    ]);
    exit;
}

try {
    // Verify that the user exists with both regNumber and email
    $stmt = $conn->prepare("
        SELECT id FROM pwd_users 
        WHERE TRIM(regNumber) = ? AND LOWER(TRIM(email)) = ?
        LIMIT 1
    ");
    $stmt->bind_param("ss", $regNumber, $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode([
            "success" => false,
            "message" => "Registration number and email do not match any account"
        ]);
        exit;
    }

    // User found - update password
    $update = $conn->prepare("
        UPDATE pwd_users 
        SET password = ?, updatedAt = CURRENT_TIMESTAMP 
        WHERE TRIM(regNumber) = ? AND LOWER(TRIM(email)) = ?
    ");
    $update->bind_param("sss", $newPassword, $regNumber, $email);
    $ok = $update->execute();

    if ($ok && $update->affected_rows > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Password reset successfully. You can now log in with your new password."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Failed to reset password"
        ]);
    }

    $stmt->close();
    $update->close();

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}

$conn->close();
?>
