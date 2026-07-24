<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once 'config.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->name) && !empty($data->price)) {
    try {
        $sql = "INSERT INTO products (name, description, price, category, image_url, variants, note, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $is_available = isset($data->is_available) ? (int)$data->is_available : 1;
        $stmt->execute([$data->name, $data->description, $data->price, $data->category, $data->image_url, $data->variants, $data->note, $is_available]);
        echo json_encode(["message" => "Product created."]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data."]);
}
?>
