<?php
require_once 'config.php';

try {
    // We add the columns if they don't exist
    // Using simple approach to avoid SQL syntax errors on different versions
    $columns = [
        'receiver_name' => "TEXT",
        'bank_transfer_details' => "TEXT",
        'maya_details' => "TEXT",
        'maribank_details' => "TEXT"
    ];

    foreach ($columns as $col => $def) {
        try {
            $pdo->exec("ALTER TABLE settings ADD COLUMN $col $def");
            echo "Added $col to settings<br>";
        } catch (Exception $e) {
            echo "$col might already exist or error: " . $e->getMessage() . "<br>";
        }
    }

    echo "Migration V2 successful!";
} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage();
}
?>
