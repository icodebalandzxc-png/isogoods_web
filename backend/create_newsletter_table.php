<?php
require_once 'config.php';

try {
    $sql = "CREATE TABLE IF NOT EXISTS newsletter_subs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    $pdo->exec($sql);
    echo "Newsletter table created successfully!";
} catch (PDOException $e) {
    echo "Error creating newsletter table: " . $e->getMessage();
}
?>
