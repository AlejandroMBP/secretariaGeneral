<?php

namespace App\Http\Controllers;

use App\Models\Documento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AutoridadesController extends Controller
{
    public function listar()
    {
        $documentos = Documento::with(['usuario', 'textos', 'tipoDocumento'])
        ->whereHas('tipoDocumento', function ($query) {
        $query->where('nombre_tipo', 'Autoridades');
        })
    ->latest()
    ->get();

        return Inertia::render('Autoridades/Listar', [
            'documentos' => $documentos
        ]);
    }
}
