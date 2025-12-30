<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../config.php';

// Define constants
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_MIME_TYPES', [
    'application/pdf', 
    'image/jpeg', 
    'image/png',
    'image/jpg'  // Some systems report this
]);
define('ALLOWED_EXTENSIONS', ['pdf', 'jpg', 'jpeg', 'png']);

// Create uploads directory if not exists
$uploadBaseDir = __DIR__ . '/../uploads/';
$uploadSubDir = 'identity/';
if (isset($_POST['fileType'])) {
    if ($_POST['fileType'] == 'medical_certificate') {
        $uploadSubDir = 'certificates/';
    } elseif ($_POST['fileType'] == 'id_photo') {
        $uploadSubDir = 'idphoto/';
    }
}
$uploadDir = $uploadBaseDir . $uploadSubDir;

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['file'])) {
    $file = $_FILES['file'];
    $fileType = $_POST['fileType'] ?? 'identity_proof';
    $regNumber = $_POST['regNumber'] ?? 'UNKNOWN';
    
    // Validate file size
    if ($file['size'] > MAX_FILE_SIZE) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'File too large. Maximum 5MB allowed.'
        ]);
        exit;
    }
    
    // Verify MIME type using finfo
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    // Also check file extension as backup
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    // Accept if MIME type matches OR extension is valid (some files have incorrect MIME detection)
    $mimeValid = in_array($mime, ALLOWED_MIME_TYPES);
    $extValid = in_array($extension, ALLOWED_EXTENSIONS);
    
    if (!$mimeValid && !$extValid) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid file type. Only PDF, JPG, PNG allowed.',
            'debug' => [
                'detected_mime' => $mime,
                'extension' => $extension
            ]
        ]);
        exit;
    }
    
    // Generate unique filename: cert_1704456789_random.pdf
    $timestamp = time();
    $random = substr(str_shuffle('0123456789abcdefghijklmnopqrstuvwxyz'), 0, 6);
    $storedName = $fileType . '_' . $timestamp . '_' . $random . '.' . $extension;
    $destination = $uploadDir . $storedName;
    
    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $destination)) {
        // Save to database
        $filePath = 'uploads/' . $uploadSubDir . $storedName;
        
        $stmt = $conn->prepare(
            "INSERT INTO pwd_file_uploads 
            (regNumber, file_type, original_filename, stored_filename, file_path, file_size, mime_type) 
            VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        
        $stmt->bind_param(
            'sssssss',
            $regNumber,
            $fileType,
            $file['name'],
            $storedName,
            $filePath,
            $file['size'],
            $mime
        );
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'fileId' => $conn->insert_id,
                'filename' => $storedName,
                'filePath' => $filePath,
                'size' => $file['size'],
                'message' => 'File uploaded successfully'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'Database error: ' . $stmt->error
            ]);
        }
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to save file'
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'No file provided'
    ]);
}

$conn->close();
?>
