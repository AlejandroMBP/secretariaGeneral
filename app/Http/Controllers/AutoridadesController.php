<?php

namespace App\Http\Controllers;

use App\Models\Autoridad;
use App\Models\Documento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AutoridadesController extends Controller
{
    public function listar()
    {
        $autoridades = Autoridad::with([
            'documento.textos:id,documento_id,texto',
            'documento.tipoDocumentoDetalle.tipoDocumento'
        ])

        ->select('id', 'persona', 'nombres', 'apellidos', 'tipo_posicio', 'gestion','celular', 'documento_id')
        ->latest()
        ->get()
        ->map(function ($autoridad) {
            return [
                'id'                => $autoridad->id,
                'persona'           => $autoridad->persona,
                'nombreCompleto'    => $autoridad->nombres. ' ' . $autoridad->apellidos,
                'tipo_posicion'     => $autoridad->tipo_posicio,
                'gestion'           => $autoridad->gestion,
                'documento_id'      => $autoridad->documento->tipoDocumentoDetalle->Nombre ?? 'No definido',
                'ruta_de_guardado'  => $autoridad->documento->ruta_de_guardado ?? null,
                'celular'           => $autoridad->celular,
            ];
        });

        return Inertia::render('Autoridades/Listar', [
            'documentos' => $autoridades
        ]);
    }
    public function FAutoridades(){

    }
}
