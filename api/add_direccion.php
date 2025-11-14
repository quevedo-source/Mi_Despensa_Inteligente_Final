<?php
require 'config.php';
$data = json_decode(file_get_contents('php://input'), true);

$user_id = (int)($data['user_id'] ?? 0);
$nombre = trim($data['nombre'] ?? '');
$telefono = trim($data['telefono'] ?? '');
$direccion = trim($data['direccion'] ?? '');
$correo = trim($data['correo'] ?? '');

if (!$user_id || !$nombre || !$telefono || !$direccion || !$correo) {
    echo json_encode(['ok' => false, 'msg' => 'Faltan datos']);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO direcciones (user_id, nombre, telefono, direccion, correo) VALUES (?, ?, ?, ?, ?)");
$stmt->execute([$user_id, $nombre, $telefono, $direccion, $correo]);

echo json_encode(['ok' => true, 'id' => $pdo->lastInsertId()]);
