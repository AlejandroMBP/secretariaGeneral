<?php

namespace App\Http\Controllers;

use App\Models\AntiAutonomista;
use App\Models\Autoridad;
use App\Models\Documento;
use Illuminate\Auth\Events\Validated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AutoridadesController extends Controller
{
    public function listar()
    {
        $autoridades = Autoridad::with([
            'documento.textos:id,documento_id,texto',
            'documento.tipoDocumentoDetalle.tipoDocumento'
        ])

        ->select('id', 'persona', 'nombres', 'apellidos', 'tipo_posicio', 'gestion','celular', 'documento_id')
        ->latest()
        ->get()
        ->map(function ($autoridad) {
            return [
                'id'                => $autoridad->id,
                'persona'           => $autoridad->persona,
                'nombreCompleto'    => $autoridad->nombres. ' ' . $autoridad->apellidos,
                'nombres'           => $autoridad->nombres,
                'apellidos'         => $autoridad->apellidos,
                'tipo_posicion'     => $autoridad->tipo_posicio,
                'gestion'           => $autoridad->gestion,
                'documento_id'      => $autoridad->documento->tipoDocumentoDetalle->Nombre ?? 'No definido',
                'ruta_de_guardado'  => $autoridad->documento->ruta_de_guardado ?? null,
                'celular'           => $autoridad->celular,
            ];
        });

        return Inertia::render('Autoridades/Listar', [
            'documentos' => $autoridades
        ]);
    }
    public function FAutoridades(){

    }
    public function store (Request $request){
        $validatedData = $request->validate([
            'nombre' => 'required|string|regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/|max:255',
            'apellido' => 'required|string|regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/|max:255',
            'numeroRes' => 'required|integer|exists:documentos,id',
            'posicion'=> 'required|string|in:'.implode(',', Autoridad::$tipoPosicion),
            'celular' => 'required|numeric|digits_between:7,15',
            'gestion' => 'required|numeric|digits:4|date_format:Y|min:2000|max:'.(date('Y')+5)
        ], [
            'nombre.regex' => 'El nombre solo debe contener letras y espacios.',
            'apellido.regex' => 'El apellido solo debe contener letras y espacios.',
            'numeroRes.exists' => 'El número de resolución no existe en nuestros registros.',
            'posicion.in' => 'La posición especificada no es válida.',
            'celular.numeric' => 'El celular debe contener solo números.',
            'celular.digits_between' => 'El celular debe tener entre 7 y 15 dígitos.',
            'gestion.digits' => 'La gestión debe tener exactamente 4 dígitos.',
            'gestion.date_format' => 'La gestión debe ser un año válido.',
            'gestion.min' => 'La gestión no puede ser menor a 2000.',
            'gestion.max' => 'La gestión no puede ser mayor a '.(date('Y')+5).'.'
        ]);

        $autoridad = Autoridad::create([
            'persona' => 0,
            'nombres' => $validatedData['nombre'],
            'apellidos' => $validatedData['apellido'],
            'documento_id' => $validatedData['numeroRes'],
            'tipo_posicio' => strtolower($validatedData['posicion']),
            'gestion' => $validatedData['gestion'],
            'celular' => $validatedData['celular'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Registro creado satisfactoriamente',
            'data' => $autoridad
        ], 201);

    }
    public function update(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            // Validación de datos
            $validated = $request->validate([
                'nombres' => 'required|string|regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/|max:255',
                'apellidos' => 'required|string|regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/|max:255',
                'tipo_posicion' => 'required|string|in:'.implode(',', Autoridad::$tipoPosicion),
                'gestion' => 'required|numeric|digits:4|date_format:Y|min:2000|max:'.(date('Y')+5),
                'celular' => 'required|numeric|digits_between:7,15'
            ], [
                'nombres.required' => 'El nombre es obligatorio',
                'nombres.regex' => 'El nombre solo debe contener letras y espacios',
                'apellidos.required' => 'El apellido es obligatorio',
                'apellidos.regex' => 'El apellido solo debe contener letras y espacios',
                'tipo_posicion.required' => 'La posición es obligatoria',
                'tipo_posicion.in' => 'La posición especificada no es válida',
                'gestion.required' => 'La gestión es obligatoria',
                'gestion.digits' => 'La gestión debe tener exactamente 4 dígitos',
                'gestion.date_format' => 'La gestión debe ser un año válido',
                'gestion.min' => 'La gestión no puede ser menor a 2000',
                'gestion.max' => 'La gestión no puede ser mayor a '.(date('Y')+5),
                'celular.required' => 'El celular es obligatorio',
                'celular.numeric' => 'El celular debe contener solo números',
                'celular.digits_between' => 'El celular debe tener entre 7 y 15 dígitos'
            ]);

            // Buscar la autoridad a actualizar
            $autoridad = Autoridad::findOrFail($id);

            // Actualizar los datos
            $autoridad->update([
                'nombres' => $validated['nombres'],
                'apellidos' => $validated['apellidos'],
                'tipo_posicio' => strtolower($validated['tipo_posicion']),
                'gestion' => $validated['gestion'],
                'celular' => $validated['celular']
            ]);

            // Si el documento relacionado cambió, actualizar indexación
            if ($autoridad->wasChanged('documento_id') && $autoridad->documento) {
                $autoridad->documento->searchable();
                // Log::info("Documento reindexado: {$autoridad->documento->id}");
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Autoridad actualizada correctamente',
                'data' => $autoridad->fresh(['documento.textos', 'documento.tipoDocumentoDetalle'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error al actualizar Autoridad ID {$id}: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la autoridad',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
