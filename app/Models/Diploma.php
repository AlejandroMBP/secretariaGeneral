<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Diploma extends Model
{
    use SoftDeletes;

    protected $table = 'Diplomas';

    protected $fillable = [
        'numero_serie',
        'documento_id',
        'carrera',
        'nombres',
        'apellidos',
        'fecha_nacimiento',
        'fecha_emision'
    ];

    public function tipoDocumento()
    {
        return $this->belongsTo(TipoDocumento::class);
    }

    public function documento()
    {
        return $this->belongsTo(Documento::class);
    }
}