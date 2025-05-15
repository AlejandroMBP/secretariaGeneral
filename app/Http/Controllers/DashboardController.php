<?php

namespace App\Http\Controllers;

use App\Models\Documento;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function monthlyActivity()
    {
        // Datos mensuales
        $monthlyData = DB::table('documentos')
            ->select(
                DB::raw("DATE_FORMAT(created_at, '%M') as month"),
                DB::raw('COUNT(*) as total')
            )
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->orderBy(DB::raw("MONTH(created_at)"))
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $this->translateMonth($item->month),
                    'total' => $item->total
                ];
            });

        // Datos semanales
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        $weeklyTotal = DB::table('documentos')
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->count();

        return response()->json([
            'monthlyData' => $monthlyData,
            'weeklyTotal' => $weeklyTotal,
            'weekRange' => $startOfWeek->format('d/m') . ' - ' . $endOfWeek->format('d/m')
        ]);
    }

    private function translateMonth($month)
    {
        $months = [
            'Enero' => 'Enero',
            'Febrero' => 'Febrero',
            'Marzo' => 'Marzo',
            'Abril' => 'Abril',
            'Mayo' => 'Mayo',
            'Junio' => 'Junio',
            'Julio' => 'Julio',
            'Agosto' => 'Agosto',
            'Septiembre' => 'Septiembre',
            'Octubre' => 'Octubre',
            'Noviembre' => 'Noviembre',
            'Diciembre' => 'Diciembre'
        ];

        return $months[$month] ?? $month;
    }
}