<?php
require_once 'config.php';

try {
    // Add lat and lng columns to orders table
    try {
        $pdo->exec("ALTER TABLE orders ADD COLUMN lat DECIMAL(10, 8) NULL AFTER address");
        $pdo->exec("ALTER TABLE orders ADD COLUMN lng DECIMAL(11, 8) NULL AFTER lat");
        echo "Added lat and lng columns to orders table<br>";
    } catch (Exception $e) {
        echo "Columns might already exist or error: " . $e->getMessage() . "<br>";
    }

    echo "Migration V4 successful!";
} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage();
}
?>
