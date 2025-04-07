<?php

namespace App\Http\Controllers;

use App\Models\Documento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RectoralesController extends Controller
{
    public function listar()
    {
        $documentos = Documento::with(['usuario', 'textos', 'tipoDocumento'])
        ->whereHas('tipoDocumento', function ($query) {
        $query->where('nombre_tipo', 'Resoluciones Rectorales');
        })
    ->latest()
    ->get();

        return Inertia::render('Rectorales/Listar', [
            'documentos' => $documentos
        ]);
    }
}
