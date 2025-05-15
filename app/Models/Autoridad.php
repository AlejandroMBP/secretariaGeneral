<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Autoridad extends Model
{
    use SoftDeletes;

    protected $table = 'Autoridades';

    protected $fillable = [
        'persona',
        'nombres',
        'apellidos',
        'documento_id',
        'tipo_posicio',
        'gestion',
        'celular'
    ];
    public static $tipoPosicion = [
        'HCU',
        'AGDE',
        'CONGRESO'
    ];
    public function documento()
    {
        return $this->belongsTo(Documento::class);
    }
}
