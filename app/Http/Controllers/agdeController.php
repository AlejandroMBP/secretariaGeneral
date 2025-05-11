<?php

namespace App\Http\Controllers;

use App\Models\Resolucion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class agdeController extends Controller
{
    public function listar()
    {

        $resolucion = Resolucion::with([
            'documento.textos:id,documento_id,texto',
            'documento.tipoDocumentoDetalle'
    ])
        ->whereHas('documento.tipoDocumentoDetalle', function($query){
            $query->where('Nombre','AGDE');
        })
        ->select('id', 'numero_resolucion', 'nombre_del_documento', 'lo_que_resuelve', 'gestion', 'documento_id', 'd_a_documento_id')
        ->latest()
        ->get()
        ->map(function ($resoluciones) {
            return [
                'id'                   => $resoluciones->id,
                'numero_resolucion'    => $resoluciones->numero_resolucion,
                'nombre_del_documento' => $resoluciones->nombre_del_documento,
                'lo_que_resuelve'      => $resoluciones->lo_que_resuelve,
                'gestion'              => $resoluciones->gestion,
                'documento_id'         => $resoluciones->documento_id,
                'ruta_de_guardado'     => $resoluciones->documento->ruta_de_guardado ?? null,
                'd_a_documento_id'     => $resoluciones->d_a_documento_id,
            ];
        });

        return Inertia::render('resoluciones/Agde/Listar', [
            'documentos' => $resolucion
        ]);
    }
}