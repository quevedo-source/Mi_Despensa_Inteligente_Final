<?php
require 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$nombre = trim($data['nombre'] ?? '');
$correo = trim($data['correo'] ?? '');
$pass = $data['pass'] ?? '';

if (!$nombre || !$correo || !$pass) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'Faltan datos']);
    exit;
}

$hash = password_hash($pass, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare("INSERT INTO usuarios (nombre, correo, pass_hash) VALUES (?, ?, ?)");
    $stmt->execute([$nombre, $correo, $hash]);
    $userId = $pdo->lastInsertId();
    echo json_encode(['ok' => true, 'user_id' => $userId]);
} catch (PDOException $e) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => $e->getMessage()]);
}
