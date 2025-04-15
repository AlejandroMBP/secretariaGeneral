<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Resolucion extends Model
{
    use SoftDeletes;

    protected $table = 'resoluciones';

    protected $fillable = [
        'numero_resolucion',
        'nombre_del_documento',
        'lo_que_resuelve',
        'gestion',
        'documento_id',
        'd_a_documento_id'
    ];

    public function documento()
    {
        return $this->belongsTo(Documento::class, 'documento_id');
    }

    public function documentoAlternativo()
    {
        return $this->belongsTo(Documento::class, 'd_a_documento_id');
    }
}
