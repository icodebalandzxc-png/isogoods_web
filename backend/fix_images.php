<?php
require_once 'config.php';

echo "Starting image path cleanup...<br>";

try {
    // 1. Fix product images
    $stmt = $pdo->query("SELECT id, image_url FROM products WHERE image_url LIKE 'http%'");
    $count = 0;
    while ($row = $stmt->fetch()) {
        $old_url = $row['image_url'];
        // Extract the part after 'uploads/'
        if (preg_match('/uploads\/[a-zA-Z0-9.]+$/', $old_url, $matches)) {
            $new_path = $matches[0];
            $update = $pdo->prepare("UPDATE products SET image_url = ? WHERE id = ?");
            $update->execute([$new_path, $row['id']]);
            echo "Updated product {$row['id']}: $old_url -> $new_path<br>";
            $count++;
        }
    }
    echo "Finished updating $count products.<br><br>";

    // 2. Fix GCash QR in settings
    $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = 'gcash_qr_url' AND setting_value LIKE 'http%'");
    if ($row = $stmt->fetch()) {
        $old_url = $row['setting_value'];
        if (preg_match('/uploads\/[a-zA-Z0-9.]+$/', $old_url, $matches)) {
            $new_path = $matches[0];
            $update = $pdo->prepare("UPDATE settings SET setting_value = ? WHERE setting_key = 'gcash_qr_url'");
            $update->execute([$new_path]);
            echo "Updated GCash QR: $old_url -> $new_path<br>";
        }
    }

    echo "Done! You can delete this file now.";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
