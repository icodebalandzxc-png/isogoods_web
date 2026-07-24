<?php
require_once 'config.php';

try {
    // Add status column if it doesn't exist
    $sql = "ALTER TABLE reviews ADD COLUMN status ENUM('pending', 'approved', 'hidden') DEFAULT 'pending' AFTER comment";
    $pdo->exec($sql);
    echo "Reviews table updated successfully with status column!";
} catch (PDOException $e) {
    // If it already exists, just ignore the error
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "Status column already exists.";
    } else {
        echo "Error updating reviews table: " . $e->getMessage();
    }
}
?>
