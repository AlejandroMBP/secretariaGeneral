<?php

namespace App\Http\Controllers;

use App\Models\Documento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AntiAutonomistasController extends Controller
{
    public function listar(){
        $documentos = Documento::with(['usuario', 'textos', 'tipoDocumento'])
        ->whereHas('tipoDocumento', function ($query) {
        $query->where('nombre_tipo', 'Anti-Autonomistas');
        })
        ->latest()
        ->get();
        Return Inertia::render('AntiAutonimistas/Listar',['documentos' => $documentos]);

    }
}
