<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once 'config.php';
require_once 'emailer.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->name) && !empty($data->email) && !empty($data->password)) {
    try {
        // Check if email exists
        $check = $pdo->prepare("SELECT id, is_verified FROM users WHERE email = ?");
        $check->execute([$data->email]);
        $existingUser = $check->fetch();

        if ($existingUser && $existingUser['is_verified']) {
            http_response_code(400);
            echo json_encode(["message" => "Email already registered and verified."]);
            exit;
        }

        $hashedPassword = password_hash($data->password, PASSWORD_DEFAULT);
        $role = isset($data->role) ? $data->role : 'customer';
        $verificationCode = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

        if ($existingUser) {
            // Update unverified user
            $sql = "UPDATE users SET name = ?, password = ?, role = ?, verification_code = ? WHERE email = ?";
            $stmt = $pdo->prepare($sql);
            $success = $stmt->execute([$data->name, $hashedPassword, $role, $verificationCode, $data->email]);
        } else {
            // Insert new unverified user
            $sql = "INSERT INTO users (name, email, password, role, verification_code, is_verified) VALUES (?, ?, ?, ?, ?, 0)";
            $stmt = $pdo->prepare($sql);
            $success = $stmt->execute([$data->name, $data->email, $hashedPassword, $role, $verificationCode]);
        }

        if ($success) {
            // Send Verification Email
            Emailer::sendVerificationCode($data->email, $verificationCode);
            echo json_encode(["message" => "Verification code sent to your email."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Registration process failed."]);
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
