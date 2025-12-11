<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

// Include DB connection
require_once "../config.php";

try {
    // Prepare SQL statement to get the oldest pending application
    $stmt = $conn->prepare("SELECT 
        id, regNumber, regDate, lastName, firstName, middleName, disability,
        street, barangay, municipality, province, region, tel, mobile, email,
        dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
        emergencyRelationship, proofIdentity, proofDisability, 
        password, status,
        createdAt, updatedAt
    FROM pwd_users 
    WHERE status = 'pending'
    ORDER BY createdAt ASC
    LIMIT 1");
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        // Return success with user data
        echo json_encode([
            "success" => true,
            "message" => "Pending application retrieved successfully",
            "user" => $user
        ]);
    } else {
        // No pending applications found
        echo json_encode([
            "success" => false,
            "message" => "No pending applications found"
        ]);
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error retrieving pending application: " . $e->getMessage()
    ]);
}

$conn->close();
?>
