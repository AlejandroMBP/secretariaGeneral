<?php

namespace App\Http\Controllers;

use App\Models\Documento;
use App\Models\Resolucion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class HCUController extends Controller
{
    public function listar()
    {

        $resolucion = Resolucion::with([
            'documento.textos:id,documento_id,texto',
            'documento.tipoDocumentoDetalle',
            'documento.tipoDocumentoDetalle:id,Nombre',
    ])
        ->whereHas('documento.tipoDocumentoDetalle', function($query){
            $query->where('Nombre','HCU');
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

        return Inertia::render('resoluciones/HCU/Listar', [
            'documentos' => $resolucion
        ]);
    }
    public function update(Request $request, $id)
    {
        // Log::debug("Actualizando documento: ".$id);
        // Log::debug("Datos recibidos:", $request->all());

        // Validar los datos
        $validated = $request->validate([
            'nombre_del_documento' => 'required|string|max:255',
            'lo_que_resuelve' => 'required|string',
            'gestion' => 'required|date',
            'texto_contenido' => 'required|string',
        ]);

        try {
            // 1. Encontrar la resolución y su documento asociado
            $resolucion = Resolucion::findOrFail($id);
            $documento = $resolucion->documento; // Obtener el documento padre

            // 2. Actualizar datos de la resolución
            $resolucion->update([
                'nombre_del_documento' => $validated['nombre_del_documento'],
                'lo_que_resuelve' => $validated['lo_que_resuelve'],
                'gestion' => $validated['gestion'],
            ]);

            // 3. Actualizar el texto asociado (en el DocumentoTexto)
            if ($documento && $documento->textos->isNotEmpty()) {
                $documento->textos()->first()->update([
                    'texto' => $validated['texto_contenido']
                ]);
            }
            $documento->load('textos');

            $documento->searchable();
            return response()->json(['success' => true, 'message' => 'Documento actualizado correctamente']);

        } catch (\Exception $e) {
            Log::error("Error al actualizar documento: ".$e->getMessage());
            return response()->json(['success' => false, 'message' => 'Error al actualizar el documento'], 500);
        }
    }
}
