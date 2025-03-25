<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Documento extends Model
{
    use HasFactory;

    protected $table = 'documentos';

    protected $fillable = [
        'nombre',
        'ruta',
        'tipo',
        'usuario_id',
    ];

    /**
     * Relación con el usuario que subió el documento.
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    /**
     * Relación con los textos extraídos del documento.
     */
    public function textos()
    {
        return $this->hasMany(DocumentoTexto::class, 'documento_id');
    }
}
