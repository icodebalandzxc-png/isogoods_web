<?php
require_once 'config.php';

try {
    $pdo->exec("ALTER TABLE users ADD COLUMN verification_code VARCHAR(6) NULL");
    $pdo->exec("ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE");
    echo "Database updated successfully with verification columns.";
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "Columns already exist.";
    } else {
        echo "Error updating database: " . $e->getMessage();
    }
}
?>
