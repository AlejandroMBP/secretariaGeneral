<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tipo_documento', function (Blueprint $table) {
            $table->id();
            $table->string('Nombre_tipo');
            $table->softDeletes();
            $table->timestamps();
        });
        Schema::create('tipo_documento_detalle',function(Blueprint $table){
            $table->id();
            $table->unsignedBigInteger('tipo_documento_id')->nullable();
            $table->string('Nombre');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('tipo_documento_id')->references('id')->on('tipo_documento')->onDelete('cascade');
        });

        Schema::create('documentos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_del_documento');
            $table->string('ruta_de_guardado')->nullable();
            $table->unsignedBigInteger('tipo_documento_detalle_id')->nullable();
            $table->string('lo_que_resuelve');
            $table->string('tipo_archivo');
            $table->string('gestion_')->nullable();
            $table->unsignedBigInteger('usuario_id')->nullable();
            $table->timestamps();
            $table->softDeletes(); // Agrega la columna deleted_at
            $table->foreign('usuario_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('tipo_documento_detalle_id')->references('id')->on('tipo_documento_detalle')->onDelete('cascade');
        });
        Schema::create('documentos_textos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('documento_id');
            $table->text('texto');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('documento_id')->references('id')->on('documentos')->onDelete('cascade');
        });
        Schema::create('resoluciones', function(Blueprint $table){
            $table->id();
            $table->integer('numero_resolucion');
            $table->string('nombre_del_documento');
            $table->string('lo_que_resuelve');
            $table->string('gestion')->nullable();
            $table->unsignedBigInteger('documento_id');
            $table->unsignedBigInteger('d_a_documento_id')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('documento_id')->references('id')->on('documentos')->onDelete('cascade');
            $table->foreign('d_a_documento_id')->references('id')->on('documentos')->onDelete('cascade');
        });
        Schema::create('anti_autonomistas',function(Blueprint $table){
            $table->id();
            $table->string('persona');
            $table->string('nombres');
            $table->string('apellidos');
            $table->enum('tipoPersona', ['Docente','Estudiante','Administrativo']);
            $table->unsignedBigInteger('documento_id');
            $table->string('ci');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('documento_id')->references('id')->on('documentos')->onDelete('cascade');
        });
        Schema::create('Diplomas',function(Blueprint $table){
            $table->id();
            $table->string('numero_serie');
            $table->unsignedBigInteger('documento_id')->nullable();
            $table->string('carrera');
            $table->string('nombres');
            $table->string('apellidos');
            $table->date('fecha_nacimiento');
            $table->date('fecha_emision');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('documento_id')->references('id')->on('documentos')->onDelete('cascade');
        });
        Schema::create('Autoridades',function(Blueprint $table){
            $table->id();
            $table->string('persona');
            $table->string('nombres');
            $table->string('apellidos');
            $table->unsignedBigInteger('documento_id')->nullable();
            $table->enum('tipo_posicio', ['HCU','AGDE','CONGRESO']);
            $table->string('gestion');
            $table->string('celular');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('documento_id')->references('id')->on('documentos')->onDelete('cascade');
        });
        Schema::create('convenios',function(Blueprint $table){
            $table->id();
            $table->string('titulo');
            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->date('adenda')->nullable();
            $table->unsignedBigInteger('documento_id');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('documento_id')->references('id')->on('documentos')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('convenios');
        Schema::dropIfExists('Autoridades');
        Schema::dropIfExists('Diplomas');
        Schema::dropIfExists('anti_autonomistas');
        Schema::dropIfExists('resoluciones');
        Schema::dropIfExists('documentos_textos');
        Schema::dropIfExists('documentos');
        Schema::dropIfExists('tipo_documento_detalle');
        Schema::dropIfExists('tipo_documento');
    }


};