<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once 'config.php';
require_once 'emailer.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->code)) {
    try {
        $stmt = $pdo->prepare("SELECT id, name, verification_code FROM users WHERE email = ?");
        $stmt->execute([$data->email]);
        $user = $stmt->fetch();

        if ($user && $user['verification_code'] === $data->code) {
            $update = $pdo->prepare("UPDATE users SET is_verified = 1, verification_code = NULL WHERE id = ?");
            if ($update->execute([$user['id']])) {
                // Send Welcome Email now that they are verified
                Emailer::sendWelcomeEmail($data->email, $user['name']);

                echo json_encode(["message" => "Email verified successfully! You can now log in.", "success" => true]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Verification failed on server."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Invalid verification code."]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Email and code are required."]);
}
?>
