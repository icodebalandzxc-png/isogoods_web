<?php
require_once 'config.php';
try {
    $pdo->exec("ALTER TABLE orders ADD COLUMN IF NOT EXISTS variant_name VARCHAR(255) AFTER product_id");
    echo "<h1>Database Updated!</h1><p>Orders now track specific variants and quantities correctly.</p>";
} catch (Exception $e) {
    try {
        $pdo->exec("ALTER TABLE orders ADD COLUMN variant_name VARCHAR(255) AFTER product_id");
        echo "<h1>Database Updated!</h1>";
    } catch (Exception $e2) {
        echo "<h1>Database already up to date.</h1>";
    }
}
?>