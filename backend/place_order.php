<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once 'config.php';
require_once 'emailer.php';

$data = json_decode(file_get_contents("php://input"));

// Address is required only for Delivery
$is_delivery = isset($data->order_type) && $data->order_type === 'Delivery';
$has_address = !empty($data->address);

if (!empty($data->user_id) && !empty($data->product_id) && ($is_delivery ? $has_address : true)) {
    try {
        $quantity = isset($data->quantity) ? $data->quantity : 1;
        $variant_name = isset($data->variant_name) ? $data->variant_name : 'Standard';
        $order_group_id = isset($data->order_group_id) ? $data->order_group_id : null;
        $phone_number = isset($data->phone_number) ? $data->phone_number : 'N/A';
        $payment_method = isset($data->payment_method) ? $data->payment_method : 'COD';
        $proof_of_payment = isset($data->proof_of_payment) ? $data->proof_of_payment : null;
        $order_type = isset($data->order_type) ? $data->order_type : 'Delivery';
        $reservation_date = isset($data->reservation_date) ? $data->reservation_date : null;
        $reservation_time = isset($data->reservation_time) ? $data->reservation_time : null;
        $address = !empty($data->address) ? $data->address : $order_type;
        $lat = isset($data->lat) ? $data->lat : null;
        $lng = isset($data->lng) ? $data->lng : null;

        $sql = "INSERT INTO orders (user_id, product_id, order_group_id, variant_name, quantity, address, lat, lng, phone_number, payment_method, proof_of_payment, order_type, reservation_date, reservation_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);

        if ($stmt->execute([
            $data->user_id,
            $data->product_id,
            $order_group_id,
            $variant_name,
            $quantity,
            $address,
            $lat,
            $lng,
            $phone_number,
            $payment_method,
            $proof_of_payment,
            $order_type,
            $reservation_date,
            $reservation_time
        ])) {
            echo json_encode(["message" => "Order placed successfully!"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "SQL Execution Failed", "info" => $stmt->errorInfo()]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data. User ID, Product ID, and details are required."]);
}
?>
