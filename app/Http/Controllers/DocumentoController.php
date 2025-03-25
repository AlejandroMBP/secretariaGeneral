<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\Documento;
use App\Models\DocumentoTexto;
use Smalot\PdfParser\Parser;
// use Spatie\PdfToImage\Pdf;
// use thiagoalessio\TesseractOCR\TesseractOCR;
use Illuminate\Support\Facades\Auth;
use thiagoalessio\TesseractOCR\TesseractOCR;

class DocumentoController extends Controller
{
    public function index()
    {
        return Inertia::render('Documentos/index');
    }
    public function cargar(Request $request)
    {
        if ($request->hasFile('file')) {
            $file = $request->file('file');

            // Guardar archivo en storage/app/public/documentos
            $ruta = $file->store('documentos', 'public');

            // Guardar en la base de datos
            $documento = Documento::create([
                'nombre' => $file->getClientOriginalName(),
                'ruta' => $ruta,
                'tipo' => $file->getClientOriginalExtension(),
                'usuario_id' => Auth::id(),
            ]);

            // Intentar extraer texto con Smalot PDF Parser
            $parser = new Parser();
            $pdf = $parser->parseFile(storage_path("app/public/$ruta"));
            $textoExtraido = trim($pdf->getText());

            // Si el PDF tiene texto, lo guardamos
            if (!empty($textoExtraido)) {
                DocumentoTexto::create([
                    'documento_id' => $documento->id,
                    'texto' => $textoExtraido,
                ]);
            } else {
                // Si el PDF no tiene texto, usar OCR
                $textoOCR = $this->extraerTextoOCR($ruta);

                // Verificamos si la extracción fue exitosa antes de insertar en la base de datos
                if (!empty($textoOCR)) {
                    DocumentoTexto::create([
                        'documento_id' => $documento->id,
                        'texto' => $textoOCR,
                    ]);
                } else {
                    Log::error('No se pudo extraer texto del PDF ni con OCR.');
                    return response()->json(['error' => 'No se pudo extraer texto del PDF'], 500);
                }
            }

            return response()->json([
                'mensaje' => 'Archivo guardado y texto extraído correctamente.',
                // 'ruta' => asset("storage/$ruta"),
            ]);
        }

        return response()->json(['error' => 'No se recibió ningún archivo.'], 400);
    }


    private function extraerTextoOCR($rutaArchivo)
    {
        $rutaCompletaPdf = storage_path('app/public/' . $rutaArchivo); // Debería ser así

        if (!file_exists($rutaCompletaPdf)) {
            Log::error("El archivo PDF no existe en: " . $rutaCompletaPdf);
            return ''; // Retorna un string vacío en lugar de una respuesta JSON
        }

        // Directorio donde guardaremos las imágenes
        $directorioImagenes = public_path('pdf_images');
        if (!file_exists($directorioImagenes)) {
            mkdir($directorioImagenes, 0777, true);
        }

        try {
            // Usando Ghostscript para convertir el PDF a imágenes en Windows
            $gsPath = '"C:\Program Files\gs\gs10.05.0\bin\gswin64c.exe"';
            $cmd = "$gsPath -sDEVICE=pngalpha -sOutputFile=$directorioImagenes/pagina.png -r400x400 $rutaCompletaPdf";

            // Ejecutamos el comando de Ghostscript
            $output = null;
            $resultCode = null;
            exec($cmd, $output, $resultCode);

            if ($resultCode !== 0) {
                Log::error('Error al ejecutar Ghostscript: ' . implode("\n", $output));
                return ''; // Retorna un string vacío en caso de error
            }

            // Ahora, extraemos el texto con Tesseract
            $textoExtraido = "";
            // Aquí, asumiendo que Ghostscript ha generado las imágenes correctamente
            foreach (glob("$directorioImagenes/pagina*.png") as $nombreImagen) {
                // Extraer texto con Tesseract
                $tesseract = new TesseractOCR($nombreImagen);
                $tesseract->lang('spa');
                $tesseract->tessdataDir('C:\Program Files\Tesseract-OCR\tessdata');
                $tesseract->executable('C:\Program Files\Tesseract-OCR\tesseract.exe');

                $textoExtraido .= $tesseract->run() . "\n\n"; // Concatenar texto de cada página
            }

            Log::debug("Texto extraído del PDF: " . $textoExtraido);

            // Retornar el texto extraído para que pueda ser insertado en la base de datos
            return $textoExtraido;
        } catch (\Exception $e) {
            Log::error('Error procesando el PDF: ' . $e->getMessage());
            return ''; // Retorna un string vacío en caso de error
        }
    }


    public function imagenOCR()
    {
        $rutaImagen = public_path('image/image.png');

        if (!file_exists($rutaImagen)) {
            Log::error("La imagen no existe en: " . $rutaImagen);
            return response()->json(['error' => 'La imagen no existe en la ruta especificada'], 404);
        }

        try {
            $texto = (new TesseractOCR($rutaImagen))
                ->lang('spa')
                ->tessdataDir('C:\Program Files\Tesseract-OCR\tessdata')
                ->executable('C:\Program Files\Tesseract-OCR\tesseract.exe')
                ->run();

            Log::debug('Texto extraído: ' . $texto);
        } catch (\Exception $e) {
            Log::error('Error en Tesseract: ' . $e->getMessage());
        }
    }
}
