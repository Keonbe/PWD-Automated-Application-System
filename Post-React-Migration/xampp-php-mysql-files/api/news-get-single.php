<?php
/**
 * Get Single News Post (Public Endpoint)
 * 
 * @method GET
 * @access Public (no authentication required)
 * @param string $slug - URL slug of the post
 * @param int $id - Post ID (alternative to slug)
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config.php';

$slug = isset($_GET['slug']) ? trim($_GET['slug']) : null;
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

if (!$slug && !$id) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Slug or ID required'
    ]);
    exit;
}

try {
    // Build query based on provided identifier
    if ($slug) {
        $stmt = $conn->prepare(
            "SELECT id, title, excerpt, content, slug, image_path, image_alt, 
                    status, published_at, category, created_by, created_at, 
                    updated_at, view_count 
             FROM pwd_news_posts 
             WHERE slug = ? AND status = 'published'
             LIMIT 1"
        );
        $stmt->bind_param('s', $slug);
    } else {
        $stmt = $conn->prepare(
            "SELECT id, title, excerpt, content, slug, image_path, image_alt, 
                    status, published_at, category, created_by, created_at, 
                    updated_at, view_count 
             FROM pwd_news_posts 
             WHERE id = ? AND status = 'published'
             LIMIT 1"
        );
        $stmt->bind_param('i', $id);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Post not found'
        ]);
        $stmt->close();
        $conn->close();
        exit;
    }
    
    $row = $result->fetch_assoc();
    $stmt->close();
    
    // Increment view count
    $updateStmt = $conn->prepare(
        "UPDATE pwd_news_posts SET view_count = view_count + 1 WHERE id = ?"
    );
    $updateStmt->bind_param('i', $row['id']);
    $updateStmt->execute();
    $updateStmt->close();
    
    // Format response
    $post = [
        'id' => (int)$row['id'],
        'title' => $row['title'],
        'excerpt' => $row['excerpt'],
        'content' => $row['content'],
        'slug' => $row['slug'],
        'imagePath' => $row['image_path'],
        'imageAlt' => $row['image_alt'],
        'status' => $row['status'],
        'publishedAt' => $row['published_at'],
        'category' => $row['category'],
        'createdBy' => $row['created_by'],
        'createdAt' => $row['created_at'],
        'updatedAt' => $row['updated_at'],
        'viewCount' => (int)$row['view_count'] + 1 // Include the increment
    ];
    
    echo json_encode([
        'success' => true,
        'post' => $post
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
