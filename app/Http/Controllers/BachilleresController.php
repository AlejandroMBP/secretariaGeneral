<?php

namespace App\Http\Controllers;

use App\Models\Diploma;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BachilleresController extends Controller
{
    public function listar()
{
    $diplomas = Diploma::with([
        'documento.textos:id,documento_id,texto',
        'documento.tipoDocumentoDetalle.tipoDocumento'
    ])
    ->whereHas('documento.tipoDocumentoDetalle.tipoDocumento', function($query) {
        $query->where('Nombre_tipo', 'DIPLOMAS DE BACHILLER');
    })
    ->select('id', 'numero_serie', 'carrera', 'nombres', 'apellidos', 'fecha_nacimiento', 'fecha_emision', 'documento_id')
    ->latest()
    ->get()
    ->map(function ($diploma) {
        return [
            'id'                => $diploma->id,
            'numero_serie'      => $diploma->numero_serie,
            'carrera'           => $diploma->carrera,
            'nombreCompleto'    => $diploma->nombres . ' ' . $diploma->apellidos,
            'fecha_nacimiento'  => $diploma->fecha_nacimiento,
            'fecha_emision'     => $diploma->fecha_emision,
            'ruta_de_guardado'  => $diploma->documento->ruta_de_guardado ?? null,
            'tipo_documento'    => 'DIPLOMAS DE BACHILLER',
            'documento_id'      => $diploma->documento_id,
            'textos_id'         => $diploma->documento->textos->pluck('id')->toArray(),
        ];
    });

    Log::debug("Diplomas de bachiller:", $diplomas->toArray());

    return Inertia::render('Bachiller/Listar', [
        'documentos' => $diplomas
    ]);
}
}