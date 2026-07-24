<?php
require_once 'config.php';

try {
    $sql = "CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        order_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (order_id) REFERENCES orders(id)
    )";

    $pdo->exec($sql);
    echo "Reviews table created successfully!";
} catch (PDOException $e) {
    echo "Error creating reviews table: " . $e->getMessage();
}
?>
