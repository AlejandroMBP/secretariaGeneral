<?php

namespace App\Http\Controllers;

use App\Models\Documento;
use App\Models\DocumentoTexto;
use App\Models\Resolucion;
use App\Models\TipoDocumento;
use App\Models\TipoDocumentoDetalle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ArchivosController extends Controller
{
    public function index()
    {
        $tipoDocumentos = TipoDocumento::all();
        return Inertia::render('Archivos/index',[
            'tipoDocumentos' => $tipoDocumentos,]);
    }
    public function FResoluciones()
{
    $tipoDocumentos = TipoDocumento::with('detalles')
    ->where('nombre_tipo', 'RESOLUCIÓN')
    ->get();

    return Inertia::render('Formularios/Resoluciones', [
        'tipoDocumento' => $tipoDocumentos,
    ]);

    }
    public function resoluciones_guardar(Request $request)
    {
        Log::debug("Datos recibidos", $request->all());

        $validated = $request->validate(
            [
                'titulo' => 'required|string|max:255',
                'descripcion' => 'required|string',
                'numero' => ['required', 'integer', 'min:0'],
                'fecha' => ['required', 'date', 'after_or_equal:2000-01-01', 'before_or_equal:today'],
                'ruta_temporal' => 'required|string',
                'detalleDocumentoId' => 'required|exists:tipo_documento_detalle,id',
                'texto_extraido' => 'nullable|string',
            ],
            [
                'titulo.required' => 'El título es obligatorio.',
                'titulo.string' => 'El título debe ser una cadena de texto.',
                'titulo.max' => 'El título no debe superar los 255 caracteres.',

                'descripcion.required' => 'La descripción es obligatoria.',
                'descripcion.string' => 'La descripción debe ser una cadena de texto.',

                'numero.required' => 'El número es obligatorio.',
                'numero.integer' => 'El número debe ser un valor entero sin caracteres especiales.',
                'numero.min' => 'El número no puede ser negativo.',

                'fecha.required' => 'La fecha es obligatoria.',
                'fecha.date' => 'La fecha no tiene un formato válido.',
                'fecha.after_or_equal' => 'La fecha no puede ser anterior al año 2000.',
                'fecha.before_or_equal' => 'La fecha no puede ser mayor a la fecha actual.',

                'ruta_temporal.required' => 'La ruta temporal es obligatoria.',
                'ruta_temporal.string' => 'La ruta temporal debe ser una cadena de texto.',

                'detalleDocumentoId.required' => 'Debe seleccionar un tipo de documento.',
                'detalleDocumentoId.exists' => 'El tipo de documento seleccionado no es válido.',

                'texto_extraido.string' => 'El texto extraído debe ser una cadena de texto.',
            ]
        );

        $documento = new Documento();
        $documento->ruta_de_guardado = $request->ruta_temporal;
        $documento->tipo_documento_detalle_id = $request->detalleDocumentoId;
        $documento->tipo_archivo = 'pdf';
        $documento->gestion_ = now();
        $documento->usuario_id = Auth::id();
        $documento->save();

        Log::debug('Documento creado con ID: ', ['documento_id' => $documento->id]);

        if ($request->texto_extraido) {
            DocumentoTexto::create([
                'documento_id' => $documento->id,
                'texto' => $request->texto_extraido,
            ]);
            $documento->load('textos', 'tipoDocumentoDetalle');

            $documento->searchable();
        }

        // Verificar si el documento fue guardado correctamente
        if (!$documento->id) {
            return response()->json(['message' => 'Error al guardar el documento'], 500);
        }

        // Insertar en la tabla resoluciones
        $resolucion = Resolucion::create([
            'nombre_del_documento' => $validated['titulo'],
            'lo_que_resuelve' => $validated['descripcion'],
            'numero_resolucion' => $validated['numero'],
            'gestion' => $validated['fecha'],
            'documento_id' => $documento->id,
        ]);

        Log::debug('Resolución guardada', ['resolucion_id' => $resolucion->id]);

        return response()->json(['message' => 'Resolución guardada exitosamente', 'resolucion' => $resolucion], 201);
    }

}
