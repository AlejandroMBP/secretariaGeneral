import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('/node_modules/pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

interface PDFViewerModalProps {
    fileUrl: string | null;
    onClose: () => void;
}

const PDFViewerModal: React.FC<PDFViewerModalProps> = ({ fileUrl, onClose }) => {
    const [numPages, setNumPages] = React.useState<number>(0);
    const [pageNumber, setPageNumber] = React.useState<number>(1);
    const [error, setError] = React.useState<string | null>(null);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const goToPreviousPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    const goToNextPage = () => {
        if (pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    if (!fileUrl) return null;

    return (
        <div className="bg-opacity-50 fixed inset-0 z-40 flex items-center justify-center bg-black/50">
            <button
                onClick={onClose}
                className="bg-red absolute top-4 right-4 cursor-pointer border-none text-3xl text-white transition duration-200 hover:text-gray-700"
            >
                <X className="h-10 w-10" />{' '}
            </button>
            <div className="relative w-full max-w-2xl items-center rounded-lg bg-transparent">
                {/* Mostrar el PDF como imágenes */}
                <div className="relative mb-4 flex h-full w-full items-center justify-center">
                    <Document
                        file={fileUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={(err) => setError(err.message)}
                        className="w-max-xl h-full"
                    >
                        {/* Añadir transición de opacidad */}
                        <div
                            className="transition-opacity duration-1000 ease-in-out"
                            style={{
                                opacity: pageNumber === 0 ? 0 : 1,
                            }}
                        >
                            <Page
                                key={pageNumber} // Cambiar la clave cuando cambie la página
                                pageNumber={pageNumber}
                                scale={1.0}
                                renderMode="canvas"
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                className="mx-auto mb-4 h-auto max-h-[80vh] w-full rounded-lg shadow-lg"
                            />
                        </div>
                    </Document>
                </div>

                {/* Mensaje de Error */}
                {error && <div className="mb-4 text-red-500">{error}</div>}

                {/* Contador de Páginas */}
                <div className="flex justify-center text-lg">
                    Página {pageNumber} de {numPages}
                </div>
                <button onClick={goToPreviousPage} disabled={pageNumber <= 1} className="absolute top-1/2 left-1 -translate-y-1/2 transform">
                    <ChevronLeft className="h-10 w-10 text-gray-500 hover:text-blue-500 disabled:text-gray-400 dark:hover:text-blue-400" />
                </button>

                <button onClick={goToNextPage} disabled={pageNumber >= numPages} className="absolute top-1/2 right-1 -translate-y-1/2 transform">
                    <ChevronRight className="h-10 w-10 text-gray-500 hover:text-blue-500 disabled:text-gray-400 dark:hover:text-blue-400" />
                </button>
            </div>
        </div>
    );
};

export default PDFViewerModal;
