import { cn } from '@/lib/utils';
import { UploadCloud, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const PdfUploader = ({ onUpload, reset }: { onUpload: (file: File) => void; reset: boolean }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [error, setError] = useState<string>(''); // Estado para mostrar errores

    useEffect(() => {
        if (reset) {
            setFile(null); // Resetear el archivo cuando la propiedad `reset` cambie
        }
    }, [reset]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.name.toLowerCase().endsWith('.pdf')) {
                setFile(selectedFile);
                onUpload(selectedFile);
                setError('');
            } else {
                setError('Por favor, sube un archivo PDF válido.');
                setFile(null);
            }
        }
    };

    const removeFile = () => {
        setFile(null);
        setError('');
    };

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsDragging(false);
        const droppedFile = event.dataTransfer.files?.[0];
        if (droppedFile) {
            if (droppedFile.name.toLowerCase().endsWith('.pdf')) {
                setFile(droppedFile);
                onUpload(droppedFile);
                setError('');
            } else {
                setError('Por favor, sube un archivo PDF válido.');
                setFile(null);
            }
        }
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    return (
        <div>
            <label
                htmlFor="pdf-upload"
                className={cn(
                    'hover:border-primary flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 p-6 transition hover:bg-gray-400/50 dark:hover:bg-gray-950/80',
                    file ? 'border-green-500' : '',
                    isDragging ? 'border-blue-500 bg-blue-100/50 dark:border-blue-700 dark:bg-blue-800/60' : '',
                )}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragLeave={handleDragLeave}
            >
                {!file && <UploadCloud className="mb-2 h-20 w-10 text-gray-500" />}
                {file ? (
                    <div className="animate-fadeIn w-full rounded-md border border-gray-300 bg-gray-50 p-4 opacity-100 shadow-md transition-opacity duration-500 dark:border-gray-600 dark:bg-gray-800/80">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700 dark:text-gray-200">
                            <p className="truncate">{file.name}</p>
                            <p className="text-right">
                                <strong className="rounded-md bg-cyan-300 px-2 py-0.5 dark:bg-cyan-700">{(file.size / 1024).toFixed(2)} KB</strong>
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{file.type}</p>
                            <p className="text-right text-sm text-gray-600 dark:text-gray-400">{new Date(file.lastModified).toLocaleDateString()}</p>
                        </div>
                        <p className="mt-2 text-center text-lg text-green-500">¡Archivo cargado y listo para subir!</p>
                    </div>
                ) : (
                    <span className="text-lg text-gray-600 dark:text-gray-300">Arrastra o selecciona un archivo PDF</span>
                )}
            </label>

            <input id="pdf-upload" type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
            {file && (
                <div className="mt-4 flex justify-center">
                    <div className="flex w-full max-w-sm items-center justify-between rounded-md bg-white p-3 shadow-md dark:bg-gray-800">
                        <span className="max-w-[200px] truncate text-base font-medium text-gray-700 dark:text-gray-300">Quitar: {file.name}</span>
                        <button
                            onClick={removeFile}
                            className="rounded-full p-1 text-red-500 transition-all hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-800"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            {error && <p className="mt-2 text-center text-red-500">{error}</p>}
        </div>
    );
};

export default PdfUploader;
