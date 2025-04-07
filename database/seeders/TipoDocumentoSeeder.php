<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipoDocumentoSeeder extends Seeder
{
    public function run()
    {
        // Insertar los datos de tipo documento
        DB::table('tipo_documento')->insert([
            ['id' => 1, 'Nombre_tipo' => 'Resolución HCU', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'Nombre_tipo' => 'Diplomas Bachiller', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'Nombre_tipo' => 'Diplomas Academicos', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'Nombre_tipo' => 'Diplomas Profesionales', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 6, 'Nombre_tipo' => 'Resoluciones Rectorales', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 7, 'Nombre_tipo' => 'Anti-Autonomistas', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 8, 'Nombre_tipo' => 'Convenios', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 9, 'Nombre_tipo' => 'Consejeros', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 10, 'Nombre_tipo' => 'Autoridades', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}