<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TipoDocumentoDetalle extends Model
{
    use SoftDeletes;

    protected $table = 'tipo_documento_detalle';

    protected $fillable = ['tipo_documento_id', 'Nombre'];

    public function tipoDocumento()
    {
        return $this->belongsTo(TipoDocumento::class);
    }
}
