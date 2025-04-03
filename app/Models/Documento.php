<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Documento extends Model
{
    use HasFactory;

    protected $table = 'documentos';

    protected $fillable = [
        'nombre_del_documento',
        'ruta_de_guardado',
        'tipo_documento_id',
        'lo_que_resuelve',
        'tipo_archivo',
        'gestion_',
        'usuario_id'
    ];
    protected $dates = ['deleted_at'];

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
    public function tipoDocumento()
    {
        return $this->belongsTo(TipoDocumento::class, 'tipo_documento_id');
    }

    public function textos()
    {
        return $this->hasMany(DocumentoTexto::class, 'documento_id');
    }
}