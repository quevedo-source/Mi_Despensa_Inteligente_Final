<?php
require 'config.php';
$data = json_decode(file_get_contents('php://input'), true);
$id = (int)($data['id'] ?? 0);
$user_id = (int)($data['user_id'] ?? 0);

if (!$id || !$user_id) {
    echo json_encode(['ok' => false, 'msg' => 'Faltan datos']);
    exit;
}

$stmt = $pdo->prepare("DELETE FROM direcciones WHERE id = ? AND user_id = ?");
$stmt->execute([$id, $user_id]);

echo json_encode(['ok' => true]);
