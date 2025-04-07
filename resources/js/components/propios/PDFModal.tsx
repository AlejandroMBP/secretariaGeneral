import { ChevronLeft, ChevronRight, Loader2, X, ZoomIn, ZoomOut } from 'lucide-react';
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('/node_modules/pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

interface PDFViewerModalProps {
    fileUrl: string | null;
    onClose: () => void;
}

const PDFViewerModal: React.FC<PDFViewerModalProps> = ({ fileUrl, onClose }) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [scale, setScale] = useState<number>(1); // Estado para el nivel de zoom

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const goToPreviousPage = () => {
        if (pageNumber > 1) {
            setLoading(true);
            setPageNumber((prev) => prev - 1);
        }
    };

    const goToNextPage = () => {
        if (pageNumber < numPages) {
            setLoading(true);
            setPageNumber((prev) => prev + 1);
        }
    };

    const handlePageLoad = () => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    // Función para aumentar el zoom
    const zoomIn = () => {
        setScale((prevScale) => Math.min(prevScale + 0.25, 1.5)); // Limitar el zoom máximo a 3x
    };

    // Función para reducir el zoom
    const zoomOut = () => {
        setScale((prevScale) => Math.max(prevScale - 0.25, 0.5)); // Limitar el zoom mínimo a 0.5x
    };

    if (!fileUrl) return null;

    return (
        <div className="bg-opacity-50 fixed inset-0 z-40 flex items-center justify-center bg-black/50">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 cursor-pointer border-none text-3xl text-white transition duration-200 hover:text-gray-700"
            >
                <X className="h-10 w-10" />
            </button>
            <button
                onClick={zoomIn}
                className="absolute top-4 right-20 cursor-pointer border-none text-3xl text-white transition duration-200 hover:text-gray-700"
            >
                <ZoomIn className="h-10 w-10" />
            </button>
            <button
                onClick={zoomOut}
                className="absolute top-4 right-30 cursor-pointer border-none text-3xl text-white transition duration-200 hover:text-gray-700"
            >
                <ZoomOut className="h-10 w-10" />
            </button>
            <div className="relative w-full max-w-3xl items-center rounded-lg bg-transparent">
                <div className="relative flex w-full justify-center overflow-auto">
                    {' '}
                    {/* Agregado overflow-auto */}
                    <Document
                        file={fileUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={(err) => setError(err.message)}
                        className="h-min-h-full w-full max-w-xl"
                    >
                        <div className="relative flex w-full items-center justify-center">
                            {/* Indicador de carga */}
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/80 transition-opacity duration-700">
                                    <Loader2 className="h-14 w-14 animate-spin text-blue-500" />
                                </div>
                            )}

                            <Page
                                key={pageNumber}
                                pageNumber={pageNumber}
                                scale={scale} // Aplicar el nivel de zoom al renderizar la página
                                renderMode="canvas"
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                className="mx-auto rounded-lg shadow-lg transition-opacity duration-700 ease-in-out"
                                onRenderSuccess={handlePageLoad}
                            />
                        </div>
                    </Document>
                </div>

                {error && <div className="mb-4 text-center text-red-500">{error}</div>}

                <div className="mt-2 flex justify-center text-white dark:text-lg">
                    Página {pageNumber} de {numPages}
                </div>

                {/* Botones de navegación */}
                <button onClick={goToPreviousPage} disabled={pageNumber <= 1} className="absolute top-1/2 left-2 -translate-y-1/2 transform">
                    <ChevronLeft className="h-10 w-10 text-gray-500 hover:text-blue-500 disabled:text-gray-400" />
                </button>

                <button onClick={goToNextPage} disabled={pageNumber >= numPages} className="absolute top-1/2 right-2 -translate-y-1/2 transform">
                    <ChevronRight className="h-10 w-10 text-gray-500 hover:text-blue-500 disabled:text-gray-400" />
                </button>
            </div>
        </div>
    );
};

export default PDFViewerModal;
