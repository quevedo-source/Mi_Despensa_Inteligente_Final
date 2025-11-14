<?php
require 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$user_id = (int)($data['user_id'] ?? 0);
$nombre = trim($data['nombre'] ?? '');
$fecha = $data['fecha'] ?? '';
$nombreAPI = $data['nombreAPI'] ?? null;
$infoNutricional = $data['infoNutricional'] ?? null;

if (!$user_id || !$nombre || !$fecha) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'Faltan datos']);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO alimentos (user_id, nombre, fecha, nombreAPI, infoNutricional) VALUES (?, ?, ?, ?, ?)");
$stmt->execute([$user_id, $nombre, $fecha, $nombreAPI, $infoNutricional]);
echo json_encode(['ok' => true, 'id' => $pdo->lastInsertId()]);
