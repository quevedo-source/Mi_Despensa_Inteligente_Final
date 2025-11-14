<?php
require 'config.php';
session_start();

$data = json_decode(file_get_contents('php://input'), true);
$correo = trim($data['correo'] ?? '');
$pass = $data['pass'] ?? '';

$stmt = $pdo->prepare("SELECT id, nombre, pass_hash FROM usuarios WHERE correo = ?");
$stmt->execute([$correo]);
$user = $stmt->fetch();

if ($user && password_verify($pass, $user['pass_hash'])) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['nombre'] = $user['nombre'];

    // cookie visible 1 hora
    setcookie('usuario_activo', $user['nombre'], time() + 3600, '/');

    echo json_encode(['ok' => true, 'user' => ['id' => (int)$user['id'], 'nombre' => $user['nombre']]]);
} else {
    echo json_encode(['ok' => false, 'msg' => 'Credenciales incorrectas']);
}

