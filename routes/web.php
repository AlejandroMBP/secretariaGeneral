<?php

use App\Http\Controllers\DocumentoController;
use App\Http\Controllers\RolesPermisosController;
use App\Http\Controllers\userController;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Redirect()->route('login');
})->name('home');

Route::get('/usuarios', [userController::class, 'index'])->name('usuario.index');
Route::post('/usuarios', [userController::class, 'store'])->name('usuario.store');
Route::delete('/usuarios/{user}', [userController::class, 'destroy'])->name('usuarios.destroy');
Route::put('/usuarios/{id}', [userController::class, 'update']);

Route::get('/roles', [RolesPermisosController::class, 'index'])->name('roles.index');
Route::post('/roles', [RolesPermisosController::class, 'store'])->name('roles.store');
Route::put('/roles/{role}', [RolesPermisosController::class, 'update'])->name('roles.update');
Route::delete('/roles/destroy/{role}', [RolesPermisosController::class, 'destroy'])->name('roles.destroy');

Route::post('/roles/{role}/permissions', [RolesPermisosController::class, 'assignPermissions'])->name('roles.assignPermissions');

Route::get('/documentos', [DocumentoController::class, 'index'])->name('documento.index');
Route::post('/cargar-pdf', [DocumentoController::class, 'cargar'])->name('documento.cargar');
Route::get('/orcimagen', [DocumentoController::class, 'imagenOCR'])->name('documento.imagenOCR');
Route::post('/documentos/preprocesar', [DocumentoController::class, 'preprocesarArchivo']);
Route::post('/documentos/guardar',[DocumentoController::class, 'guardar'])->name('documentos.guardar');
Route::get('/documentos-listar', [DocumentoController::class, 'listar'])->name('documentos.listar');
Route::post('/documentos/ver-pdf', [DocumentoController::class, 'agregarMarcaDeAgua'])
    ->name('documentos.verPDFImagen');
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';