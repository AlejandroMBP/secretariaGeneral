<?php

namespace App\Http\Controllers;

use App\Models\Diploma;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BachilleresController extends Controller
{
    public function listar()
    {
        $diplomas = Diploma::with([
            'documento.textos:id,documento_id,texto',
            'documento.tipoDocumentoDetalle.tipoDocumento',
            'documento.tipoDocumentoDetalle:id,Nombre',

        ])
        ->whereHas('documento.tipoDocumentoDetalle.tipoDocumento', function($query) {
            $query->where('Nombre_tipo', 'DIPLOMAS DE BACHILLER');
        })
        ->select('id', 'numero_serie', 'carrera', 'nombres', 'apellidos', 'fecha_nacimiento', 'fecha_emision', 'documento_id')
        ->latest()
        ->get()
        ->map(function ($diploma) {
            $documento = $diploma->documento;
            $texto = $documento->textos->first();
            return [
                'id'                => $diploma->id,
                'numero_serie'      => $diploma->numero_serie,
                'carrera'           => $diploma->carrera,
                'nombreCompleto'    => $diploma->nombres . ' ' . $diploma->apellidos,
                'nombres'           => $diploma->nombres,
                'apellidos'         => $diploma->apellidos,
                'Nombre_tipo'       => 'DIPLOMAS DE BACHILLER',
                'fecha_nacimiento'  => $diploma->fecha_nacimiento,
                'fecha_emision'     => $diploma->fecha_emision,
                'ruta_de_guardado'  => $diploma->documento->ruta_de_guardado ?? null,
                'documento_id'      => $diploma->documento_id,
                'texto_id'              => $texto ? $texto->id : null,
                'texto_contenido'       => $texto ? $texto->texto : null,
                'tipo_documento'        => $documento->tipoDocumentoDetalle->Nombre ?? null
            ];
        });

        // Log::debug("Diplomas de bachiller:", $diplomas->toArray());

        return Inertia::render('Bachiller/Listar', [
            'documentos' => $diplomas
        ]);
    }
    public function update(Request $request, $id)
{
    // Validar los datos recibidos
    $validatedData = $request->validate([
        'numero_serie' => 'required|string',
        'nombres' => 'required|string',
        'apellidos' => 'required|string',
        'fecha_nacimiento' => 'required|date',
        'fecha_emision' => 'required|date',
        'tipo_documento' => 'required|string',
        'carrera' => 'required|string',
        'texto_id' => 'required|integer',
        'texto_contenido' => 'required|string',
    ]);

    try {
        // Buscar el diploma a actualizar
        $diploma = Diploma::findOrFail($id);
        $documento = $diploma->documento;
        // Actualizar los datos del diploma
        $diploma->update([
            'numero_serie' => $validatedData['numero_serie'],
            'nombres' => $validatedData['nombres'],
            'apellidos' => $validatedData['apellidos'],
            'fecha_nacimiento' => $validatedData['fecha_nacimiento'],
            'fecha_emision' => $validatedData['fecha_emision'],
            'carrera' => $validatedData['carrera'],
        ]);

        // Actualizar el texto asociado al documento
        if ($diploma->documento && $diploma->documento->textos) {
            $texto = $diploma->documento->textos->first();
            if ($texto) {
                $texto->update([
                    'texto' => $validatedData['texto_contenido']
                ]);
            }
        }

        // Actualizar el tipo de documento si es necesario
        if ($diploma->documento && $diploma->documento->tipoDocumentoDetalle) {
            $diploma->documento->tipoDocumentoDetalle->update([
                'Nombre' => $validatedData['tipo_documento']
            ]);
        }
        $documento->load('textos');

        $documento->searchable();

        return response()->json([
            'success' => true,
            'message' => 'Diploma actualizado correctamente',
        ]);

    } catch (\Exception $e) {
        Log::error('Error al actualizar diploma: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Error al actualizar el diploma',
            'error' => $e->getMessage()
        ], 500);
    }
}

}
