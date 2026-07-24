<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once 'config.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    try {
        $sql = "UPDATE users SET address = ?, phone_number = ? WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data->address,
            $data->phone_number,
            $data->id
        ]);

        // Fetch updated user data
        $stmt = $pdo->prepare("SELECT id, name, email, role, address, phone_number FROM users WHERE id = ?");
        $stmt->execute([$data->id]);
        $user = $stmt->fetch();

        echo json_encode(["message" => "Profile updated.", "user" => $user]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Missing user ID."]);
}
?>
