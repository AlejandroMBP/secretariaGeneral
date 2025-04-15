<?php

namespace App\Http\Controllers;

use App\Models\Documento;
use App\Models\DocumentoTexto;
use App\Models\Resolucion;
use App\Models\TipoDocumento;
use App\Models\TipoDocumentoDetalle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ArchivosController extends Controller
{
    public function index()
    {
        $tipoDocumentos = TipoDocumento::all();
        return Inertia::render('Archivos/index',[
            'tipoDocumentos' => $tipoDocumentos,]);
    }
    public function FResoluciones()
{
    $tipoDocumentos = TipoDocumento::with('detalles')
    ->where('nombre_tipo', 'Resolución')
    ->get();

return Inertia::render('Formularios/Resoluciones', [
    'tipoDocumento' => $tipoDocumentos,
]);

}
    public function resoluciones_guardar(Request $request){
        Log::debug("datos recividos",$request->all());
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'numero' => 'required|integer',
            'fecha' => 'required|date',
            'ruta_temporal' => 'required|string',
            'detalleDocumentoId' => 'required|exists:tipo_documento_detalle,id',
            'texto_extraido' => 'nullable|string',
        ]);
        // $detalle = TipoDocumentoDetalle::findOrFail($request->detalleDocumentoId);
        // $tipoDocumentoId = $detalle->tipo_documento_id;

        $documento = new Documento();
        $documento->nombre_del_documento = $request->titulo;
        $documento->ruta_de_guardado = $request->ruta_temporal;
        $documento->tipo_documento_detalle_id = $request->detalleDocumentoId;
        $documento->lo_que_resuelve = 'quitar';
        $documento->tipo_archivo = 'pdf'; // Asegúrate de asignar el tipo de archivo correcto
        $documento->gestion_ = now(); // Aquí pon el valor que corresponda
        $documento->usuario_id = Auth::id(); // O el ID del usuario actual
        $documento->save();
           // Guardar el texto extraído en la tabla documentos_textos
        if ($request->texto_extraido) {
            DocumentoTexto::create([
                'documento_id' => $documento->id,
                'texto' => $request->texto_extraido,
            ]);
        }
        // Ahora insertamos en la tabla resoluciones (suponiendo que tienes esta tabla)
        $resolucion = Resolucion::create([
            'nombre_del_documento' => $validated['titulo'],
            'lo_que_resuelve' => $validated['descripcion'],
            'numero_resolucion' => $validated['numero'],
            'gestion' => $validated['fecha'],
            'documento_id' => $documento->id,
        ]);

        return response()->json(['message' => 'Resolución guardada exitosamente', 'resolucion' => $resolucion], 201);
    }
}
