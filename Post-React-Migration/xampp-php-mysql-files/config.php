<?php
// Database configuration
$servername = "localhost";
$username = "root";

// no password for xampp by default
$password = "";

// Database name
$dbname = "PWDRegistry";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set character set to UTF-8
$conn->set_charset("utf8mb4");

// https://www.w3schools.com/php/php_mysql_connect.asp
?>