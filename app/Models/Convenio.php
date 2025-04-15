<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Convenio extends Model
{
    use SoftDeletes;

    protected $table = 'convenios';

    protected $fillable = [
        'titulo',
        'fecha_inicio',
        'fecha_fin',
        'adenda',
        'documento_id',
    ];

    protected $dates = [
        'fecha_inicio',
        'fecha_fin',
        'adenda',
        'deleted_at',
    ];

    // Relación con el modelo Documento
    public function documento()
    {
        return $this->belongsTo(Documento::class, 'documento_id');
    }
}
