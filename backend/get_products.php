<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'config.php';

try {
    $sql = "SELECT p.*,
            AVG(r.rating) as average_rating,
            COUNT(r.id) as review_count
            FROM products p
            LEFT JOIN reviews r ON p.id = r.product_id
            GROUP BY p.id
            ORDER BY p.created_at DESC";
    $stmt = $pdo->query($sql);
    $products = $stmt->fetchAll();
    echo json_encode($products);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
