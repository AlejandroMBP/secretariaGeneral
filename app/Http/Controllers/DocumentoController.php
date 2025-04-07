<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\Documento;
use App\Models\DocumentoTexto;
use App\Models\TipoDocumento;
use Smalot\PdfParser\Parser;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use thiagoalessio\TesseractOCR\TesseractOCR;
use Intervention\Image\Facades\Image;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;
use setasign\Fpdi\Fpdi;
use App\Services\FPDIWithRotate; // Usamos nuestra clase personalizada FPDI con Rotate
use function Psy\debug;

class DocumentoController extends Controller
{
    public function index()
    {
        $tipoDocumentos = TipoDocumento::all();
        return Inertia::render('Documentos/index',[
            'tipoDocumentos' => $tipoDocumentos,]);
    }

    public function guardar(Request $request)
    {
        Log::debug('Datos que llegan: ', $request->all());
        $request->merge([
        'usarOCR' => filter_var($request->usarOCR, FILTER_VALIDATE_BOOLEAN),
        ]);
        $request->validate([
            'titulo' => [
                'required',
                'string',
                'max:255',
                'regex:/^[A-Za-z0-9áéíóúÁÉÍÓÚñÑ ,.;!?()]+$/'
            ],
            'descripcion' => [
                'required',
                'string',
                'regex:/^[A-Za-z0-9áéíóúÁÉÍÓÚñÑ ,.;!?()]+$/'
                ],
            'categoria' => 'required|exists:tipo_documento,id',
            'fecha' => [
                'required',
                'date',
                'after_or_equal:2000-01-01',
                'before_or_equal:' . now()->toDateString(),
                ],
            'ruta_temporal' => 'required|string',
            'usarOCR' => 'required|boolean',
            'texto_extraido' => 'nullable|string',
            ], [
            'titulo.required' => 'El título del documento es obligatorio.',
            'titulo.string' => 'El título debe ser un texto.',
            'titulo.max' => 'El título no puede superar los 255 caracteres.',
            'titulo.regex' => 'El título solo puede contener letras, números, acentos, comas, puntos, y otros caracteres especiales como !, ?, (), etc.',

            'descripcion.required' => 'La descripción del documento es obligatoria.',
            'descripcion.string' => 'La descripción debe ser un texto.',
            'descripcion.regex' => 'La descripción solo puede contener letras, números, acentos, comas, puntos, y otros caracteres especiales como !, ?, (), etc.',

            'categoria.required' => 'La categoría del documento es obligatoria.',
            'categoria.exists' => 'La categoría seleccionada no es válida.',

            'fecha.required' => 'La fecha es obligatoria.',
            'fecha.date' => 'La fecha debe ser válida.',
            'fecha.after_or_equal' => 'La fecha no puede ser anterior al 1 de enero de 2000.',
            'fecha.before_or_equal' => 'La fecha no puede ser posterior a la fecha actual.',

            'ruta_temporal.required' => 'La ruta del archivo es obligatoria.',
            'ruta_temporal.string' => 'La ruta del archivo debe ser un texto.',

            'usarOCR.required' => 'Debe indicar si desea usar OCR.',
            'usarOCR.boolean' => 'El valor de OCR debe ser verdadero o falso.',

            'texto_extraido.string' => 'El texto extraído debe ser un texto válido.',
        ]);

        Log::debug('Datos validados:', $request->all());
        try {
               // Guardar el documento
            $documento = new Documento();
            $documento->nombre_del_documento = $request->titulo;
            $documento->ruta_de_guardado = $request->ruta_temporal;
            $documento->tipo_documento_id = $request->categoria;
            $documento->lo_que_resuelve = $request->descripcion;
            $documento->tipo_archivo = 'pdf'; // Asegúrate de asignar el tipo de archivo correcto
            $documento->gestion_ = $request->fecha; // Aquí pon el valor que corresponda
            $documento->usuario_id = Auth::id(); // O el ID del usuario actual
            $documento->save();
               // Guardar el texto extraído en la tabla documentos_textos
            if ($request->texto_extraido) {
                DocumentoTexto::create([
                    'documento_id' => $documento->id,
                    'texto' => $request->texto_extraido,
                ]);
            }
            return response()->json(['message' => 'Documento guardado exitosamente'], 200);
        } catch (\Exception $e) {
            Log::error('Error al guardar el documento: ', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al guardar el documento'], 500);
        }
    }

    public function preprocesarArchivo(Request $request)
    {
        Log::debug('Archivo recibido para preprocesamiento: ', $request->all());

        if (!$request->hasFile('archivo')) {
            return response()->json(['error' => 'No se recibió ningún archivo.'], 400);
        }

        $file = $request->file('archivo');
        $rutaTemporal = $file->store('documentos_temporales', 'public');
        $rutaCompletaPdf = storage_path("app/public/$rutaTemporal");

        try {
            $parser = new Parser();
            $pdf = $parser->parseFile(storage_path("app/public/$rutaTemporal"));
            $textoExtraido = trim($pdf->getText());

            if (strlen($textoExtraido) < 5) {
                Log::info("Texto insuficiente con Smalot, usando OCR con Tesseract.");
                $textoOCR = $this->extraerTextoOCR($rutaTemporal);
                $textoCorregido = $this->corregirTextoHunspell($textoOCR);

                // $exactitudOCR = $this->calcularCalidadOCR($textoOCR, $textoCorregido);
                // $eficienciaOCR = $this->estimarEficienciaOCR($textoOCR, $rutaCompletaPdf);
                // $exactitudFinal = ($exactitudOCR + $eficienciaOCR) / 2;

                $falloOCR = $this->calcularFalloOCR($textoOCR, $textoCorregido);
                $falloEficiencia = $this->estimarFalloOCR($textoOCR, $rutaCompletaPdf);
                $falloFinal = ($falloOCR + $falloEficiencia) / 2;
                return response()->json([
                    'mensaje' => 'Texto extraído con OCR.',
                    'metodo_usado' => 'OCR (Tesseract)',
                    'texto_extraido' => $textoOCR,
                    'porcentaje_fallo' => round($falloFinal, 2) . '%',
                    'ruta_temporal' => $rutaTemporal,
                ]);
            }

            // $exactitudSmalot = strlen($textoExtraido) > 0 ? 100 : 0;
            $falloSmalot = 0;
            return response()->json([
                'mensaje' => 'Texto extraído con Smalot/PdfParser.',
                'metodo_usado' => 'Smalot/PdfParser',
                'texto_extraido' => $textoExtraido,
                'porcentaje_fallo' => round($falloSmalot, 2) . '%',
                'ruta_temporal' => $rutaTemporal,
            ]);
        } catch (\Exception $e) {
            Log::error('Error procesando el archivo: ' . $e->getMessage());
            return response()->json(['error' => 'Error interno al procesar el archivo.'], 500);
        }
    }

    private function extraerTextoOCR($rutaArchivo)
    {
        $rutaCompletaPdf = storage_path('app/public/' . $rutaArchivo);

        if (!file_exists($rutaCompletaPdf)) {
            Log::error("El archivo PDF no existe en: " . $rutaCompletaPdf);
            return '';
        }

        $directorioImagenes = public_path('pdf_images');
        if (!file_exists($directorioImagenes)) {
            mkdir($directorioImagenes, 0777, true);
        }

        try {
            // Convertir PDF a imágenes con Ghostscript
            $this->convertirPdfAImagenes($rutaCompletaPdf, $directorioImagenes);

            // Extraer texto de imágenes con OCR
            $textoExtraido = $this->procesarImagenesOCR($directorioImagenes);

            //Aplicar correccion ortografica con huspell
            $textoCorregido = $this->corregirTextoHunspell($textoExtraido);

            // Limpiar imágenes después del procesamiento
            $this->limpiarImagenesTemporales($directorioImagenes);

            return $textoExtraido;
        } catch (\Exception $e) {
            Log::error('Error procesando el PDF: ' . $e->getMessage());
            return '';
        }
    }

    private function convertirPdfAImagenes($rutaPdf, $directorioImagenes)
    {
        $output = null;
        $resultCode = null;

        $gsPath = PHP_OS_FAMILY === 'Windows' ? '"C:\\Program Files\\gs\\gs10.05.0\\bin\\gswin64c.exe"' : 'gs';

        // Convertir PDF a imágenes TIFF con compresión CCITT Group 4 (ideal para OCR)
        $cmd = "$gsPath -sDEVICE=tiffg4 -o $directorioImagenes/pagina%d.tiff -r600x600 $rutaPdf";

        exec($cmd, $output, $resultCode);
        if ($resultCode !== 0) {
            throw new \Exception('Error al ejecutar Ghostscript: ' . implode("\n", $output));
        }
    }

    private function procesarImagenesOCR($directorioImagenes)
    {
        $textoExtraido = "";

        foreach (glob("$directorioImagenes/pagina*.tiff") as $nombreImagen) {
            $tesseract = new TesseractOCR($nombreImagen);
            $tesseract->lang('spa');

            if (PHP_OS_FAMILY === 'Windows') {
                $tesseract->tessdataDir('C:\\Program Files\\Tesseract-OCR\\tessdata');
                $tesseract->executable('C:\\Program Files\\Tesseract-OCR\\tesseract.exe');
            }

            $textoExtraido .= $tesseract->run() . "\n\n";
        }

        return $textoExtraido;
    }

    private function mejorarImagenOCR($nombreImagen)
    {
        $output = null;
        $resultCode = null;
        $cmdImageMagick = "convert $nombreImagen -sharpen 0x1 -resize 1024x1024 -quality 90 $nombreImagen";

        exec($cmdImageMagick, $output, $resultCode);
        if ($resultCode !== 0) {
            Log::error("Error al limpiar imagen con ImageMagick: " . implode("\n", $output));
        }
    }

    private function limpiarImagenesTemporales($directorioImagenes)
    {
        foreach (glob("$directorioImagenes/pagina*.png") as $nombreImagen) {
            unlink($nombreImagen);
        }
    }
    private function corregirTextoHunspell($texto)
    {
        $diccionario = '/usr/share/hunspell/es_ES.dic'; // Asegúrate de tener el diccionario instalado
        $archivoTemporal = tempnam(sys_get_temp_dir(), 'hunspell');

        file_put_contents($archivoTemporal, $texto);

        // Ejecutar Hunspell
        $cmd = "hunspell -d es_ES -a < $archivoTemporal";
        exec($cmd, $output, $resultCode);

        unlink($archivoTemporal);

        if ($resultCode !== 0) {
            Log::error("Error en Hunspell: " . implode("\n", $output));
            return $texto; // Si falla, devolvemos el texto sin corrección
        }

        // Procesar la salida de Hunspell
        $textoCorregido = "";
        foreach ($output as $linea) {
            if (!empty($linea) && $linea[0] !== '&' && $linea[0] !== '#') {
                $textoCorregido .= $linea . "\n";
            }
        }

        return trim($textoCorregido);
    }
    private function calcularCalidadOCR($textoAntes, $textoDespues)
    {
        $palabrasAntes = str_word_count($textoAntes);
        $palabrasDespues = str_word_count($textoDespues);
        $corregidas = abs($palabrasAntes - $palabrasDespues);

        if ($palabrasAntes == 0) return 0;

        $calidad = (1 - ($corregidas / $palabrasAntes)) * 100;
        return max(0, $calidad);
    }

    private function estimarEficienciaOCR($textoExtraido, $rutaPdf)
    {
        $caracteresExtraidos = strlen($textoExtraido);
        $tamanioPdf = filesize($rutaPdf);
        $estimacionCaracteres = $tamanioPdf / 2;

        $eficiencia = ($caracteresExtraidos / $estimacionCaracteres) * 100;
        return min(100, max(0, $eficiencia));
    }

    private function calcularFalloOCR($textoExtraido, $textoCorregido)
    {
        $palabrasAntes = str_word_count($textoExtraido);
        $palabrasDespues = str_word_count($textoCorregido);
        $corregidas = abs($palabrasAntes - $palabrasDespues);

        if ($palabrasAntes == 0) return 100; // Fallo total si no hay palabras.

        $exactitud = (1 - ($corregidas / $palabrasAntes)) * 100;
        $fallo = 100 - max(0, $exactitud); // Convertimos exactitud en fallo.

        return round($fallo, 2);
    }

    private function estimarFalloOCR($textoExtraido, $rutaPdf)
    {
        $caracteresExtraidos = strlen($textoExtraido);
        $tamanioPdf = filesize($rutaPdf);
        $estimacionCaracteres = $tamanioPdf / 2;

        $eficiencia = ($caracteresExtraidos / $estimacionCaracteres) * 100;
        $fallo = 100 - min(100, max(0, $eficiencia));

        return round($fallo, 2);
    }
    public function agregarMarcaDeAgua(Request $request)
    {
        $ruta = $request->input('ruta'); // Ruta del PDF original
        $archivo = storage_path("app/public/{$ruta}");

        if (!file_exists($archivo)) {
            return response()->json(['error' => 'El archivo no existe.'], 404);
        }
        $pdf = new FPDIWithRotate();
        $pageCount = $pdf->setSourceFile($archivo);
        for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
            $templateId = $pdf->importPage($pageNo);
            $pdf->addPage();
            $pdf->useTemplate($templateId);
            $pdf->SetFont('Arial', 'B', 60);
            $pdf->SetTextColor(195, 195, 195);
            $pdf->SetAlpha(0.5,'NORMAL');
            $pdf->Rotate(55, 150, 220);
            $pdf->Text(60, 150, 'DOCUMENTO SIN VALOR');
        }
        $outputPath = storage_path("app/public/pdf_images/ver/") . "documento_con_marca_de_agua.pdf";
        $pdf->Output('F', $outputPath);
        return response()->json(['url' => Storage::url('pdf_images/ver/documento_con_marca_de_agua.pdf')]);
    }

    public function listar()
    {
        $documentos = Documento::with('usuario','textos')->latest()->get();
        return Inertia::render('Documentos/Listar', [
            'documentos' => $documentos
        ]);
    }
    public function editarDocumento(Request $request){
        Log::debug('lo que se esta editando: ',$request->all());
        $validated = $request->validate([
            'texto' => 'nullable|string',
            'id' => 'required|exists:documentos,id',
            'id_textos' => 'required|exists:documentos_textos,id',
            'nombre_del_documento' => 'required|string|max:255',
            'lo_que_resuelve' => 'required|nullable|string',
            'gestion_' => [
                'required',
                'date',
                'after_or_equal:2000-01-01',
                'before_or_equal:' . now()->toDateString(),
            ],
        ], [
            'id.required' => 'El ID del documento es obligatorio.',
            'id.exists' => 'El documento seleccionado no existe.',
            'id_textos.required' => 'El ID del texto es obligatorio.',
            'id_textos.exists' => 'El texto relacionado no existe en la base de datos.',
            'nombre_del_documento.required' => 'El nombre del documento es obligatorio.',
            'nombre_del_documento.string' => 'El nombre del documento debe ser una cadena de texto.',
            'nombre_del_documento.max' => 'El nombre del documento no debe exceder los 255 caracteres.',
            'lo_que_resuelve.string' => 'El campo "Lo que resuelve" debe ser una cadena de texto.',
            'lo_que_resuelve.required' => 'La descripción de lo que resuelve es necesaria.',
            'gestion_.required' => 'El campo gestión es obligatorio.',
            'gestion_.date' => 'El campo gestión debe ser una fecha válida.',
            'gestion_.after_or_equal' => 'La gestión no puede ser anterior al año 2000.',
            'gestion_.before_or_equal' => 'La gestión no puede ser una fecha futura.',
            'texto.string' => 'El campo texto debe ser una cadena de texto.',
        ]);

        try {
            $documento = Documento::findOrFail($validated['id']);
            $documento->update([
                'nombre_del_documento' => $validated['nombre_del_documento'],
                'lo_que_resuelve' => $validated['lo_que_resuelve'] ?? null,
                'gestion_' => $validated['gestion_'],
            ]);
            $texto = DocumentoTexto::findOrFail($validated['id_textos']);
            if ($request->has('textos') && isset($request->textos[0]['texto'])) {
                $texto->update([
                    'texto' => $request->textos[0]['texto'],
                ]);
            }
            return response()->json([
                'success' => true,
                'message' => 'Documento actualizado correctamente.',
                'documento' => $documento,
                'texto' => $texto,
            ]);
        } catch (\Exception $e) {
            Log::error('Error al actualizar documento o texto: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar los datos.',
            ], 500);
        }
    }

    public function eliminar($id){
        Log::debug('valores para eliminacion:'.$id);

        $documento = Documento::find($id);
        if (!$documento) {
            return response()->json(['message'=>'Documento no encontrado.'],404);
        }
        $documento->delete();
        return response()->json(['message'=>'Documento eliminado correctamente']);
    }
}