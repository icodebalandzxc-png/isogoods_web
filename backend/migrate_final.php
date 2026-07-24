<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'config.php';

$response = ["steps" => []];

function addColumnIfNotExists($pdo, $table, $column, $definition, &$response) {
    try {
        $check = $pdo->query("SHOW COLUMNS FROM `$table` LIKE '$column'");
        if ($check->rowCount() == 0) {
            $pdo->exec("ALTER TABLE `$table` ADD COLUMN `$column` $definition");
            $response["steps"][] = "Added column '$column' to '$table'.";
        } else {
            $response["steps"][] = "Column '$column' already exists in '$table'.";
        }
    } catch (PDOException $e) {
        $response["steps"][] = "Error adding '$column' to '$table': " . $e->getMessage();
    }
}

// 1. Update Products Table
addColumnIfNotExists($pdo, 'products', 'is_available', "BOOLEAN DEFAULT TRUE AFTER `note`", $response);

// 2. Update Users Table
addColumnIfNotExists($pdo, 'users', 'address', "TEXT AFTER `role`", $response);
addColumnIfNotExists($pdo, 'users', 'phone_number', "VARCHAR(20) AFTER `address`", $response);

// 3. Update Orders Table
addColumnIfNotExists($pdo, 'orders', 'lat', "DECIMAL(10, 8) AFTER `address`", $response);
addColumnIfNotExists($pdo, 'orders', 'lng', "DECIMAL(11, 8) AFTER `lat`", $response);

// 4. Update Settings Table (Add Maya and MariBank if not there)
try {
    $initialSettings = [
        'maya_details' => '',
        'maya_qr_url' => '',
        'maribank_details' => '',
        'receiver_name' => 'ISOGOODS DINER',
        'bank_transfer_details' => '',
        'restaurant_lat' => '12.70535',
        'restaurant_lng' => '124.03235'
    ];

    foreach ($initialSettings as $key => $value) {
        $stmt = $pdo->prepare("INSERT IGNORE INTO settings (setting_key, setting_value) VALUES (?, ?)");
        $stmt->execute([$key, $value]);
    }
    $response["steps"][] = "Initialized extended settings constants.";
} catch (PDOException $e) {
    $response["steps"][] = "Error initializing settings: " . $e->getMessage();
}

// 5. Create Reviews Table if missing
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        order_id INT NOT NULL,
        product_id INT,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (order_id) REFERENCES orders(id)
    )");
    $response["steps"][] = "Verified 'reviews' table existence.";
} catch (PDOException $e) {
    $response["steps"][] = "Error creating reviews table: " . $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
