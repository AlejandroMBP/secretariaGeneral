<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentoTexto extends Model
{
    use HasFactory;

    protected $table = 'documentos_textos';

    protected $fillable = [
        'documento_id',
        'texto',
    ];

    /**
     * Relación con el documento al que pertenece el texto extraído.
     */
    public function documento()
    {
        return $this->belongsTo(Documento::class, 'documento_id');
    }
}
