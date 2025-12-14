<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");
header("Content-Type: application/json");

// Include DB connection
require_once "../config.php";

try {
    // Prepare SQL statement to prevent SQL injection
    $stmt = $conn->prepare("SELECT 
        id, regNumber, regDate, lastName, firstName, middleName, disability,
        street, barangay, municipality, province, region, tel, mobile, email,
        dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
        emergencyRelationship, proofIdentity, proofDisability, 
        password, status,
        createdAt, updatedAt
    FROM pwd_users");
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    // Return success with user data
    echo json_encode([
        "success" => true,
        "message" => "User data retrieved successfully",
        "users" => $users
    ]);
    
    $stmt->close();
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error retrieving user data: " . $e->getMessage()
    ]);
}

$conn->close();
?>
