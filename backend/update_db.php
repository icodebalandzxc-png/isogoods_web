<?php
/**
 * Database Auto-Update Script
 * This script adds financial tracking columns to the orders table.
 */

require_once 'config.php';

header('Content-Type: text/html; charset=utf-8');

echo "<h2>Isogoods Database Update Tool</h2>";
echo "<p>Checking for required updates...</p>";

$updates = [
    [
        'table' => 'orders',
        'column' => 'total_amount',
        'definition' => "DECIMAL(10,2) DEFAULT 0.00 AFTER reservation_time"
    ],
    [
        'table' => 'orders',
        'column' => 'amount_paid',
        'definition' => "DECIMAL(10,2) DEFAULT 0.00 AFTER total_amount"
    ],
    [
        'table' => 'orders',
        'column' => 'balance_amount',
        'definition' => "DECIMAL(10,2) DEFAULT 0.00 AFTER amount_paid"
    ]
];

function columnExists($pdo, $table, $column) {
    try {
        $result = $pdo->query("SHOW COLUMNS FROM `$table` LIKE '$column'");
        return $result->rowCount() > 0;
    } catch (PDOException $e) {
        return false;
    }
}

$successCount = 0;
$skipCount = 0;

foreach ($updates as $update) {
    $table = $update['table'];
    $column = $update['column'];
    $definition = $update['definition'];

    if (columnExists($pdo, $table, $column)) {
        echo "<span style='color: orange;'>[SKIP]</span> Column <strong>$column</strong> already exists in table <strong>$table</strong>.<br>";
        $skipCount++;
    } else {
        try {
            $pdo->exec("ALTER TABLE `$table` ADD `$column` $definition");
            echo "<span style='color: green;'>[SUCCESS]</span> Added column <strong>$column</strong> to table <strong>$table</strong>.<br>";
            $successCount++;
        } catch (PDOException $e) {
            echo "<span style='color: red;'>[ERROR]</span> Failed to add column $column: " . $e->getMessage() . "<br>";
        }
    }
}

echo "<h3>Summary:</h3>";
echo "New updates applied: $successCount<br>";
echo "Already up to date: $skipCount<br>";

if ($successCount > 0 || $skipCount === count($updates)) {
    echo "<p style='color: green; font-weight: bold;'>Your database is now compatible with the 50% Deposit and Balance Tracking feature.</p>";
}

echo "<hr><a href='../index.html'>Return to Site</a>";
?>
