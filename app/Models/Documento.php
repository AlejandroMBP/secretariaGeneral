<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Documento extends Model
{
    use HasFactory, SoftDeletes, Searchable;

    protected $table = 'documentos';

    protected $fillable = [
        'ruta_de_guardado',
        'tipo_documento_detalle_id',
        'tipo_archivo',
        'gestion_',
        'usuario_id'
    ];

    protected $dates = ['deleted_at'];

    /** Relación con el usuario que subió el documento */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function tipoDocumentoDetalle()
    {
        return $this->belongsTo(TipoDocumentoDetalle::class, 'tipo_documento_detalle_id');
    }

    public function textos()
    {
        return $this->hasMany(DocumentoTexto::class, 'documento_id');
    }

    public function resolucion()
    {
        return $this->hasOne(Resolucion::class, 'documento_id');
    }

    public function convenio()
    {
        return $this->hasOne(Convenio::class, 'documento_id');
    }

    public function diploma()
    {
        return $this->hasOne(Diploma::class, 'documento_id');
    }

    public function antiAutonomista()
    {
        return $this->hasOne(AntiAutonomista::class, 'documento_id');
    }

    public function autoridad()
    {
        return $this->hasOne(Autoridad::class, 'documento_id');
    }
    public function shouldBeSearchable()
    {
        return true;
    }

    /** Devuelve el arreglo que se indexará en MeiliSearch
     *  indexado de campos segun el cargdo de tablas
    */
    public function toSearchableArray()
    {
        $this->loadMissing([
            'textos',
            'tipoDocumentoDetalle',
            'resolucion',
            'convenio',
            'diploma',
            'antiAutonomista',
            'autoridad',
        ]);
        $textoCompleto = $this->textos->pluck('texto')->implode(' ');
        $tipoDocumento = optional($this->tipoDocumentoDetalle)->Nombre;
        $data = [
            'tipo_documento' => $tipoDocumento,
            'texto' => $textoCompleto,
            'tipo_archivo' => $this->tipo_archivo,
            'usuario_id' => $this->usuario_id,
        ];
        if ($this->resolucion) {
            $data['numero_resolucion'] = $this->resolucion->numero_resolucion;
            $data['resolucion_nombre'] = $this->resolucion->nombre_del_documento;
            $data['resolucion_lo_que_resuelve'] = $this->resolucion->lo_que_resuelve;
            $data['gestion_resolucion'] = $this->resolucion->gestion;
            $data['derogacion_abrogacion'] = $this->resolucion->d_a_documento_id;
        }
        if ($this->convenio) {
            $data['convenio_titulo'] = $this->convenio->titulo;
            $data['fecha_inicio'] = $this->convenio->fecha_inicio;
            $data['fecha_fin'] = $this->convenio->fecha_fin;
            $data['adenda'] = $this->convenio->adenda;
        }
        if ($this->diploma) {
            $data['numero_serie'] = $this->diploma->numero_serie;
            $data['carrera'] = $this->diploma->carrera;
            $data['diploma_nombre'] = $this->diploma->nombres . ' ' . $this->diploma->apellidos;
            $data['fecha_nacimiento'] = $this->diploma->fecha_nacimiento;
            $data['fecha_emision'] = $this->diploma->fecha_emision;
        }
        if ($this->antiAutonomista) {
            $data['cedula_de_identidad'] = $this->antiAutonomista->ci;
            $data['anti_nombre'] = trim(optional($this->antiAutonomista)->nombres . ' ' . optional($this->antiAutonomista)->apellidos);
            $data['anti_tipo'] = $this->antiAutonomista->tipoPersona;
        }
        if ($this->autoridad) {
            $data['autoridad_nombre'] = $this->autoridad->nombres . ' ' . $this->autoridad->apellidos;
            $data['autoridad_tipo_posicio'] = $this->autoridad->tipo_posicio;
            $data['gestion'] = $this->autoridad->gestion;
            $data['celular'] = $this->autoridad->celular;
        }
        return $data;
    }
    public function getDatosIndexados()
    {
        return $this->toSearchableArray();
    }

}
