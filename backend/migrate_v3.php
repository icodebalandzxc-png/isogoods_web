<?php
require_once 'config.php';

try {
    // Add maya_qr_url to settings table if it doesn't exist
    try {
        $pdo->exec("ALTER TABLE settings ADD COLUMN maya_qr_url TEXT");
        echo "Added maya_qr_url to settings<br>";
    } catch (Exception $e) {
        echo "maya_qr_url might already exist or error: " . $e->getMessage() . "<br>";
    }

    echo "Migration V3 successful!";
} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage();
}
?>
