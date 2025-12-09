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
$currentPassword = isset($input['currentPassword']) ? trim($input['currentPassword']) : null;
$newPassword = isset($input['newPassword']) ? trim($input['newPassword']) : null;

if (!$regNumber || !$currentPassword || !$newPassword) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

try {
    // Verify current password
    $stmt = $conn->prepare("SELECT password FROM pwd_users WHERE TRIM(regNumber) = ? LIMIT 1");
    $stmt->bind_param("s", $regNumber);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "User not found"]);
        exit;
    }

    $row = $result->fetch_assoc();
    $storedPassword = $row['password'];

    // NOTE: Current implementation stores plain text passwords in sample data.
    // In production use password_hash() and password_verify().
    if ($storedPassword !== $currentPassword) {
        echo json_encode(["success" => false, "message" => "Current password is incorrect"]);
        exit;
    }

    // Update to new password
    $update = $conn->prepare("UPDATE pwd_users SET password = ?, updatedAt = CURRENT_TIMESTAMP WHERE TRIM(regNumber) = ?");
    $update->bind_param("ss", $newPassword, $regNumber);
    $ok = $update->execute();

    if ($ok) {
        echo json_encode(["success" => true, "message" => "Password updated successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update password"]);
    }

    $stmt->close();
    $update->close();

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}

$conn->close();
?>