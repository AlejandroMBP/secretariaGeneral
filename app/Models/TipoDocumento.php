<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoDocumento extends Model
{
    protected $table = 'tipo_documento';
    protected $fillable = ['nombre_tipo'];
    protected $date = ['delete_at'];
    public function documentos()
    {
        return $this->hasMany(Documento::class, 'tipo_documento_id');
    }
}
