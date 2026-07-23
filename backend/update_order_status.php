<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once 'config.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id) && !empty($data->status)) {
    try {
        // First, check if this order belongs to a group
        $checkSql = "SELECT order_group_id FROM orders WHERE id = ?";
        $checkStmt = $pdo->prepare($checkSql);
        $checkStmt->execute([$data->id]);
        $order = $checkStmt->fetch();

        if ($order && !empty($order['order_group_id'])) {
            // Update the entire group
            $sql = "UPDATE orders SET status = ? WHERE order_group_id = ?";
            $stmt = $pdo->prepare($sql);
            $success = $stmt->execute([$data->status, $order['order_group_id']]);
        } else {
            // No group, just update single item
            $sql = "UPDATE orders SET status = ? WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $success = $stmt->execute([$data->status, $data->id]);
        }

        if ($success) {
            echo json_encode(["message" => "Order status updated!"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to update order status."]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data."]);
}
?>
