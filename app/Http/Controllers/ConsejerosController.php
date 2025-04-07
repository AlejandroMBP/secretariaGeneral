<?php

namespace App\Http\Controllers;

use App\Models\Documento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConsejerosController extends Controller
{
    public function listar()
    {
        $documentos = Documento::with(['usuario', 'textos', 'tipoDocumento'])
        ->whereHas('tipoDocumento', function ($query) {
        $query->where('nombre_tipo', 'Consejeros');
        })
    ->latest()
    ->get();

        return Inertia::render('Consejeros/Listar', [
            'documentos' => $documentos
        ]);
    }
}
