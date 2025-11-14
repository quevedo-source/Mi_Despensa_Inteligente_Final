<?php
require 'config.php';
$user_id = (int)($_GET['user_id'] ?? 0);

if (!$user_id) {
    echo json_encode(['ok' => false, 'msg' => 'Falta user_id']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, nombre, telefono, direccion, correo FROM direcciones WHERE user_id = ?");
$stmt->execute([$user_id]);
$rows = $stmt->fetchAll();

echo json_encode(['ok' => true, 'direcciones' => $rows]);
