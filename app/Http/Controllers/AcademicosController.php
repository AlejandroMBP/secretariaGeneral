<?php

namespace App\Http\Controllers;

use App\Models\Documento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicosController extends Controller
{
    public function listar(){
        $documentos = Documento::with(['usuario', 'textos', 'tipoDocumento'])
        ->whereHas('tipoDocumento', function ($query) {
        $query->where('nombre_tipo', 'Diplomas Academicos');
        })
        ->latest()
        ->get();
        Return Inertia::render('Academicos/Listar',['documentos' => $documentos]);

    }
}