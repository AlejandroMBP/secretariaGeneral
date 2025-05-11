<?php

namespace App\Http\Controllers;

use App\Models\AntiAutonomista;
use App\Models\Diploma;
use App\Models\Resolucion;
use Illuminate\Http\Request;
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
                'id' => $resolucion->id,
                'numero_resolucion' => $resolucion->numero_resolucion,
                'display_text' => $resolucion->numero_resolucion . ' - ' .
                                ($resolucion->documento->tipoDocumentoDetalle->Nombre ?? 'Sin tipo')
            ];
        });

    Log::debug($resoluciones);

    return response()->json([
        'success' => true,
        'data' => $resoluciones
    ]);
}
}
