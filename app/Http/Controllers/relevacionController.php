<?php

namespace App\Http\Controllers;

use App\Models\Diploma;
use Illuminate\Http\Request;
use Inertia\Inertia;

class relevacionController extends Controller
{
    public function listar()
    {
        $diplomas = Diploma::with([
            'documento.textos:id,documento_id,texto',
            'documento.tipoDocumentoDetalle.tipoDocumento',
            'documento.tipoDocumentoDetalle:id,Nombre',
    ])
        ->whereHas('documento.tipoDocumentoDetalle.tipoDocumento', function($query){
            $query->where('Nombre_tipo','TÍTULOS PROFESIONALES POR REVALIDACIÓN');
        })
        ->select('id', 'numero_serie', 'carrera', 'nombres', 'apellidos', 'fecha_nacimiento', 'fecha_emision', 'documento_id')
        ->latest()
        ->get()
        ->map(function ($diploma) {
            $documento = $diploma->documento;
            $texto = $documento->textos->first();

            return [
                'id'                    => $diploma->id,
                'numero_serie'         => $diploma->numero_serie,
                'carrera'             => $diploma->carrera,
                'nombreCompleto'        =>$diploma->nombres. ' ' .$diploma->apellidos,
                'fecha_nacimiento'     => $diploma->fecha_nacimiento,
                'fecha_emision'       => $diploma->fecha_emision,
                'ruta_de_guardado'     => $diploma->documento->ruta_de_guardado ?? null,
                'Nombre_tipo'       => 'TÍTULOS PROFESIONALES POR REVALIDACIÓN',  // Valor fijo
                'documento_id'         => $diploma->documento_id,
                'nombres'           => $diploma->nombres,
                'apellidos'         => $diploma->apellidos,
                'texto_id'              => $texto ? $texto->id : null,
                'texto_contenido'       => $texto ? $texto->texto : null,
                'tipo_documento'        => $documento->tipoDocumentoDetalle->Nombre ?? null

            ];
        });

        return Inertia::render('titulosRelevacion/Listar', [
            'documentos' => $diplomas
        ]);
    }
}