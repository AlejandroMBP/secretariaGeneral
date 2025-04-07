<?php

namespace App\Http\Controllers;

use App\Models\Documento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BachilleresController extends Controller
{
    public function listar()
    {
        $documentos = Documento::with(['usuario', 'textos', 'tipoDocumento'])
        ->whereHas('tipoDocumento', function ($query) {
        $query->where('nombre_tipo', 'Diplomas Bachiller');
        })
    ->latest()
    ->get();

        return Inertia::render('Bachiller/Listar', [
            'documentos' => $documentos
        ]);
    }
}
