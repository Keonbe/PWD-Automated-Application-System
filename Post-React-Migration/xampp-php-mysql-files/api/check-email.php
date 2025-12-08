<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

// Include DB connection
require_once "../config.php";

// Get email from query string
$email = $_GET["email"] ?? null;

if (!$email) {
    echo json_encode([
        "success" => false,
        "message" => "Email is required"
    ]);
    exit;
}

// Check if email exists
$stmt = $conn->prepare("SELECT COUNT(*) as count, email FROM pwd_users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

$exists = $row['count'] > 0;
echo json_encode([
    "exists" => $exists,
    "exists_count" => (int)$row['count'],
    "email" => $exists ? $row['email'] : null
]);

$stmt->close();
$conn->close();

// `stmt` https://www.w3schools.com/php/php_mysql_prepared_statements.asp
?>
