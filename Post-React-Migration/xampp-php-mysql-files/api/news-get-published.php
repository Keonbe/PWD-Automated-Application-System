<?php
/**
 * Get Published News Posts (Public Endpoint)
 * 
 * @method GET
 * @access Public (no authentication required)
 * @param int $limit - Number of posts to return (default: 10)
 * @param int $offset - Offset for pagination (default: 0)
 * @param string $category - Filter by category (optional)
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config.php';

// Get query parameters
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$category = isset($_GET['category']) ? trim($_GET['category']) : null;

// Ensure valid limits
$limit = max(1, min(50, $limit)); // Between 1 and 50
$page = max(1, $page); // Minimum page 1
$offset = ($page - 1) * $limit; // Calculate offset from page

try {
    // Build query for published posts only
    $sql = "SELECT id, title, excerpt, slug, image_path, image_alt, 
                   published_at, category, view_count, created_at 
            FROM pwd_news_posts 
            WHERE status = 'published' 
            AND (published_at IS NULL OR published_at <= NOW())";
    
    $params = [];
    $types = '';
    
    if ($category && $category !== 'all') {
        $sql .= " AND category = ?";
        $params[] = $category;
        $types .= 's';
    }
    
    $sql .= " ORDER BY published_at DESC LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    $types .= 'ii';
    
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
            'slug' => $row['slug'],
            'imagePath' => $row['image_path'],
            'imageAlt' => $row['image_alt'],
            'publishedAt' => $row['published_at'],
            'category' => $row['category'],
            'viewCount' => (int)$row['view_count'],
            'createdAt' => $row['created_at']
        ];
    }
    $stmt->close();
    
    // Get total count for pagination
    $countSql = "SELECT COUNT(*) as total FROM pwd_news_posts 
                 WHERE status = 'published' 
                 AND (published_at IS NULL OR published_at <= NOW())";
    
    if ($category && $category !== 'all') {
        $countSql .= " AND category = ?";
        $countStmt = $conn->prepare($countSql);
        $countStmt->bind_param('s', $category);
    } else {
        $countStmt = $conn->prepare($countSql);
    }
    
    $countStmt->execute();
    $countResult = $countStmt->get_result();
    $totalCount = (int)$countResult->fetch_assoc()['total'];
    $countStmt->close();
    
    // Calculate pagination info
    $totalPages = ceil($totalCount / $limit);
    
    echo json_encode([
        'success' => true,
        'posts' => $posts,
        'pagination' => [
            'total' => $totalCount,
            'limit' => $limit,
            'page' => $page,
            'totalPages' => $totalPages,
            'currentPage' => $page,
            'hasMore' => $page < $totalPages
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
