<?php
require 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = (int)($data['id'] ?? 0);
$user_id = (int)($data['user_id'] ?? 0);
$nombre = trim($data['nombre'] ?? '');
$fecha = $data['fecha'] ?? '';

if (!$id || !$user_id || !$nombre || !$fecha) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'Faltan datos']);
    exit;
}

$stmt = $pdo->prepare("UPDATE alimentos SET nombre = ?, fecha = ? WHERE id = ? AND user_id = ?");
$stmt->execute([$nombre, $fecha, $id, $user_id]);
echo json_encode(['ok' => true, 'changed' => $stmt->rowCount()]);
