<?php
/**
 * Admin: Get All News Posts (Including Drafts)
 * 
 * @method GET
 * @access Admin only
 * @param string $status - Filter by status (draft/published/archived)
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config.php';

// Note: In production, add admin session validation here
// session_start();
// if (!isset($_SESSION['adminEmail'])) {
//     http_response_code(401);
//     echo json_encode(['success' => false, 'error' => 'Unauthorized']);
//     exit;
// }

$status = isset($_GET['status']) ? trim($_GET['status']) : null;

try {
    $sql = "SELECT id, title, excerpt, content, slug, image_path, image_alt, status, published_at, 
                   category, created_by, created_at, updated_by, updated_at, view_count 
            FROM pwd_news_posts";
    
    $params = [];
    $types = '';
    
    if ($status && in_array($status, ['draft', 'published', 'archived'])) {
        $sql .= " WHERE status = ?";
        $params[] = $status;
        $types .= 's';
    }
    
    $sql .= " ORDER BY created_at DESC";
    
    $stmt = $conn->prepare($sql);
    
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $posts = [];
    while ($row = $result->fetch_assoc()) {
        $posts[] = [
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
            'updatedBy' => $row['updated_by'],
            'updatedAt' => $row['updated_at'],
            'viewCount' => (int)$row['view_count']
        ];
    }
    $stmt->close();
    
    // Get counts by status
    $countStmt = $conn->prepare(
        "SELECT status, COUNT(*) as count FROM pwd_news_posts GROUP BY status"
    );
    $countStmt->execute();
    $countResult = $countStmt->get_result();
    
    $statusCounts = [
        'draft' => 0,
        'published' => 0,
        'archived' => 0,
        'all' => 0
    ];
    
    while ($countRow = $countResult->fetch_assoc()) {
        $statusCounts[$countRow['status']] = (int)$countRow['count'];
        $statusCounts['all'] += (int)$countRow['count'];
    }
    $countStmt->close();
    
    echo json_encode([
        'success' => true,
        'posts' => $posts,
        'total' => count($posts),
        'statusCounts' => $statusCounts
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
