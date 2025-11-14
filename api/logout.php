<?php
session_start();
session_unset();
session_destroy();
setcookie('usuario_activo', '', time() - 3600, '/');
echo json_encode(['ok' => true]);
