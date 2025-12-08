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
$email = $input["email"] ?? null;
$password = $input["password"] ?? null;

// Normalize input to avoid mismatches caused by casing or extra spaces
$email_norm = $email ? strtolower(trim($email)) : null;
$password_norm = $password ? trim($password) : null;

// Validate required fields
if (!$email_norm || !$password_norm) {
    echo json_encode([
        "success" => false,
        "message" => "Please provide both email and password"
    ]);
    exit;
}

try {
    // Prepare SQL statement to prevent SQL injection
    // Use LOWER(TRIM(email)) to match normalized input value
    $stmt = $conn->prepare("SELECT 
        id, regNumber, regDate, lastName, firstName, middleName, disability,
        street, barangay, municipality, province, region, tel, mobile, email,
        dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
        emergencyRelationship, proofIdentity, proofDisability, status,
        createdAt, updatedAt
    FROM pwd_users 
    WHERE LOWER(TRIM(email)) = ? AND password = ?
    LIMIT 1");
    
    $stmt->bind_param("ss", $email_norm, $password_norm);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $matched = $result->num_rows;
    if ($matched > 0) {
        $user = $result->fetch_assoc();

        // Return success with user data
        $resp = [
            "success" => true,
            "message" => "Login successful",
            "user" => $user
        ];

        if (!empty($input['debug'])) {
            $resp['debug'] = [
                'email_norm' => $email_norm,
                'password_norm' => $password_norm,
                'matched_rows' => $matched
            ];
        }

        echo json_encode($resp);
    } else {
        // Invalid credentials
        $resp = [
            "success" => false,
            "message" => "Invalid email or password"
        ];

        if (!empty($input['debug'])) {
            $resp['debug'] = [
                'email_norm' => $email_norm,
                'password_norm' => $password_norm,
                'matched_rows' => $matched
            ];
        }

        echo json_encode($resp);
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Login error: " . $e->getMessage()
    ]);
}

$conn->close();
?>
