<?php
require_once 'config.php';

try {
    // Add restaurant coordinates to settings table
    $columns = [
        'restaurant_lat' => "TEXT",
        'restaurant_lng' => "TEXT"
    ];

    foreach ($columns as $col => $def) {
        try {
            $pdo->exec("ALTER TABLE settings ADD COLUMN $col $def");
            echo "Added $col to settings<br>";
        } catch (Exception $e) {
            echo "$col might already exist or error: " . $e->getMessage() . "<br>";
        }
    }

    echo "Migration V5 successful!";
} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage();
}
?>
