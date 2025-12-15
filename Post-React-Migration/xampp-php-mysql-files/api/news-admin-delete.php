<?php
/**
 * Admin: Delete News Post
 * 
 * @method DELETE/POST
 * @access Admin only
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: DELETE, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config.php';

// Note: In production, add admin session validation here

// Support both DELETE with query param and POST with body
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $postId = isset($_GET['id']) ? intval($_GET['id']) : null;
} else {
    $input = json_decode(file_get_contents('php://input'), true);
    $postId = isset($input['id']) ? intval($input['id']) : null;
}

if (!$postId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Post ID required']);
    exit;
}

try {
    // Get post info before deletion (to clean up image if needed)
    $getStmt = $conn->prepare("SELECT id, title, image_path FROM pwd_news_posts WHERE id = ?");
    $getStmt->bind_param('i', $postId);
    $getStmt->execute();
    $result = $getStmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Post not found']);
        $getStmt->close();
        $conn->close();
        exit;
    }
    
    $post = $result->fetch_assoc();
    $getStmt->close();
    
    // Delete the post
    $deleteStmt = $conn->prepare("DELETE FROM pwd_news_posts WHERE id = ?");
    $deleteStmt->bind_param('i', $postId);
    $deleteStmt->execute();
    
    $affectedRows = $deleteStmt->affected_rows;
    $deleteStmt->close();
    
    if ($affectedRows > 0) {
        // Optionally delete associated image file
        if (!empty($post['image_path'])) {
            $imagePath = '../' . $post['image_path'];
            if (file_exists($imagePath)) {
                @unlink($imagePath);
            }
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Post deleted successfully',
            'deletedPost' => [
                'id' => $post['id'],
                'title' => $post['title']
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to delete post'
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
