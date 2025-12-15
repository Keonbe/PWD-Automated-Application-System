<?php
/**
 * Admin: Update News Post
 * 
 * @method POST/PUT
 * @access Admin only
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, PUT, OPTIONS');
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

$postId = isset($input['id']) ? intval($input['id']) : null;

if (!$postId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Post ID required']);
    exit;
}

// Extract fields (all optional for partial updates)
$title = isset($input['title']) ? trim($input['title']) : null;
$excerpt = isset($input['excerpt']) ? trim($input['excerpt']) : null;
$content = isset($input['content']) ? trim($input['content']) : null;
$slug = isset($input['slug']) ? trim($input['slug']) : null;
$imagePath = isset($input['imagePath']) ? trim($input['imagePath']) : null;
$imageAlt = isset($input['imageAlt']) ? trim($input['imageAlt']) : null;
$status = isset($input['status']) ? trim($input['status']) : null;
$category = isset($input['category']) ? trim($input['category']) : null;
$publishedAt = isset($input['publishedAt']) ? trim($input['publishedAt']) : null;
$updatedBy = isset($input['updatedBy']) ? trim($input['updatedBy']) : 'admin@dasma.gov.ph';

// Validate status if provided
$validStatuses = ['draft', 'published', 'archived'];
if ($status && !in_array($status, $validStatuses)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid status value']);
    exit;
}

try {
    // Check if post exists
    $checkStmt = $conn->prepare("SELECT id, status FROM pwd_news_posts WHERE id = ?");
    $checkStmt->bind_param('i', $postId);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    
    if ($checkResult->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Post not found']);
        $checkStmt->close();
        $conn->close();
        exit;
    }
    
    $existingPost = $checkResult->fetch_assoc();
    $checkStmt->close();
    
    // If changing to published and no publishedAt provided, set it now
    if ($status === 'published' && $existingPost['status'] !== 'published' && !$publishedAt) {
        $publishedAt = date('Y-m-d H:i:s');
    }
    
    // Check slug uniqueness if slug is being updated
    if ($slug) {
        $slugCheckStmt = $conn->prepare("SELECT id FROM pwd_news_posts WHERE slug = ? AND id != ?");
        $slugCheckStmt->bind_param('si', $slug, $postId);
        $slugCheckStmt->execute();
        $slugCheckResult = $slugCheckStmt->get_result();
        
        if ($slugCheckResult->num_rows > 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Slug already exists']);
            $slugCheckStmt->close();
            $conn->close();
            exit;
        }
        $slugCheckStmt->close();
    }
    
    // Build dynamic UPDATE query
    $updates = [];
    $params = [];
    $types = '';
    
    if ($title !== null) {
        $updates[] = "title = ?";
        $params[] = $title;
        $types .= 's';
    }
    if ($excerpt !== null) {
        $updates[] = "excerpt = ?";
        $params[] = $excerpt;
        $types .= 's';
    }
    if ($content !== null) {
        $updates[] = "content = ?";
        $params[] = $content;
        $types .= 's';
    }
    if ($slug !== null) {
        $updates[] = "slug = ?";
        $params[] = $slug;
        $types .= 's';
    }
    if ($imagePath !== null) {
        $updates[] = "image_path = ?";
        $params[] = $imagePath;
        $types .= 's';
    }
    if ($imageAlt !== null) {
        $updates[] = "image_alt = ?";
        $params[] = $imageAlt;
        $types .= 's';
    }
    if ($status !== null) {
        $updates[] = "status = ?";
        $params[] = $status;
        $types .= 's';
    }
    if ($publishedAt !== null) {
        $updates[] = "published_at = ?";
        $params[] = $publishedAt;
        $types .= 's';
    }
    if ($category !== null) {
        $updates[] = "category = ?";
        $params[] = $category;
        $types .= 's';
    }
    
    // Always update updated_by
    $updates[] = "updated_by = ?";
    $params[] = $updatedBy;
    $types .= 's';
    
    // Add post ID to params
    $params[] = $postId;
    $types .= 'i';
    
    if (empty($updates)) {
        echo json_encode([
            'success' => true,
            'message' => 'No changes to update'
        ]);
        $conn->close();
        exit;
    }
    
    $sql = "UPDATE pwd_news_posts SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    
    $affectedRows = $stmt->affected_rows;
    $stmt->close();
    
    echo json_encode([
        'success' => true,
        'message' => $affectedRows > 0 ? 'Post updated successfully' : 'No changes made',
        'postId' => $postId
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
