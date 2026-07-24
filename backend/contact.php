<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once 'emailer.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->name) && !empty($data->email) && !empty($data->message)) {
    $name = strip_tags($data->name);
    $email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
    $subject = !empty($data->subject) ? strip_tags($data->subject) : "New Contact Form Submission";
    $message = nl2br(strip_tags($data->message));

    $email_content = "
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Subject:</strong> $subject</p>
        <p><strong>Message:</strong></p>
        <p>$message</p>
    ";

    // Send to admin
    $admin_email = "admin@isogoodsdiner.com"; // Change to actual admin email
    $sent = Emailer::send($admin_email, "Contact Form: $subject", $email_content);

    if ($sent) {
        echo json_encode(["message" => "Your message has been sent successfully!"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Failed to send email. Please try again later."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Please fill in all required fields."]);
}
?>
