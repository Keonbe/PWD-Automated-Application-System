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

if (!$regNumber) {
    echo json_encode(["success" => false, "message" => "Registration number is required"]);
    exit;
}

// Get optional profile fields
$address = isset($input['address']) ? trim($input['address']) : null;
$contactNumber = isset($input['contactNumber']) ? trim($input['contactNumber']) : null;
$emergencyContact = isset($input['emergencyContact']) ? trim($input['emergencyContact']) : null;
$emergencyNumber = isset($input['emergencyNumber']) ? trim($input['emergencyNumber']) : null;

try {
    // Verify user exists
    $stmt = $conn->prepare("SELECT id FROM pwd_users WHERE TRIM(regNumber) = ? LIMIT 1");
    $stmt->bind_param("s", $regNumber);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "User not found"]);
        exit;
    }

    // Build dynamic UPDATE query
    $updateFields = [];
    $updateParams = [];
    $paramTypes = "";

    if ($address !== null) {
        $updateFields[] = "street = ?";
        $updateParams[] = $address;
        $paramTypes .= "s";
    }

    if ($contactNumber !== null) {
        $updateFields[] = "mobile = ?";
        $updateParams[] = $contactNumber;
        $paramTypes .= "s";
    }

    if ($emergencyContact !== null) {
        $updateFields[] = "emergencyName = ?";
        $updateParams[] = $emergencyContact;
        $paramTypes .= "s";
    }

    if ($emergencyNumber !== null) {
        $updateFields[] = "emergencyPhone = ?";
        $updateParams[] = $emergencyNumber;
        $paramTypes .= "s";
    }

    // If no fields to update
    if (empty($updateFields)) {
        echo json_encode(["success" => true, "message" => "No changes made"]);
        exit;
    }

    // Add regNumber to parameters for WHERE clause
    $updateParams[] = $regNumber;
    $paramTypes .= "s";

    // Build and execute UPDATE query
    $sql = "UPDATE pwd_users SET " . implode(", ", $updateFields) . " WHERE TRIM(regNumber) = ?";
    $update = $conn->prepare($sql);
    $update->bind_param($paramTypes, ...$updateParams);
    $ok = $update->execute();

    if ($ok) {
        echo json_encode(["success" => true, "message" => "Profile updated successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update profile"]);
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}

$conn->close();
?>
