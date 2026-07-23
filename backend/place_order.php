<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once 'config.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user_id) && !empty($data->product_id) && !empty($data->address)) {
    try {
        $quantity = isset($data->quantity) ? $data->quantity : 1;
        $variant_name = isset($data->variant_name) ? $data->variant_name : 'Standard';
        $order_group_id = isset($data->order_group_id) ? $data->order_group_id : null;
        $phone_number = isset($data->phone_number) ? $data->phone_number : 'N/A';
        $payment_method = isset($data->payment_method) ? $data->payment_method : 'COD';
        $proof_of_payment = isset($data->proof_of_payment) ? $data->proof_of_payment : null;

        $sql = "INSERT INTO orders (user_id, product_id, order_group_id, variant_name, quantity, address, phone_number, payment_method, proof_of_payment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);

        if ($stmt->execute([$data->user_id, $data->product_id, $order_group_id, $variant_name, $quantity, $data->address, $phone_number, $payment_method, $proof_of_payment])) {
            echo json_encode(["message" => "Order placed successfully!"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "SQL Execution Failed", "info" => $stmt->errorInfo()]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage(), "trace" => $e->getTraceAsString()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data. User ID, Product ID, and Address are required."]);
}
?>
