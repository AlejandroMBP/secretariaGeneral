<?php

namespace App\Http\Controllers;

use App\Models\AntiAutonomista;
use App\Models\Diploma;
use App\Models\Documento;
use App\Models\Resolucion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AntiAutonomistasController extends Controller
{
    public function listar()
    {
        $diplomas = AntiAutonomista::with([
            'documento.textos:id,documento_id,texto',
            'documento.tipoDocumentoDetalle.tipoDocumento'
        ])

        ->select('id', 'persona', 'nombres', 'apellidos', 'tipoPersona', 'ci', 'documento_id')
        ->latest()
        ->get()
        ->map(function ($anti) {
            return [
                'id'                => $anti->id,
                'persona'           => $anti->persona,
                'nombreCompleto'    => $anti->nombres. ' ' . $anti->apellidos,
                'nombres'           => $anti->nombres,
                'apellidos'         => $anti->apellidos,
                'tipoPersona'       => $anti->tipoPersona,
                'ci'                => $anti->ci,
                'documento_id'      => $anti->documento->tipoDocumentoDetalle->Nombre ?? 'No definido',
                'ruta_de_guardado'  => $anti->documento->ruta_de_guardado ?? null,
                'textos_id'         => $anti->documento->textos->pluck('id')->toArray(),
            ];
        });

        // Log::debug($diplomas->toArray());
        return Inertia::render('AntiAutonomistas/Listar', [
            'documentos' => $diplomas
        ]);
    }
    public function buscarResolucion(Request $request)
{
    $search = $request->input('search', '');

    $resoluciones = Resolucion::with(['documento.tipoDocumentoDetalle']) // Cargar la relación
        ->select(['id', 'numero_resolucion', 'documento_id'])
        ->when($search, function($q) use ($search) {
            return $q->where('numero_resolucion', 'like', "%{$search}%");
        })
        ->limit(10)
        ->get()
        ->map(function ($resolucion) {
            return [
                'id' => $resolucion->documento_id,
                'numero_resolucion' => $resolucion->numero_resolucion,
                'display_text' => $resolucion->numero_resolucion . ' - ' .
                                ($resolucion->documento->tipoDocumentoDetalle->Nombre ?? 'Sin tipo')
            ];
        });
    // Log::debug($resoluciones);
    return response()->json([
        'success' => true,
        'data' => $resoluciones
    ]);
}
    public function store(Request $request)
    {
        Log::debug($request->all());
        try {
            $mensajesPersonalizados = [
                'nombre.required' => 'Debe ingresar el nombre',
                'nombre.string' => 'El nombre debe ser texto',
                'apellido.required' => 'Debe ingresar el apellido',
                'apellido.string' => 'El apellido debe ser texto',
                'ci.required' => 'Debe ingresar el número de carnet',
                'ci.string' => 'El carnet debe ser texto',
                'numeroRes.required' => 'Debe seleccionar una resolución',
                'numeroRes.integer' => 'La resolución debe ser un número',
                'numeroRes.exists' => 'La resolución seleccionada no existe',
                'persona.required' => 'Debe seleccionar el tipo de persona',
                'persona.string' => 'El tipo de persona debe ser texto',
                'persona.in' => 'El tipo de persona seleccionado no es válido',
            ];

            $validacion = $request->validate([
                'nombre' => 'required|string',
                'apellido' => 'required|string',
                'ci' => 'required|string',
                'numeroRes' => 'required|integer|exists:documentos,id',
                'persona' => 'required|string|in:'.implode(',', AntiAutonomista::$tiposPersona),
            ], $mensajesPersonalizados);
            DB::beginTransaction();
            $antiAutonomista = AntiAutonomista::create([
                'nombres' => $validacion['nombre'],
                'apellidos' => $validacion['apellido'],
                'ci' => $validacion['ci'],
                'tipoPersona' => strtolower($validacion['persona']),
                'documento_id' => $validacion['numeroRes'],
                'persona' => 0,
            ]);
            $documento = Documento::with(['textos', 'antiAutonomista'])->find($validacion['numeroRes']);

            if ($documento && method_exists($documento, 'searchable')) {
                $documento->searchable();
                Log::info("Documento indexado: {$documento->id}");
            }
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Registro creado satisfactoriamente',
                'data' => $antiAutonomista
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el registro: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function update(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            // Validación de datos
            $validated = $request->validate([
                'nombres' => 'required|string|max:255',
                'apellidos' => 'required|string|max:255',
                'tipoPersona' => 'required|string|in:'.implode(',', AntiAutonomista::$tiposPersona),
                'ci' => 'required|string|max:20',
            ], [
                'nombres.required' => 'El nombre es obligatorio',
                'apellidos.required' => 'El apellido es obligatorio',
                'tipoPersona.required' => 'El tipo de persona es obligatorio',
                'ci.required' => 'El número de carnet es obligatorio',
            ]);

            // Buscar el registro a actualizar
            $antiAutonomista = AntiAutonomista::findOrFail($id);

            // Actualizar los datos
            $antiAutonomista->update([
                'nombres' => $validated['nombres'],
                'apellidos' => $validated['apellidos'],
                'tipoPersona' => strtolower($validated['tipoPersona']),
                'ci' => $validated['ci'],
            ]);

            // Si el documento relacionado cambió, actualizar indexación
            if ($antiAutonomista->wasChanged('documento_id') && $antiAutonomista->documento) {
                $antiAutonomista->documento->searchable();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Registro actualizado correctamente',
                'data' => $antiAutonomista->fresh(['documento.textos'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error al actualizar AntiAutonomista ID {$id}: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el registro',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}