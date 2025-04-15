<?php

namespace App\Http\Controllers;

use App\Models\Diploma;
use App\Models\Documento;
use App\Models\DocumentoTexto;
use App\Models\TipoDocumento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DiplomasController extends Controller
{
    public function FDiplomas(){
        $tipoDocumentos = TipoDocumento::with('detalles')
        ->whereIn('Nombre_tipo', ['TÍTULOS PROFESIONALES',
        'DIPLOMAS DE BACHILLER',
        'CERTIFICADOS SUPLETORIO',
        'DIPLOMAS ACADÉMICOS',
        'TÍTULOS PROFESIONALES POR REVALIDACIÓN',
        'DIPLOMAS DE POST GRADO',])
        ->get();

    return Inertia::render('Formularios/Diplomas', [
        'tipoDocumento' => $tipoDocumentos,
    ]);
    }
    public function diplomas_guardar(Request $request){
        Log::debug('lo uqe lleva diplomas:',$request->all());
        $request->merge([
            'detalleDocumentoId' => $request->input('detalleDocumentoId') ?: null,
            'tipoDocumentoId' => $request->input('tipoDocumentoId') ?: null,
        ]);

        $tipoDocumentoNombre = null;
        if ($request->filled('tipoDocumentoId')) {
            $tipo = DB::table('tipo_documento')->where('id', $request->input('tipoDocumentoId'))->first();
            $tipoDocumentoNombre = $tipo?->Nombre_tipo;
        }

        $rules = [
            'numero' => 'required|string|max:255',
            'nombre' => 'required|string|max:255|regex:/^[\pL\s\-]+$/u',
            'apellido' => 'required|string|max:255|regex:/^[\pL\s\-]+$/u',
            'fecha_emision' => 'required|date',
            'fecha_nacimiento' => [
                'required',
                'date',
                'before:today',
                'after_or_equal:1920-01-01',
                'before_or_equal:' . now()->subYears(5)->toDateString(),
            ],
            'ruta_temporal' => 'required|string',
            'tipoDocumentoId' => 'nullable|integer|exists:tipo_documento,id',
            'detalleDocumentoId' => 'nullable|integer|exists:tipo_documento_detalle,id',
            'texto_extraido' => 'nullable|string',
        ];

        if ($tipoDocumentoNombre !== 'DIPLOMAS DE BACHILLER') {
            $rules['carrera'] = 'required|string|max:255|regex:/^[\pL\s\-]+$/u';
        }
        $validated = $request->validate($rules, [
            'numero.required' => 'El número de diploma es obligatorio.',
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.regex' => 'El nombre solo debe contener letras y espacios.',
            'apellido.required' => 'El apellido es obligatorio.',
            'apellido.regex' => 'El apellido solo debe contener letras y espacios.',
            'carrera.required' => 'La carrera es obligatoria.',
            'carrera.regex' => 'La carrera solo debe contener letras y espacios.',
            'fecha_emision.required' => 'La fecha de emisión es obligatoria.',
            'fecha_nacimiento.required' => 'La fecha de nacimiento es obligatoria.',
            'fecha_nacimiento.before' => 'La fecha de nacimiento debe ser anterior a hoy.',
            'fecha_nacimiento.after_or_equal' => 'La fecha de nacimiento no puede ser anterior a 1920.',
            'fecha_nacimiento.before_or_equal' => 'Debe tener al menos 5 años de edad.',
            'ruta_temporal.required' => 'La ruta del archivo es obligatoria.',
            'tipoDocumentoId.exists' => 'El tipo de documento seleccionado no es válido.',
            'detalleDocumentoId.exists' => 'El detalle del documento seleccionado no es válido.',
        ]);

        if ($tipoDocumentoNombre === 'DIPLOMAS DE BACHILLER') {
            $validated['carrera'] = 'BACHILLER';
        }
        if ($validated['detalleDocumentoId'] == null) {
            $tipoDocumento = DB::table('tipo_documento')
                ->where('id', $validated['tipoDocumentoId'])
                ->first();
            Log::debug('Datos de tipo_documento:', (array) $tipoDocumento);
            Log::debug('nombre: ' . $tipoDocumento->Nombre_tipo);

            $detalle = DB::table('tipo_documento_detalle')
                ->where('Nombre', $tipoDocumento->Nombre_tipo)
                ->first();

            if ($detalle) {
                Log::debug('el id detalle es: ' . $detalle->id);
                $validated['detalleDocumentoId'] = $detalle->id;
            } else {
                Log::debug('No se encontró el detalle con ese nombre');
            }
        }

        $documento = new Documento();
        $documento->ruta_de_guardado = $validated['ruta_temporal'];
        $documento->tipo_documento_detalle_id = $validated['detalleDocumentoId']??null;
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
        $resolucion = Diploma::create([
            'numero_serie'=>$validated['numero'],
            'documento_id' => $documento->id,
            'carrera' => $validated['carrera'],
            'nombres'=> $validated['nombre'],
            'apellidos' => $validated['apellido'],
            'fecha_nacimiento'=>$validated['fecha_nacimiento'],
            'fecha_emision'=>$validated['fecha_emision']
        ]);
        return response()->json(['message' => 'Resolución guardada exitosamente', 'resolucion' => $resolucion], 201);
    }
}