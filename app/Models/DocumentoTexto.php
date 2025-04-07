<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DocumentoTexto extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'documentos_textos';

    protected $fillable = [
        'documento_id',
        'texto',
    ];
    protected $dates = ['deleted_at'];
    /**
     * Relación con el documento al que pertenece el texto extraído.
     */
    public function documento()
    {
        return $this->belongsTo(Documento::class, 'documento_id');
    }
}
