<?php
require_once 'config.php';
header("Content-Type: application/json");

try {
    $stmt = $pdo->query("DESCRIBE orders");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($columns);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
