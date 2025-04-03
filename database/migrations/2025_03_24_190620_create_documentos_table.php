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
            $table->softDeletes(); // Agrega la columna deleted_at
            $table->timestamps();
        });

        Schema::create('documentos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_del_documento');
            $table->string('ruta_de_guardado')->nullable();
            $table->unsignedBigInteger('tipo_documento_id')->nullable();
            $table->string('lo_que_resuelve');
            $table->string('tipo_archivo');
            $table->string('gestion_')->nullable();
            $table->unsignedBigInteger('usuario_id')->nullable();
            $table->timestamps();
            $table->softDeletes(); // Agrega la columna deleted_at
            $table->foreign('usuario_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('tipo_documento_id')->references('id')->on('tipo_documento')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documentos');
        Schema::dropIfExists('tipo_documento');
    }
};