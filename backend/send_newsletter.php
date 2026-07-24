<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once 'config.php';
require_once 'emailer.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->subject) && !empty($data->message)) {
    try {
        // Fetch all subscribers
        $stmt = $pdo->query("SELECT email FROM newsletter_subs");
        $subscribers = $stmt->fetchAll(PDO::FETCH_COLUMN);

        if (empty($subscribers)) {
            echo json_encode(["message" => "No subscribers found."]);
            exit;
        }

        $success_count = 0;
        $fail_count = 0;

        foreach ($subscribers as $email) {
            if (Emailer::send($email, $data->subject, $data->message)) {
                $success_count++;
            } else {
                $fail_count++;
            }
        }

        echo json_encode([
            "message" => "Newsletter sent!",
            "details" => "Successfully sent to $success_count subscribers. Failed for $fail_count."
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Subject and message are required."]);
}
?>
