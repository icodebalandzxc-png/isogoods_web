<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once 'config.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user_id) && !empty($data->order_id) && !empty($data->rating)) {
    try {
        // 1. Check if this order has already been reviewed to prevent duplicates
        $checkStmt = $pdo->prepare("SELECT id FROM reviews WHERE user_id = ? AND order_id = ? LIMIT 1");
        $checkStmt->execute([$data->user_id, $data->order_id]);
        if ($checkStmt->fetch()) {
            echo json_encode(["message" => "Review already submitted for this order."]);
            exit;
        }

        // 2. Find UNIQUE products in this order or its entire order group
        // We use DISTINCT to ensure that if a user ordered 2 of the same item, they only review it once.
        $stmt = $pdo->prepare("SELECT DISTINCT product_id FROM orders WHERE id = ? OR (order_group_id IS NOT NULL AND order_group_id = (SELECT order_group_id FROM orders WHERE id = ?))");
        $stmt->execute([$data->order_id, $data->order_id]);
        $products = $stmt->fetchAll(PDO::FETCH_COLUMN);

        if (empty($products)) {
            http_response_code(404);
            echo json_encode(["message" => "Order or products not found."]);
            exit;
        }

        // 3. Insert the review for each unique product in the order
        $sql = "INSERT INTO reviews (user_id, product_id, order_id, rating, comment) VALUES (?, ?, ?, ?, ?)";
        $stmtInsert = $pdo->prepare($sql);

        foreach ($products as $product_id) {
            $stmtInsert->execute([
                $data->user_id,
                $product_id,
                $data->order_id,
                $data->rating,
                $data->comment ?? ''
            ]);
        }

        echo json_encode(["message" => "Review submitted successfully!"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data. User ID, Order ID, and Rating are required."]);
}
?>
