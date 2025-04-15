<?php

namespace Database\Seeders;

use App\Models\TipoDocumento;
use App\Models\TipoDocumentoDetalle;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TiposSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insertar datos en la tabla tipo_documento con mayúsculas
        $tipoDocumento = [
            'RESOLUCIÓN' => ['CONGRESO', 'AGDE', 'HCU', 'RECTORALES'],
            'DIPLOMAS DE BACHILLER' => ['HUMANIDADES', 'POR MADUREZ'],
            'DIPLOMAS DE POST GRADO' => ['DOCTORADOS', 'MAESTRÍA', 'ESPECIALIDADES', 'POST DOCTORADO'],
            'TÍTULOS PROFESIONALES' => ['TÍTULOS PROFESIONALES'],
            'TÍTULOS PROFESIONALES POR REVALIDACIÓN' => ['TÍTULOS PROFESIONALES POR REVALIDACIÓN'],
            'DIPLOMAS ACADÉMICOS' => ['DIPLOMAS ACADÉMICOS'],
            'CERTIFICADOS SUPLETORIO' => ['CERTIFICADOS SUPLETORIO'],
            'CONVENIO' => ['NACIONAL', 'INTERNACIONAL'],
            'AUTORIDADES' => ['AUTORIDADES'],
            'ANTI-AUTONOMISTAS' => ['ANTI-AUTONOMISTAS'],
        ];

        foreach ($tipoDocumento as $nombreTipo => $detalles) {
            // Crear el tipo de documento en mayúsculas
            $tipo = TipoDocumento::create([
                'Nombre_tipo' => $nombreTipo
            ]);

            // Insertar los detalles correspondientes a cada tipo de documento en mayúsculas
            foreach ($detalles as $detalle) {
                TipoDocumentoDetalle::create([
                    'tipo_documento_id' => $tipo->id,
                    'Nombre' => $detalle,
                ]);
            }
        }
    }
}
