<?php
require_once 'config.php';
header("Content-Type: text/html; charset=UTF-8");

try {
    echo "<h1>Database Update Tool (Status: Delivering)</h1>";

    // Update the ENUM definition for status to include 'delivering'
    try {
        $pdo->exec("ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'preparing', 'delivering', 'completed', 'cancelled') DEFAULT 'pending'");
        echo "<p style='color:green;'>+ Updated order status options to include 'delivering'.</p>";
    } catch (Exception $e) {
        echo "<p style='color:red;'>- Error updating status column: " . $e->getMessage() . "</p>";
    }

    echo "<hr><p style='color:blue; font-weight:bold;'>Database updated successfully!</p>";
    echo "<a href='../admin'>Back to Admin</a>";

} catch (PDOException $e) {
    echo "<p style='color:red;'><strong>Database Error:</strong> " . $e->getMessage() . "</p>";
}
?>
