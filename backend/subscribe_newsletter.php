<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once 'config.php';
require_once 'emailer.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email)) {
    if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid email address."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO newsletter_subs (email) VALUES (?)");
        if ($stmt->execute([$data->email])) {
            // Send Confirmation Email
            Emailer::send(
                $data->email,
                "Newsletter Subscription",
                "<h3>Thank you for subscribing!</h3><p>You'll now receive the latest updates and offers from Isogoods Diner.</p>"
            );

            echo json_encode(["message" => "Subscribed successfully!"]);
        }
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) { // Duplicate entry
            echo json_encode(["message" => "You are already subscribed!"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Email is required."]);
}
?>
