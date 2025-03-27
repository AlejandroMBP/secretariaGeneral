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

            if (!empty($textoExtraido)) {
                DocumentoTexto::create([
                    'documento_id' => $documento->id,
                    'texto' => $textoExtraido,
                ]);
            } else {
                // Si el PDF no tiene texto, usar OCR
                $textoOCR = $this->extraerTextoOCR($ruta);

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
            ]);
        }

        return response()->json(['error' => 'No se recibió ningún archivo.'], 400);
    }


    private function extraerTextoOCR($rutaArchivo)
{
    $rutaCompletaPdf = storage_path('app/public/' . $rutaArchivo);

    if (!file_exists($rutaCompletaPdf)) {
        Log::error("El archivo PDF no existe en: " . $rutaCompletaPdf);
        return '';
    }

    // Directorio donde guardaremos las imágenes
    $directorioImagenes = public_path('pdf_images');
    if (!file_exists($directorioImagenes)) {
        mkdir($directorioImagenes, 0777, true);
    }

    try {
        $textoExtraido = "";
        $output = null;
        $resultCode = null;

        if (PHP_OS_FAMILY === 'Windows') {
            // Configuración para Windows
            $gsPath = '"C:\Program Files\gs\gs10.05.0\bin\gswin64c.exe"';
            $tesseractPath = 'C:\Program Files\Tesseract-OCR\tesseract.exe';
            $tessdataPath = 'C:\Program Files\Tesseract-OCR\tessdata';

            $cmd = "$gsPath -sDEVICE=pngalpha -sOutputFile=$directorioImagenes/pagina%d.png -r400x400 $rutaCompletaPdf";
        } else {
            // Configuración para Linux (Debian 12)
            $gsPath = 'gs';
            $tesseractPath = 'tesseract';

            $cmd = "$gsPath -sDEVICE=pngalpha -o $directorioImagenes/pagina%d.png -r400x400 $rutaCompletaPdf";
        }

        // Ejecutamos Ghostscript
        exec($cmd, $output, $resultCode);
        if ($resultCode !== 0) {
            Log::error('Error al ejecutar Ghostscript: ' . implode("\n", $output));
            return '';
        }

        // Extraer texto con Tesseract OCR
        foreach (glob("$directorioImagenes/pagina*.png") as $nombreImagen) {
            $tesseract = new TesseractOCR($nombreImagen);
            $tesseract->lang('spa');

            if (PHP_OS_FAMILY === 'Windows') {
                $tesseract->tessdataDir($tessdataPath);
                $tesseract->executable($tesseractPath);
            }

            $textoExtraido .= $tesseract->run() . "\n\n";
        }

        Log::debug("Texto extraído del PDF: " . $textoExtraido);

        return $textoExtraido;
    } catch (\Exception $e) {
        Log::error('Error procesando el PDF: ' . $e->getMessage());
        return '';
    }
}


// esta funcion se puede usar para cuando queramos cargar imagenes directamente
// no esta en uso
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
    public function listar()
    {
        $documentos = Documento::with('usuario')->latest()->get();

        return Inertia::render('Documentos/Listar', [
            'documentos' => $documentos
        ]);
    }
}

