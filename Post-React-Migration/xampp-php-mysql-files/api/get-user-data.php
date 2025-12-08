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

// Extract registration number (userId)
$regNumber = $input["regNumber"] ?? null;

// Normalize input to avoid mismatches
$regNumber_norm = $regNumber ? trim($regNumber) : null;

// Validate required field
if (!$regNumber_norm) {
    echo json_encode([
        "success" => false,
        "message" => "Please provide registration number"
    ]);
    exit;
}

try {
    // Prepare SQL statement to prevent SQL injection
    // Note: proofIdentity and proofDisability store the filename
    $stmt = $conn->prepare("SELECT 
        id, regNumber, regDate, lastName, firstName, middleName, disability,
        street, barangay, municipality, province, region, tel, mobile, email,
        dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
        emergencyRelationship, proofIdentity, proofDisability, 
        password, status,
        createdAt, updatedAt
    FROM pwd_users 
    WHERE TRIM(regNumber) = ?
    LIMIT 1");
    
    $stmt->bind_param("s", $regNumber_norm);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $matched = $result->num_rows;
    if ($matched > 0) {
        $user = $result->fetch_assoc();

        // Return success with user data
        $resp = [
            "success" => true,
            "message" => "User data retrieved successfully",
            "user" => $user
        ];

        if (!empty($input['debug'])) {
            $resp['debug'] = [
                'regNumber_norm' => $regNumber_norm,
                'matched_rows' => $matched
            ];
        }

        echo json_encode($resp);
    } else {
        // User not found
        $resp = [
            "success" => false,
            "message" => "No user found with registration number: " . $regNumber_norm
        ];

        if (!empty($input['debug'])) {
            $resp['debug'] = [
                'regNumber_norm' => $regNumber_norm,
                'matched_rows' => $matched
            ];
        }

        echo json_encode($resp);
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error retrieving user data: " . $e->getMessage()
    ]);
}

$conn->close();
?>
