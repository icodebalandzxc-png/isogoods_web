<?php
require_once 'config.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/html; charset=UTF-8");

try {
    echo "<h1>Database Fix Tool</h1>";

    // Check if phone_number exists, if not add it
    try {
        $pdo->exec("ALTER TABLE orders ADD COLUMN phone_number VARCHAR(20)");
        echo "<p style='color:green;'>+ Added phone_number column.</p>";
    } catch (Exception $e) {
        echo "<p style='color:orange;'>- phone_number column already exists or skipped.</p>";
    }

    // Check if proof_of_payment exists, if not add it
    try {
        $pdo->exec("ALTER TABLE orders ADD COLUMN proof_of_payment VARCHAR(255)");
        echo "<p style='color:green;'>+ Added proof_of_payment column.</p>";
    } catch (Exception $e) {
        echo "<p style='color:orange;'>- proof_of_payment column already exists or skipped.</p>";
    }

    echo "<hr><p style='color:blue; font-weight:bold;'>Database is now up to date! You can now place orders and see them in the Admin Dashboard.</p>";
    echo "<a href='../admin'>Back to Admin</a>";

} catch (PDOException $e) {
    echo "<p style='color:red;'><strong>Database Error:</strong> " . $e->getMessage() . "</p>";
}
?>
