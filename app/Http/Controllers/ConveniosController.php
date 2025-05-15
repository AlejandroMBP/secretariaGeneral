<?php

namespace App\Http\Controllers;

use App\Models\Convenio;
use App\Models\Documento;
use App\Models\DocumentoTexto;
use App\Models\TipoDocumento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ConveniosController extends Controller
{
    public function listar()
    {
        $convenio = Convenio::with([
            'documento.textos:id,documento_id,texto',
            'documento.tipoDocumentoDetalle',
            'documento.tipoDocumentoDetalle:id,Nombre',
        ])
        ->select('id', 'titulo', 'fecha_inicio', 'fecha_fin', 'adenda', 'documento_id')
        ->latest()
        ->get()
        ->map(function ($resoluciones) {
            $documento = $resoluciones->documento;
            $texto = $documento->textos->first();

            return [
                'id'                => $resoluciones->id,
                'titulo'            => $resoluciones->titulo,
                'fecha_inicio'      => $resoluciones->fecha_inicio,
                'fecha_fin'         => $resoluciones->fecha_fin,
                'adenda'            => $resoluciones->adenda?? 'sin adenda',
                'documento_id'      => $resoluciones->documento->tipoDocumentoDetalle->Nombre ?? 'No definido',
                'ruta_de_guardado'  => $resoluciones->documento->ruta_de_guardado ?? null,
                'texto_id'              => $texto ? $texto->id : null, // ID del texto
                'texto_contenido'       => $texto ? $texto->texto : null, // Contenido del texto
                'tipo_documento'        => $documento->tipoDocumentoDetalle->Nombre ?? null

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
                $documento->load('textos', 'tipoDocumentoDetalle');

                $documento->searchable();
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
    public function update(Request $request, $id)
    {
        // Validar los datos recibidos
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'adenda' => 'nullable|string',
            'tipo_documento' => 'required|string',
            'texto_contenido' => 'required|string',
        ]);

        DB::beginTransaction();

        try {
            // 1. Encontrar el convenio y su documento asociado
            $convenio = Convenio::findOrFail($id);
            $documento = $convenio->documento;

            // 2. Actualizar datos del convenio
            $convenio->update([
                'titulo' => $validated['titulo'],
                'fecha_inicio' => $validated['fecha_inicio'],
                'fecha_fin' => $validated['fecha_fin'],
                'adenda' => $validated['adenda'] === 'sin adenda' ? null : $validated['adenda'],
            ]);

            // 3. Actualizar el tipo de documento si existe
            if ($documento && $documento->tipoDocumentoDetalle) {
                $documento->tipoDocumentoDetalle->update([
                    'Nombre' => $validated['tipo_documento']
                ]);
            }

            // 4. Actualizar el texto asociado
            if ($documento && $documento->textos->isNotEmpty()) {
                $documento->textos()->first()->update([
                    'texto' => $validated['texto_contenido']
                ]);
            }

            DB::commit();

            // Recargar relaciones y hacer searchable si usas Scout
            $documento->load(['textos', 'tipoDocumentoDetalle']);
            if (method_exists($documento, 'searchable')) {
                $documento->searchable();
            }

            return response()->json([
                'success' => true,
                'message' => 'Convenio actualizado correctamente',
                'data' => $convenio->fresh(['documento.textos', 'documento.tipoDocumentoDetalle'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error al actualizar convenio ID {$id}: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el convenio',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}