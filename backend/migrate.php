<?php
require_once 'config.php';

function addColumnSafe($pdo, $table, $column, $definition) {
    try {
        $pdo->exec("ALTER TABLE $table ADD $column $definition");
        echo "Successfully added/verified column: $column<br>";
    } catch (PDOException $e) {
        // 42S21 is the SQLSTATE for "Column already exists"
        if ($e->getCode() == '42S21' || strpos($e->getMessage(), 'Duplicate column name') !== false) {
            echo "Column $column already exists, skipping...<br>";
        } else {
            echo "Error adding $column: " . $e->getMessage() . "<br>";
        }
    }
}

try {
    echo "Starting migration...<br>";

    addColumnSafe($pdo, 'orders', 'order_group_id', "VARCHAR(100) AFTER product_id");
    addColumnSafe($pdo, 'orders', 'variant_name', "VARCHAR(100) AFTER order_group_id");
    addColumnSafe($pdo, 'orders', 'order_type', "VARCHAR(50) DEFAULT 'Delivery' AFTER proof_of_payment");
    addColumnSafe($pdo, 'orders', 'reservation_date', "DATE AFTER order_type");
    addColumnSafe($pdo, 'orders', 'reservation_time', "TIME AFTER reservation_date");

    // Payment tracking columns
    addColumnSafe($pdo, 'orders', 'total_amount', "DECIMAL(10,2) AFTER reservation_time");
    addColumnSafe($pdo, 'orders', 'amount_paid', "DECIMAL(10,2) AFTER total_amount");
    addColumnSafe($pdo, 'orders', 'balance_amount', "DECIMAL(10,2) AFTER amount_paid");

    echo "<br>Migration process completed!";
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage();
}
?>
