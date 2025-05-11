<?php

namespace App\Http\Controllers;

use App\Models\Documento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConsejerosController extends Controller
{
    public function listar()
    {
        $consejeros = conseje::with([
            'documento.textos:id,documento_id,texto',
            'documento.tipoDocumentoDetalle.tipoDocumento'
        ])

        ->select('id', 'persona', 'nombres', 'apellidos', 'tipoPersona', 'ci', 'documento_id')
        ->latest()
        ->get()
        ->map(function ($anti) {
            return [
                'id'                => $anti->id,
                'persona'           => $anti->persona,
                'nombreCompleto'    => $anti->nombres. ' ' . $anti->apellidos,
                'tipoPersona'       => $anti->tipoPersona,
                'ci'                => $anti->ci,
                'documento_id'      => $anti->documento->tipoDocumentoDetalle->Nombre ?? 'No definido',
                'ruta_de_guardado'  => $anti->documento->ruta_de_guardado ?? null,
                'textos_id'         => $anti->documento->textos->pluck('id')->toArray(),
            ];
        });
        return Inertia::render('Consejeros/Listar', [
            'documentos' => $documentos
        ]);
    }
}
