<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

// Include DB connection
require_once "../config.php";

// Get regNumber from query string
$regNumber = $_GET["regNumber"] ?? null;

if (!$regNumber) {
    echo json_encode([
        "success" => false,
        "message" => "Registration number is required"
    ]);
    exit;
}

// Check if registration number exists
$stmt = $conn->prepare("SELECT COUNT(*) as count FROM pwd_users WHERE regNumber = ?");
$stmt->bind_param("s", $regNumber);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

$exists = $row['count'] > 0;
echo json_encode([
    "exists" => $exists,
    "exists_count" => (int)$row['count']
]);

$stmt->close();
$conn->close();

// `stmt` https://www.w3schools.com/php/php_mysql_prepared_statements.asp
?>
