<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'config.php';

try {
    $sql = "SELECT o.*, u.name as customer_name, p.name as product_name, p.price, p.variants
            FROM orders o
            JOIN users u ON o.user_id = u.id
            JOIN products p ON o.product_id = p.id
            ORDER BY o.order_date DESC";
    $stmt = $pdo->query($sql);
    $orders = $stmt->fetchAll();
    echo json_encode($orders);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
