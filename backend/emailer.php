<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require __DIR__ . '/vendor/autoload.php';

class Emailer {
    // SMTP Configuration
    private static $smtp_host = 'smtp.gmail.com'; // Change to your SMTP host
    private static $smtp_auth = true;
    private static $smtp_user = 'code.balandzxc@gmail.com'; // Change to your SMTP username
    private static $smtp_pass = 'kjqyaihewdzwzuhu';    // Change to your SMTP password (or App Password for Gmail)
    private static $smtp_secure = PHPMailer::ENCRYPTION_STARTTLS;
    private static $smtp_port = 587;

    private static $from_email = "noreply@isogoodsdiner.com";
    private static $from_name = "Isogoods Diner";

    public static function send($to, $subject, $message) {
        $mail = new PHPMailer(true);

        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host       = self::$smtp_host;
            $mail->SMTPAuth   = self::$smtp_auth;
            $mail->Username   = self::$smtp_user;
            $mail->Password   = self::$smtp_pass;
            $mail->SMTPSecure = self::$smtp_secure;
            $mail->Port       = self::$smtp_port;

            // Recipients
            $mail->setFrom(self::$from_email, self::$from_name);
            $mail->addAddress($to);

            // Add Logo
            $logoPath = __DIR__ . '/../public/logo.jpg';
            if (file_exists($logoPath)) {
                $mail->addEmbeddedImage($logoPath, 'logo_img');
                $logoHtml = "
                    <img src='cid:logo_img' alt='" . self::$from_name . "' style='height: 70px; display: block; margin: 0 auto 10px;'>
                    <div style='font-size: 20px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;'>" . self::$from_name . "</div>
                ";
            } else {
                $logoHtml = "<h2 style='margin:0;'>" . self::$from_name . "</h2>";
            }

            // Content
            $mail->isHTML(true);
            $mail->Subject = $subject;

            // HTML Template
            $html_message = "
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { width: 80%; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 20px; overflow: hidden; }
                    .header { background: #1a1a1a; padding: 30px; text-align: center; color: #D4AF37; }
                    .content { padding: 30px; background: #fff; }
                    .footer { font-size: 11px; text-align: center; color: #999; padding: 20px; background: #f9f9f9; }
                    .btn { background: #D4AF37; color: #000; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        " . $logoHtml . "
                    </div>
                    <div class='content'>
                        " . $message . "
                    </div>
                    <div class='footer'>
                        &copy; " . date("Y") . " " . self::$from_name . ". All rights reserved.<br>
                        M.L. Quezon St., Irosin, Sorsogon
                    </div>
                </div>
            </body>
            </html>
            ";

            $mail->Body = $html_message;
            $mail->AltBody = strip_tags($message);

            return $mail->send();
        } catch (Exception $e) {
            error_log("Emailer Error: " . $mail->ErrorInfo);
            return false;
        }
    }

    public static function sendOrderConfirmation($to, $name, $order_details) {
        $subject = "Order Confirmation - " . self::$from_name;
        $message = "
            <h3>Hello $name,</h3>
            <p>Thank you for your order! We are now processing it.</p>
            <p><strong>Order Details:</strong></p>
            $order_details
            <p>We'll notify you once your order is on its way.</p>
        ";
        return self::send($to, $subject, $message);
    }

    public static function sendWelcomeEmail($to, $name) {
        $subject = "Welcome to " . self::$from_name;
        $message = "
            <div style='text-align: center;'>
                <h2 style='color: #1a1a1a;'>Maligayang Pagdating, $name!</h2>
                <p style='color: #666;'>Salamat sa pagsali sa Isogoods Diner. Excited kaming pagsilbihan ka!</p>
                <img src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=500' alt='Food' style='width: 100%; max-width: 400px; border-radius: 15px; margin: 20px 0;'>
                <p style='color: #666;'>I-explore ang aming menu at simulan na ang pag-order ng iyong mga paborito.</p>
                <a href='http://localhost/isogoods_web/menu' class='btn'>Tingnan ang Menu</a>
            </div>
        ";
        return self::send($to, $subject, $message);
    }

    public static function sendVerificationCode($to, $code) {
        $subject = "Verification Code - " . self::$from_name;
        $message = "
            <div style='text-align: center;'>
                <h2 style='color: #1a1a1a; margin-bottom: 10px;'>Email Verification</h2>
                <p style='color: #666; margin-bottom: 25px;'>Gamit ang code sa ibaba para ma-verify ang iyong account.</p>
                <div style='background: #f4f4f4; border: 2px dashed #D4AF37; padding: 20px; border-radius: 15px; display: inline-block;'>
                    <span style='font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #1a1a1a;'>" . $code . "</span>
                </div>
                <p style='color: #999; font-size: 12px; margin-top: 25px;'>Pakisuyong huwag itong ibahagi sa iba.</p>
            </div>
        ";
        return self::send($to, $subject, $message);
    }
}
