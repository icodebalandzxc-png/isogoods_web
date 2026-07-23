<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once 'config.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id) && !empty($data->title) && !empty($data->description)) {
    try {
        $sql = "UPDATE features SET title = ?, description = ?, icon = ? WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        if ($stmt->execute([$data->title, $data->description, $data->icon, $data->id])) {
            echo json_encode(["message" => "Feature updated successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Unable to update feature."]);
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
