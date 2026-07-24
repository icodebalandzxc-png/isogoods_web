<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once 'config.php';

if (!empty($_GET['product_id'])) {
    try {
        $product_id = $_GET['product_id'];
        $sql = "SELECT r.*, u.name as user_name
                FROM reviews r
                JOIN users u ON r.user_id = u.id
                WHERE r.product_id = ? AND r.status = 'approved'
                ORDER BY r.created_at DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$product_id]);
        $reviews = $stmt->fetchAll();

        // Calculate average rating
        $avgSql = "SELECT AVG(rating) as average_rating, COUNT(*) as review_count FROM reviews WHERE product_id = ? AND status = 'approved'";
        $avgStmt = $pdo->prepare($avgSql);
        $avgStmt->execute([$product_id]);
        $stats = $avgStmt->fetch();

        echo json_encode([
            "reviews" => $reviews,
            "stats" => $stats
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data. Product ID is required."]);
}
?>
