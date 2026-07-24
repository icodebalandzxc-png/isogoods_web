<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once 'config.php';
require_once 'emailer.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->order_group_id) && !empty($data->user_id)) {
    try {
        // Fetch user info
        $stmtUser = $pdo->prepare("SELECT name, email FROM users WHERE id = ?");
        $stmtUser->execute([$data->user_id]);
        $user = $stmtUser->fetch();

        if ($user) {
            // Fetch order items
            $stmtOrders = $pdo->prepare("
                SELECT o.*, p.name as product_name
                FROM orders o
                JOIN products p ON o.product_id = p.id
                WHERE o.order_group_id = ?
            ");
            $stmtOrders->execute([$data->order_group_id]);
            $items = $stmtOrders->fetchAll();

            if ($items) {
                $order_details = "<ul>";
                $total = 0;
                foreach ($items as $item) {
                    $order_details .= "<li>{$item['product_name']} ({$item['variant_name']}) x {$item['quantity']}</li>";
                }
                $order_details .= "</ul>";
                $order_details .= "<p><strong>Order ID:</strong> {$data->order_group_id}</p>";
                $order_details .= "<p><strong>Payment Method:</strong> {$items[0]['payment_method']}</p>";
                $order_details .= "<p><strong>Order Type:</strong> {$items[0]['order_type']}</p>";
                $order_details .= "<p><strong>Address:</strong> {$items[0]['address']}</p>";

                Emailer::sendOrderConfirmation($user['email'], $user['name'], $order_details);

                echo json_encode(["message" => "Order email sent successfully."]);
            } else {
                echo json_encode(["message" => "No items found for this order group."]);
            }
        } else {
            http_response_code(404);
            echo json_encode(["message" => "User not found."]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Order Group ID and User ID are required."]);
}
?>
