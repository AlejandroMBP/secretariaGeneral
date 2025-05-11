<?php

namespace App\Http\Controllers;

use App\Models\Convenio;
use App\Models\Documento;
use App\Models\DocumentoTexto;
use App\Models\TipoDocumento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ConveniosController extends Controller
{
    public function listar()
    {
        $convenio = Convenio::with([
            'documento.textos:id,documento_id,texto',
            'documento.tipoDocumentoDetalle'
        ])
        ->select('id', 'titulo', 'fecha_inicio', 'fecha_fin', 'adenda', 'documento_id')
        ->latest()
        ->get()
        ->map(function ($resoluciones) {
            return [
                'id'                => $resoluciones->id,
                'titulo'            => $resoluciones->titulo,
                'fecha_inicio'      => $resoluciones->fecha_inicio,
                'fecha_fin'         => $resoluciones->fecha_fin,
                'adenda'            => $resoluciones->adenda?? 'sin adenda',
                'documento_id'      => $resoluciones->documento->tipoDocumentoDetalle->Nombre ?? 'No definido',
                'ruta_de_guardado'  => $resoluciones->documento->ruta_de_guardado ?? null,
            ];
        });


        return Inertia::render('Convenios/Listar', [
            'documentos' => $convenio
        ]);
    }
    public function FConvenio()
    {
        $tipoDocumentos = TipoDocumento::with('detalles')
            ->whereIn('Nombre_tipo', ['CONVENIO'])
            ->get();

        return Inertia::render('Formularios/Convenios', [
            'tipoDocumento' => $tipoDocumentos,
        ]);
    }
    public function convenio_guardar(Request $request)
    {
        try {
            $validated = $request->validate([
                'titulo'             => 'required|string|max:255',
                'fecha_inicio'       => 'required|date',
                'fecha_fin'          => 'required|date|after_or_equal:fecha_inicio',
                'adenda'             => 'nullable|date|after_or_equal:fecha_inicio',
                'ruta_temporal'      => 'required|string|max:255',
                'detalleDocumentoId' => 'required|integer|exists:tipo_documento_detalle,id',
                'tipoDocumentoId'    => 'required|integer|exists:tipo_documento,id',
                'texto_extraido'     => 'required|string',
            ], [
                'titulo.required' => 'El campo título es obligatorio.',
                'titulo.max' => 'El título no debe exceder los 255 caracteres.',
                'fecha_inicio.required' => 'La fecha de inicio es obligatoria.',
                'fecha_inicio.date' => 'La fecha de inicio debe tener un formato válido.',
                'fecha_fin.required' => 'La fecha de finalización es obligatoria.',
                'fecha_fin.date' => 'La fecha de finalización debe tener un formato válido.',
                'fecha_fin.after_or_equal' => 'La fecha de finalización debe ser igual o posterior a la fecha de inicio.',
                'adenda.date' => 'La fecha de adenda debe tener un formato válido.',
                'adenda.after_or_equal' => 'La fecha de adenda debe ser igual o posterior a la fecha de inicio.',
                'ruta_temporal.required' => 'La ruta del archivo es obligatoria.',
                'detalleDocumentoId.required' => 'Debe seleccionar un detalle del documento.',
                'detalleDocumentoId.integer' => 'El detalle del documento debe ser un número.',
                'detalleDocumentoId.exists' => 'El detalle del documento seleccionado no es válido.',
                'tipoDocumentoId.required' => 'Debe seleccionar un tipo de documento.',
                'tipoDocumentoId.integer' => 'El tipo de documento debe ser un número.',
                'tipoDocumentoId.exists' => 'El tipo de documento seleccionado no es válido.',
                'texto_extraido.required' => 'El texto extraído es obligatorio.',
            ]);

            $documento = new Documento();
            $documento->ruta_de_guardado = $validated['ruta_temporal'];
            $documento->tipo_documento_detalle_id = $validated['detalleDocumentoId'] ?? null;
            $documento->tipo_archivo = 'pdf';
            $documento->gestion_ = now();
            $documento->usuario_id = Auth::id();
            $documento->save();

            if ($request->texto_extraido) {
                DocumentoTexto::create([
                    'documento_id' => $documento->id,
                    'texto' => $request->texto_extraido,
                ]);
            }

            $convenio = Convenio::create([
                'titulo'        => $validated['titulo'],
                'fecha_inicio'  => $validated['fecha_inicio'],
                'fecha_fin'     => $validated['fecha_fin'],
                'adenda'        => $validated['adenda'],
                'documento_id'  => $documento->id,
            ]);

            return response()->json([
                'message' => 'Convenio registrado exitosamente.',
                'convenio' => $convenio,
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error al guardar el convenio: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);

            return response()->json([
                'message' => 'Ocurrió un error al registrar el convenio.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}
