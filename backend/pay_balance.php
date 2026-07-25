<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once 'config.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->order_group_id) && !empty($data->payment_method)) {
    try {
        $order_group_id = $data->order_group_id;
        $payment_method = $data->payment_method;
        $proof_of_payment = isset($data->proof_of_payment) ? $data->proof_of_payment : null;

        // Update all orders in the group to be fully paid
        // We set amount_paid to total_amount and balance to 0
        $sql = "UPDATE orders SET
                payment_method = ?,
                proof_of_payment = ?,
                amount_paid = total_amount,
                balance_amount = 0
                WHERE order_group_id = ?";

        $stmt = $pdo->prepare($sql);

        if ($stmt->execute([$payment_method, $proof_of_payment, $order_group_id])) {
            echo json_encode(["message" => "Balance paid successfully!"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to update balance."]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data. Order Group ID and Payment Method are required."]);
}
?>
