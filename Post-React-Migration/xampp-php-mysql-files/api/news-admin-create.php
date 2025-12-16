<?php
/**
 * Admin: Create News Post
 * 
 * @method POST
 * @access Admin only
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config.php';

// Note: In production, add admin session validation here

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
    exit;
}

// Extract and validate fields
$title = isset($input['title']) ? trim($input['title']) : null;
$excerpt = isset($input['excerpt']) ? trim($input['excerpt']) : null;
$content = isset($input['content']) ? trim($input['content']) : null;
$slug = isset($input['slug']) ? trim($input['slug']) : null;
$imagePath = isset($input['imagePath']) ? trim($input['imagePath']) : null;
$imageAlt = isset($input['imageAlt']) ? trim($input['imageAlt']) : null;
$status = isset($input['status']) ? trim($input['status']) : 'draft';
$category = isset($input['category']) ? trim($input['category']) : 'announcement';
$publishedAt = isset($input['publishedAt']) ? trim($input['publishedAt']) : null;
$createdBy = isset($input['createdBy']) ? trim($input['createdBy']) : 'admin@dasma.gov.ph';

// Validate required fields
if (!$title || !$excerpt || !$content) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Missing required fields: title, excerpt, content'
    ]);
    exit;
}

// Generate slug from title if not provided
if (!$slug) {
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title), '-'));
}

// Ensure unique slug
try {
    $checkStmt = $conn->prepare("SELECT id FROM pwd_news_posts WHERE slug = ?");
    $checkStmt->bind_param('s', $slug);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    
    if ($checkResult->num_rows > 0) {
        // Append timestamp to make slug unique
        $slug = $slug . '-' . time();
    }
    $checkStmt->close();
} catch (Exception $e) {
    // Continue with original slug if check fails
}

// Validate status
$validStatuses = ['draft', 'published', 'archived'];
if (!in_array($status, $validStatuses)) {
    $status = 'draft';
}

// If publishing, set published_at if not provided
if ($status === 'published' && !$publishedAt) {
    $publishedAt = date('Y-m-d H:i:s');
}

try {
    $stmt = $conn->prepare(
        "INSERT INTO pwd_news_posts 
         (title, excerpt, content, slug, image_path, image_alt, status, published_at, category, created_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    
    $stmt->bind_param(
        'ssssssssss',
        $title,
        $excerpt,
        $content,
        $slug,
        $imagePath,
        $imageAlt,
        $status,
        $publishedAt,
        $category,
        $createdBy
    );
    
    $stmt->execute();
    $postId = $stmt->insert_id;
    $stmt->close();
    
    echo json_encode([
        'success' => true,
        'message' => 'News post created successfully',
        'post' => [
            'id' => $postId,
            'slug' => $slug,
            'status' => $status
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
