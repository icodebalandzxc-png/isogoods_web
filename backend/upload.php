<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$target_dir = "uploads/";
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

if (isset($_FILES["image"])) {
    $file_extension = pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
    $new_filename = uniqid() . '.' . $file_extension;
    $target_file = $target_dir . $new_filename;

    if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
        // Return the relative path from the backend folder
        $url = "http://localhost/isogoods_web/backend/" . $target_file;
        echo json_encode(["success" => true, "url" => $url]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Upload failed."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "No file uploaded."]);
}
?>
