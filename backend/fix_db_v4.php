<?php
require_once 'config.php';
header("Content-Type: text/html; charset=UTF-8");

try {
    echo "<h1>Database Grouping Fix</h1>";

    // Check if column exists first to avoid syntax issues with IF NOT EXISTS on older MySQL versions
    $check = $pdo->query("SHOW COLUMNS FROM orders LIKE 'order_group_id'");
    $exists = $check->fetch();

    if (!$exists) {
        $pdo->exec("ALTER TABLE orders ADD COLUMN order_group_id VARCHAR(50) AFTER id");
        echo "<p style='color:green;'>+ Successfully added 'order_group_id' column.</p>";
    } else {
        echo "<p style='color:orange;'>- 'order_group_id' column already exists.</p>";
    }

    echo "<hr><p style='color:blue; font-weight:bold;'>Database grouping is now ready!</p>";
    echo "<a href='../admin'>Back to Admin</a>";

} catch (PDOException $e) {
    echo "<p style='color:red;'><strong>Database Error:</strong> " . $e->getMessage() . "</p>";
}
?>
