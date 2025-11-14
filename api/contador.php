<?php
require 'config.php';
$stmt = $pdo->query("UPDATE contador_visitas SET total = total + 1 WHERE id = 1");
$stmt = $pdo->query("SELECT total FROM contador_visitas WHERE id = 1");
$total = $stmt->fetchColumn();
echo json_encode(['ok' => true, 'total' => $total]);
