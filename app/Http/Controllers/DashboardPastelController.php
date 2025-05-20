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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardPastelController extends Controller
{
    public function index()
    { $resultados = DB::table('documentos')
        ->join('tipo_documento_detalle', 'documentos.tipo_documento_detalle_id', '=', 'tipo_documento_detalle.id')
        ->join('tipo_documento', 'tipo_documento_detalle.tipo_documento_id', '=', 'tipo_documento.id')
        ->select(
            'tipo_documento.Nombre_tipo as tipo',
            DB::raw('COUNT(documentos.id) as cantidad'),
            DB::raw('MAX(documentos.created_at) as ultima_fecha_carga')
        )
        ->groupBy('tipo_documento.Nombre_tipo')
        ->get()
        ->map(function ($item) {
            $color = 'hsl(' . rand(0, 360) . ', ' . rand(60, 100) . '%, ' . rand(40, 60) . '%)';

            return [
                'tipo' => $item->tipo,
                'cantidad' => $item->cantidad,
                'ultima_fecha_carga' => $item->ultima_fecha_carga,
                'color' => $color,
            ];
        });

    Log::debug($resultados);

    return response()->json($resultados);
    }

    public function monthlyVisits()
    {
        $visits = DB::table('system_logs')
            ->select(
                DB::raw('MONTHNAME(created_at) as month'),
                DB::raw('COUNT(*) as visits'),
                DB::raw('SEC_TO_TIME(AVG(TIME_TO_SEC(duration))) as avg_duration'),
                DB::raw('COUNT(DISTINCT user_id) as unique_visitors')
            )
            ->where('action', 'login')
            ->whereYear('created_at', now()->year)
            ->groupBy(DB::raw('MONTH(created_at)'), DB::raw('MONTHNAME(created_at)'))
            ->orderBy(DB::raw('MONTH(created_at)'))
            ->get();

        return response()->json(
            $visits->map(function ($item) {
                return [
                    'month' => $item->month,
                    'visits' => (int)$item->visits,
                    'avgDuration' => $item->avg_duration,
                    'uniqueVisitors' => (int)$item->unique_visitors
                ];
            })
        );
    }
}
