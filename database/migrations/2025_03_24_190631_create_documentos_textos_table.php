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
        Schema::create('documentos_textos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('documento_id');  // Relación con el archivo PDF
            $table->text('texto');  // El texto extraído del documento
            $table->timestamps();
            $table->foreign('documento_id')->references('id')->on('documentos')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documentos_textos');
    }
};
