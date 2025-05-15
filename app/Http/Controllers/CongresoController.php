<?php

namespace App\Http\Controllers;

use App\Models\Resolucion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CongresoController extends Controller
{

    public function listar()
    {

        $resolucion = Resolucion::with([
            'documento.textos:id,documento_id,texto',
            'documento.tipoDocumentoDetalle',
            'documento.tipoDocumentoDetalle:id,Nombre',
    ])
        ->whereHas('documento.tipoDocumentoDetalle', function($query){
            $query->where('Nombre','CONGRESO');
        })
        ->select('id', 'numero_resolucion', 'nombre_del_documento', 'lo_que_resuelve', 'gestion', 'documento_id', 'd_a_documento_id')
        ->latest()
        ->get()
        ->map(function ($resoluciones) {
            $documento = $resoluciones->documento;
            $texto = $documento->textos->first();
            return [
                'id'                   => $resoluciones->id,
                'numero_resolucion'    => $resoluciones->numero_resolucion,
                'nombre_del_documento' => $resoluciones->nombre_del_documento,
                'lo_que_resuelve'      => $resoluciones->lo_que_resuelve,
                'gestion'              => $resoluciones->gestion,
                'documento_id'         => $resoluciones->documento_id,
                'ruta_de_guardado'     => $resoluciones->documento->ruta_de_guardado ?? null,
                'd_a_documento_id'     => $resoluciones->d_a_documento_id,
                'texto_id'              => $texto ? $texto->id : null, // ID del texto
                'texto_contenido'       => $texto ? $texto->texto : null, // Contenido del texto
                'tipo_documento'        => $documento->tipoDocumentoDetalle->Nombre ?? null
            ];
        });

        return Inertia::render('resoluciones/Congreso/Listar', [
            'documentos' => $resolucion
        ]);
    }
}
