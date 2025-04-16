<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\Documento;
use App\Models\DocumentoTexto;
use App\Models\Resolucion;
use App\Models\TipoDocumento;
use App\Models\TipoDocumentoDetalle;
use Smalot\PdfParser\Parser;
use Illuminate\Support\Facades\Storage;
use thiagoalessio\TesseractOCR\TesseractOCR;
use setasign\Fpdi\Fpdi;
use App\Services\FPDIWithRotate; // Usamos nuestra clase personalizada FPDI con Rotate
use Illuminate\Support\Facades\Auth;

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

        // Validación de tipo de archivo
        if (strtolower($file->getClientOriginalExtension()) !== 'pdf') {
            return response()->json(['error' => 'El archivo debe ser un PDF.'], 400);
        }

        // Guardar archivo temporal con nombre único
        $nombreArchivo = uniqid('pdf_') . '.' . $file->getClientOriginalExtension();
        $rutaTemporal = $file->storeAs('documentos_temporales', $nombreArchivo, 'public');
        $rutaCompletaPdf = storage_path("app/public/$rutaTemporal");

        try {
            // Extraer texto con Smalot PDF Parser
            $parser = new Parser();
            $pdf = $parser->parseFile($rutaCompletaPdf);
            $textoExtraido = trim($pdf->getText());

            // Si no se extrajo texto suficiente, usar OCR
            if (strlen($textoExtraido) < 5) {
                Log::info("Texto insuficiente con Smalot, usando OCR con Tesseract.");

                try {
                    $textoOCR = $this->extraerTextoOCR($rutaCompletaPdf);

                    Log::debug('Texto OCR corregido: ' . $textoOCR);

                    return response()->json([
                        'mensaje' => 'Texto extraído con OCR.',
                        'metodo_usado' => 'OCR (Tesseract)',
                        'texto_extraido' => $textoOCR,
                        'ruta_temporal' => $rutaTemporal,
                    ]);
                } catch (\Exception $e) {
                    Log::error("Error durante OCR con Tesseract: " . $e->getMessage());
                    return response()->json(['error' => 'Error al procesar con OCR.'], 500);
                }
            }

            return response()->json([
                'mensaje' => 'Texto extraído con Smalot/PdfParser.',
                'metodo_usado' => 'Smalot/PdfParser',
                'texto_extraido' => $textoExtraido,
                'ruta_temporal' => $rutaTemporal,
            ]);
        } catch (\Exception $e) {
            Log::error('Error procesando el archivo: ' . $e->getMessage());
            return response()->json(['error' => 'Error interno al procesar el archivo.'], 500);
        }
    }
    private function extraerTextoOCR($rutaArchivo)
    {
        // $rutaCompletaPdf = storage_path('app/public/' . $rutaArchivo);
        $rutaCompletaPdf = $rutaArchivo;

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

            // $this->mejorarImagenesBlancoYNegro($directorioImagenes); // <- Aquí


            // Extraer texto de imágenes con OCR
            $textoExtraido = $this->procesarImagenesOCR($directorioImagenes);

            //Aplicar correccion ortografica con huspell
            $textoCorregido = $this->corregirTextoHunspell($textoExtraido);
        // Log::debug('corregido: '. $textoCorregido);
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
        // $cmd = "$gsPath -sDEVICE=tiffg4 -o $directorioImagenes/pagina%d.tiff -r600x600 $rutaPdf";
        $cmd = "$gsPath -sDEVICE=pnggray -o $directorioImagenes/pagina%d.png -r300 $rutaPdf";

        exec($cmd, $output, $resultCode);
        if ($resultCode !== 0) {
            throw new \Exception('Error al ejecutar Ghostscript: ' . implode("\n", $output));
        }
    }

    private function procesarImagenesOCR($directorioImagenes)
    {
        $textoExtraido = "";

        // foreach (glob("$directorioImagenes/pagina*.tiff") as $nombreImagen) {
            foreach (glob("$directorioImagenes/pagina*.png") as $nombreImagen) {

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

    private function limpiarImagenesTemporales($directorioImagenes)
    {
        foreach (glob("$directorioImagenes/pagina*.png") as $nombreImagen) {
            unlink($nombreImagen);
        }
    }
    private function corregirTextoHunspell($texto)
    {
        $archivoTemporal = tempnam(sys_get_temp_dir(), 'hunspell');
        file_put_contents($archivoTemporal, $texto);

        $cmd = "hunspell -d es_ES -a < " . escapeshellarg($archivoTemporal);
        exec($cmd, $output, $resultCode);
        unlink($archivoTemporal);

        if ($resultCode !== 0) {
            Log::error("Error en Hunspell: " . implode("\n", $output));
            return $texto;
        }

        $palabras = preg_split('/\s+/', $texto);
        $corregidas = [];
        $i = 0;

        foreach ($output as $linea) {
            // Saltar la línea de encabezado
            if (trim($linea) === '' || $linea[0] === '@') {
                continue;
            }

            // No hay error ortográfico
            if ($linea[0] === '*') {
                $corregidas[] = $palabras[$i];
            }
            // Hay sugerencias
            elseif ($linea[0] === '&') {
                // Ejemplo: & incorecto 1 0: incorrecto
                $partes = explode(':', $linea, 2);
                $sugerencias = isset($partes[1]) ? explode(', ', trim($partes[1])) : [];
                $corregidas[] = $sugerencias[0] ?? $palabras[$i]; // usar la primera sugerencia si hay
            }
            // No hay sugerencias (desconocida)
            else {
                $corregidas[] = $palabras[$i];
            }

            $i++;
        }

        return implode(' ', $corregidas);
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
        $documentos = Resolucion::with([
            'documento.tipoDocumentoDetalle:id,Nombre',
            'documento.textos:id,documento_id,texto'
        ])
        ->select('id', 'numero_resolucion', 'nombre_del_documento', 'lo_que_resuelve', 'gestion', 'documento_id','d_a_documento_id')
        ->latest()
        ->get()
        ->map(function ($resolucion) {
            return [
                'numero_resolucion'     => $resolucion->numero_resolucion,
                'nombre_del_documento'  => $resolucion->nombre_del_documento,
                'lo_que_resuelve'       => $resolucion->lo_que_resuelve,
                'gestion'               => $resolucion->gestion,
                'ruta_de_guardado'      => $resolucion->documento->ruta_de_guardado ?? null,
                'tipo_documento'        => $resolucion->documento->tipoDocumentoDetalle->Nombre ?? null,
                'documento_id'          => $resolucion->documento_id,
                'textos_id'             => $resolucion->documento->textos->pluck('id')->toArray(),

            ];
        });

        return Inertia::render('Documentos/Listar', [
            'documentos' => $documentos
        ]);
    }
    public function editarDocumento(Request $request)
    {
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
            $documento = Resolucion::findOrFail($validated['id']);
            $documento->update([
                'nombre_del_documento' => $validated['nombre_del_documento'],
                'lo_que_resuelve' => $validated['lo_que_resuelve'] ?? null,
                'gestion' => $validated['gestion_'],
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

    public function eliminar($id)
    {
        Log::debug('valores para eliminacion:'.$id);

        $documento = Documento::find($id);
        if (!$documento) {
            return response()->json(['message'=>'Documento no encontrado.'],404);
        }
        $documento->delete();
        return response()->json(['message'=>'Documento eliminado correctamente']);
    }

    public function buscar(Request $request)
    {
        $query = Documento::search($request->search ?? '')
            ->query(function ($q) use ($request) {
                // Relaciones necesarias
                $q->with(['usuario', 'tipoDocumentoDetalle', 'textos']);

                // Filtro por tipo
                if ($request->filled('tipo')) {
                    $q->whereHas('tipoDocumentoDetalle', function ($subQ) use ($request) {
                        $subQ->where('Nombre', $request->tipo);
                    });
                }

                // Filtro por gestión
                if ($request->filled('gestion')) {
                    $q->where('gestion_', $request->gestion);
                }
            });

        $documentos = $query->get()->map(function ($doc) {
            $texto = $doc->textos->first()?->texto ?? 'Sin texto';
            $tipo = $doc->tipoDocumentoDetalle?->Nombre ?? 'N/A';
            $usuario = $doc->usuario?->name ?? 'N/A';

            // Asegurarse de que la ruta esté en el path público accesible
            $rutaWeb = asset("storage/{$doc->ruta_de_guardado}");

            return [
                'id' => $doc->id,
                'nombre' => $texto,
                'tipo' => $tipo,
                'gestion' => $doc->gestion_,
                'usuario' => ['name' => $usuario],
                'ruta' => $rutaWeb,
                'created_at' => $doc->created_at->format('Y-m-d'),
            ];
        });

        // Datos únicos para los selectores de filtro
        $tipos = TipoDocumentoDetalle::pluck('Nombre')->unique()->values();
        $gestiones = Documento::pluck('gestion_')->unique()->sortDesc()->values();

        return inertia('BuscadorSemantico/BuscadorDocumentos', compact('documentos', 'tipos', 'gestiones'));
    }


}
