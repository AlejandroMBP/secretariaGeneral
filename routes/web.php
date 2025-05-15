<?php

use App\Http\Controllers\AcademicosController;
use App\Http\Controllers\agdeController;
use App\Http\Controllers\AntiAutonomistasController;
use App\Http\Controllers\ArchivosController;
use App\Http\Controllers\AutoridadesController;
use App\Http\Controllers\BachilleresController;
use App\Http\Controllers\CongresoController;
use App\Http\Controllers\ConsejerosController;
use App\Http\Controllers\ConveniosController;
use App\Http\Controllers\DashboardAreaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DashboardPastelController;
use App\Http\Controllers\DiplomasController;
use App\Http\Controllers\DocumentoController;
use App\Http\Controllers\HCUController;
use App\Http\Controllers\PostGradoController;
use App\Http\Controllers\ProfesionalesController;
use App\Http\Controllers\RectoralesController;
use App\Http\Controllers\relevacionController;
use App\Http\Controllers\RolesPermisosController;
use App\Http\Controllers\supletorioController;
use App\Http\Controllers\userController;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('/usuarios', [userController::class, 'index'])->name('usuario.index');
Route::post('/usuarios', [userController::class, 'store'])->name('usuario.store');
Route::delete('/usuarios/{user}', [userController::class, 'destroy'])->name('usuarios.destroy');
Route::put('/usuarios/{id}', [userController::class, 'update']);

Route::get('/roles', [RolesPermisosController::class, 'index'])->name('roles.index');
Route::post('/roles', [RolesPermisosController::class, 'store'])->name('roles.store');
Route::put('/roles/{role}', [RolesPermisosController::class, 'update'])->name('roles.update');
Route::delete('/roles/destroy/{role}', [RolesPermisosController::class, 'destroy'])->name('roles.destroy');

Route::post('/roles/{role}/permissions', [RolesPermisosController::class, 'assignPermissions'])->name('roles.assignPermissions');

Route::get('/archivos', [ArchivosController::class, 'index'])->name('archivos.index');
Route::get('/Diplomas-Cards', [ArchivosController::class, 'diplomas'])->name('diplomas.index');
Route::get('/Resoluciones-Cards', [ArchivosController::class, 'resoluciones'])->name('resoluciones.index');

Route::get('/formulario/resoluciones', [ArchivosController::class,'FResoluciones'])->name('formulario.ver');
Route::post('/formulario/resoluciones/guardar', [ArchivosController::class,'resoluciones_guardar'])->name('resolucion.guardar');
Route::get('/formulario/diplomas', [DiplomasController::class,'FDiplomas'])->name('diplomas.ver');
Route::post('/formulario/diplomas/guardar', [DiplomasController::class,'diplomas_guardar'])->name('diplomas.guardar');
Route::get('/formulario/convenio', [ConveniosController::class,'FConvenio'])->name('convenio.ver');
Route::post('/formulario/convenio/guardar', [ConveniosController::class,'convenio_guardar'])->name('convenio.guardar');


Route::get('/documentos', [DocumentoController::class, 'index'])->name('documento.index');
Route::post('/cargar-pdf', [DocumentoController::class, 'cargar'])->name('documento.cargar');
Route::get('/orcimagen', [DocumentoController::class, 'imagenOCR'])->name('documento.imagenOCR');
Route::post('/documentos/preprocesar', [DocumentoController::class, 'preprocesarArchivo']);
Route::post('/documentos/guardar',[DocumentoController::class, 'guardar'])->name('documentos.guardar');
Route::get('/documentos-listar', [DocumentoController::class, 'listar'])->name('documentos.listar');
Route::post('/documentos/ver-pdf', [DocumentoController::class, 'agregarMarcaDeAgua'])->name('documentos.verPDFImagen');
Route::put('/documentos/editar',[DocumentoController::class, 'editarDocumento'])->name('documento.editar');
Route::delete('/documentos/eliminar/{id}',[DocumentoController::class,'eliminar'])->name('documentos.eliminar');

Route::get('/documentos/buscar', [DocumentoController::class, 'buscar'])->name('documentos.buscar');

// diplomas
Route::get('/Bachiller-listar', [BachilleresController::class, 'listar'])->name('bachiller.listar');
Route::get('/Profesionales-listar', [ProfesionalesController::class, 'listar'])->name('profesionales.listar');
Route::get('/Academicos-listar', [AcademicosController::class, 'listar'])->name('academicos.listar');
Route::get('/post-grado-listar', [PostGradoController::class, 'listar'])->name('postgrado.listar');
Route::get('/relevacion-listar', [relevacionController::class, 'listar'])->name('relevacion.listar');
Route::get('/supletorio-listar', [supletorioController::class, 'listar'])->name('supletorio.listar');


Route::get('/Hcu-listar', [HCUController::class, 'listar'])->name('hcu.listar');
Route::get('/Rectorales-listar', [RectoralesController::class, 'listar'])->name('rectorales.listar');
Route::get('/Congreso-listar', [CongresoController::class, 'listar'])->name('congreso.listar');
Route::get('/Agde-listar', [agdeController::class, 'listar'])->name('agde.listar');

Route::put('hcu-update/{id}',[HCUController::class,'update'])->name('hcu.update');
Route::put('diplomas-update/{id}',[BachilleresController::class, 'update']);

Route::get('/AntiAutonomistas-listar', [AntiAutonomistasController::class, 'listar'])->name('antiAutonomistas.listar');
Route::put('/Anti-update/{id}',[AntiAutonomistasController::class,'update']);

Route::get('/buscar-resolucion',[AntiAutonomistasController::class, 'buscarResolucion']);
Route::post('/cargar-anti',[AntiAutonomistasController::class,'store']);

Route::get('/Autoridades-listar', [AutoridadesController::class, 'listar'])->name('autoridades.listar');
Route::put("/Autoridades-update/{id}",[AutoridadesController::class,'update']);
Route::post('/cargar-autoridad',[AutoridadesController::class,'store']);
Route::get('/Convenios-listar', [ConveniosController::class, 'listar'])->name('Convenios.listar');
Route::put('/convenios-update/{id}',[ConveniosController::class,'update'])->name('convenio.update');
Route::get('/Consejeros-listar', [ConsejerosController::class, 'listar'])->name('consejeros.listar');

Route::get('/stats/monthly-activity', [DashboardController::class, 'monthlyActivity']);
Route::get('/stats/document-activity', [DashboardAreaController::class, 'documentActivity']);
Route::get('/document-stats', [DashboardPastelController::class, 'getDocumentStats']);
Route::get('/estadisticas-documentos', [DashboardPastelController::class, 'estadisticas']);
});
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';