<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Resolucion extends Model
{
    use SoftDeletes,Searchable;

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
    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'nombre_del_documento' => $this->nombre_del_documento,
            'lo_que_resuelve' => $this->lo_que_resuelve,
            'gestion' => $this->gestion,
            'texto_contenido' => $this->documento->textos->first()->texto ?? '',
        ];
    }
}
