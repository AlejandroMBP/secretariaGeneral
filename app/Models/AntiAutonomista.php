<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AntiAutonomista extends Model
{
    use SoftDeletes;

    protected $table = 'anti_autonomistas';

    protected $fillable = [
        'persona', 'nombres', 'apellidos', 'tipoPersona', 'documento_id', 'ci'
    ];

    public function documento()
    {
        return $this->belongsTo(Documento::class);
    }

}
