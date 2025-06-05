<?php 
require_once __DIR__ . '/../includes/app.php';


use MVC\Router;
use Controllers\AppController;
use Controllers\ClienteController;

$router = new Router();
$router->setBaseURL('/' . $_ENV['APP_NAME']);

$router->get('/', [AppController::class,'index']);

//clientes
$router->get('/clientes', [ClienteController::class, 'renderizarPagina']);
$router->post('/guardarAPI', [ClienteController::class, 'guardarAPI']);
$router->get('/buscarAPI', [ClienteController::class, 'buscarAPI']);
$router->post('/modificarAPI', [ClienteController::class, 'modificarAPI']);
$router->get('/eliminarAPI', [ClienteController::class, 'eliminarAPI']);

// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();
