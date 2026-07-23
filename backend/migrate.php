<?php
/**
 * Database Migration / Setup Script - CLEAN RESET VERSION
 */

$host = 'localhost';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "<h1>Database Reset Tool</h1>";

    // 1. Force a clean slate
    echo "<p>Resetting database structure...</p>";
    $pdo->exec("DROP DATABASE IF EXISTS isogoods_db");
    $pdo->exec("CREATE DATABASE isogoods_db");
    $pdo->exec("USE isogoods_db");

    // 2. Read and Execute the Diner SQL
    $sqlFile = 'database.sql';
    if (!file_exists($sqlFile)) {
        die("<p style='color:red;'>Error: $sqlFile not found!</p>");
    }

    $sql = file_get_contents($sqlFile);

    // Remove the CREATE DATABASE/USE lines from the SQL string to avoid confusion since we already did it
    $sql = preg_replace('/CREATE DATABASE IF NOT EXISTS isogoods_db;/', '', $sql);
    $sql = preg_replace('/USE isogoods_db;/', '', $sql);

    $pdo->exec($sql);

    echo "<p style='color:green; font-weight:bold;'>SUCCESS! Your database has been completely reset to the DINER theme.</p>";
    echo "<p>All old data (Bags, Watches) has been removed and replaced with Menu items.</p>";
    echo "<hr>";
    echo "<p><strong>Admin Credentials:</strong><br>Email: admin@isogoods.com<br>Password: password</p>";
    echo "<hr>";
    echo "<a href='../admin'>Go to React Admin Panel</a>";

} catch (PDOException $e) {
    echo "<p style='color:red;'><strong>Database Error:</strong> " . $e->getMessage() . "</p>";
}
?>
