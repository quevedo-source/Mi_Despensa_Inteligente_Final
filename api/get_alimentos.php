<?php
require 'config.php';

$user_id = (int)($_GET['user_id'] ?? 0);
if (!$user_id) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'user_id requerido']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, nombre, fecha, nombreAPI, infoNutricional FROM alimentos WHERE user_id = ? ORDER BY fecha ASC");
$stmt->execute([$user_id]);
$rows = $stmt->fetchAll();

echo json_encode(['ok' => true, 'alimentos' => $rows]);
