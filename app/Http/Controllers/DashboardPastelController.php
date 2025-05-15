<?php

namespace App\Http\Controllers;

use App\Models\AntiAutonomista;
use App\Models\Autoridad;
use App\Models\Convenio;
use App\Models\Diploma;
use App\Models\Documento;
use App\Models\Resolucion;
use App\Models\TipoDocumento;
use App\Models\TipoDocumentoDetalle;
use Illuminate\Http\Request;

class DashboardPastelController extends Controller
{
    public function getDocumentStats()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_documentos' => Documento::count(),
                'documentos_por_tipo' => [
                    ['name' => 'Resoluciones', 'value' => Resolucion::count(), 'fill' => '#3b82f6'],
                    ['name' => 'Convenios', 'value' => Convenio::count(), 'fill' => '#10b981'],
                    ['name' => 'Diplomas', 'value' => Diploma::count(), 'fill' => '#f59e0b'],
                    ['name' => 'Autoridades', 'value' => Autoridad::count(), 'fill' => '#ef4444'],
                    ['name' => 'Anti Autonomistas', 'value' => AntiAutonomista::count(), 'fill' => '#8b5cf6'],
                ],
                'documentos_generales' => TipoDocumentoDetalle::withCount('documentos')
                    ->get()
                    ->map(function($tipo) {
                        return [
                            'name' => $tipo->Nombre,
                            'value' => $tipo->documentos_count,
                            'fill' => $this->getColorForType($tipo->Nombre)
                        ];
                    })
            ]
        ]);
    }

    private function getColorForType($typeName)
    {
        $colors = [
            'Memorandum' => '#6366f1',
            'Oficio' => '#ec4899',
            'Informe' => '#14b8a6',
            'Nota' => '#f97316',
            'Otros' => '#64748b'
        ];

        return $colors[$typeName] ?? '#94a3b8';
    }

    public function estadisticas()
    {
        // Obtener todos los tipos de documento con sus detalles
        $tiposDocumento = TipoDocumento::with(['detalles' => function($query) {
            $query->withCount('documentos');
        }])->get();

        // Preparar los datos para la respuesta
        $estadisticas = [
            'total_documentos' => Documento::count(),
            'tipos_documento' => []
        ];

        foreach ($tiposDocumento as $tipo) {
            $tipoData = [
                'nombre_tipo' => $tipo->Nombre_tipo,
                'total' => 0,
                'detalles' => []
            ];

            foreach ($tipo->detalles as $detalle) {
                $tipoData['detalles'][] = [
                    'nombre_detalle' => $detalle->Nombre,
                    'cantidad' => $detalle->documentos_count
                ];
                $tipoData['total'] += $detalle->documentos_count;
            }

            $estadisticas['tipos_documento'][] = $tipoData;
        }

        // Agregar estadísticas de modelos específicos
        $estadisticas['resoluciones'] = \App\Models\Resolucion::count();
        $estadisticas['anti_autonomistas'] = \App\Models\AntiAutonomista::count();
        $estadisticas['diplomas'] = \App\Models\Diploma::count();
        $estadisticas['autoridades'] = \App\Models\Autoridad::count();
        $estadisticas['convenios'] = \App\Models\Convenio::count();

        return response()->json($estadisticas);
    }
}