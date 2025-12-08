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

// Extract all registration fields (26 fields in total)
$regNumber = $input["regNumber"] ?? null;
$regDate = $input["regDate"] ?? null;
$lastName = $input["lastName"] ?? null;
$firstName = $input["firstName"] ?? null;
$middleName = $input["middleName"] ?? "";
$disability = $input["disability"] ?? null;
$street = $input["street"] ?? null;
$barangay = $input["barangay"] ?? null;
$municipality = $input["municipality"] ?? "Dasmariñas";
$province = $input["province"] ?? "Cavite";
$region = $input["region"] ?? "IV-A";
$tel = $input["tel"] ?? "";
$mobile = $input["mobile"] ?? null;
$email = $input["email"] ?? null;
$dob = $input["dob"] ?? null;
$sex = $input["sex"] ?? null;
$nationality = $input["nationality"] ?? "Filipino";
$blood = $input["blood"] ?? "";
$civil = $input["civil"] ?? null;
$emergencyName = $input["emergencyName"] ?? null;
$emergencyPhone = $input["emergencyPhone"] ?? null;
$emergencyRelationship = $input["emergencyRelationship"] ?? null;
$proofIdentity = $input["proofIdentity"] ?? "";
$proofDisability = $input["proofDisability"] ?? "";
$password = $input["password"] ?? null;
$status = $input["status"] ?? "pending";

// Validate required fields
if (!$regNumber || !$regDate || !$lastName || !$firstName || !$disability || 
    !$street || !$barangay || !$mobile || !$email || !$dob || !$sex || 
    !$civil || !$emergencyName || !$emergencyPhone || !$emergencyRelationship || !$password) {
    echo json_encode([
        "success" => false, 
        "message" => "Missing required fields"
    ]);
    exit;
}

// Check if registration number already exists
$checkRegStmt = $conn->prepare("SELECT COUNT(*) as count FROM pwd_users WHERE regNumber = ?");
$checkRegStmt->bind_param("s", $regNumber);
$checkRegStmt->execute();
$result = $checkRegStmt->get_result();
$row = $result->fetch_assoc();

if ($row['count'] > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Registration number already exists. Please try again."
    ]);
    $checkRegStmt->close();
    $conn->close();
    exit;
}
$checkRegStmt->close();

// Check if email already exists
$checkEmailStmt = $conn->prepare("SELECT COUNT(*) as count FROM pwd_users WHERE email = ?");
$checkEmailStmt->bind_param("s", $email);
$checkEmailStmt->execute();
$result = $checkEmailStmt->get_result();
$row = $result->fetch_assoc();

if ($row['count'] > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Email already exists. Please use a different email."
    ]);
    $checkEmailStmt->close();
    $conn->close();
    exit;
}
$checkEmailStmt->close();

// Insert new user into database
$stmt = $conn->prepare("INSERT INTO pwd_users (
    regNumber, regDate, lastName, firstName, middleName, disability,
    street, barangay, municipality, province, region, tel, mobile, email,
    dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
    emergencyRelationship, proofIdentity, proofDisability, password, status
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

$stmt->bind_param(
    "ssssssssssssssssssssssssss",
    $regNumber, $regDate, $lastName, $firstName, $middleName, $disability,
    $street, $barangay, $municipality, $province, $region, $tel, $mobile, $email,
    $dob, $sex, $nationality, $blood, $civil, $emergencyName, $emergencyPhone,
    $emergencyRelationship, $proofIdentity, $proofDisability, $password, $status
);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Registration successful! Your application is now pending review.",
        "created" => 1,
        "regNumber" => $regNumber
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to save registration data. Please try again."
    ]);
}

$stmt->close();
$conn->close();

// `stmt` https://www.w3schools.com/php/php_mysql_prepared_statements.asp
?>
