<?php
header('Content-Type: application/json; charset=utf-8');
// Si testearás desde otro puerto o dominio, habilita CORS (opcional para localhost)
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");

$host = '127.0.0.1';
$db   = 'mi_despensa_inteligente';
$user = 'root';
$pass = ''; // si tu XAMPP tiene contraseña, ponla aquí
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Error de conexión: ' . $e->getMessage()]);
    exit;
}
