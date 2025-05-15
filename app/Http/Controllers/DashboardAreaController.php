<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardAreaController extends Controller
{
    public function documentActivity()
    {
        $range = request()->input('range', '90d');

        // Determinar el rango de fechas
        $endDate = Carbon::now();
        $startDate = clone $endDate;

        switch ($range) {
            case '7d':
                $startDate->subDays(7);
                break;
            case '30d':
                $startDate->subDays(30);
                break;
            default: // 90d
                $startDate->subDays(90);
                break;
        }

        // Consulta para obtener documentos por tipo y fecha
        $data = DB::table('documentos')
            ->join('tipo_documento_detalle', 'documentos.tipo_documento_detalle_id', '=', 'tipo_documento_detalle.id')
            ->select(
                DB::raw("DATE(documentos.created_at) as date"),
                'tipo_documento_detalle.Nombre as document_type',
                DB::raw('COUNT(*) as count')
            )
            ->whereBetween('documentos.created_at', [$startDate, $endDate])
            ->groupBy('date', 'document_type')
            ->orderBy('date')
            ->get();

        // Formatear los datos para el gráfico
        $formattedData = [];
        $dates = [];
        $types = [];

        // Primero obtener todos los tipos y fechas únicas
        foreach ($data as $item) {
            if (!in_array($item->date, $dates)) {
                $dates[] = $item->date;
            }
            if (!in_array($item->document_type, $types)) {
                $types[] = $item->document_type;
            }
        }

        // Crear estructura de datos para el gráfico
        foreach ($dates as $date) {
            $entry = ['date' => $date];
            foreach ($types as $type) {
                $entry[$type] = 0;
            }

            // Sumar los conteos por tipo
            foreach ($data as $item) {
                if ($item->date === $date) {
                    $entry[$item->document_type] = $item->count;
                }
            }

            $formattedData[] = $entry;
        }

        return response()->json([
            'data' => $formattedData,
            'types' => $types,
            'startDate' => $startDate->format('Y-m-d'),
            'endDate' => $endDate->format('Y-m-d')
        ]);
    }
}
