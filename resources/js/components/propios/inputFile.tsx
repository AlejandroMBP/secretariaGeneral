import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { FileText, UploadCloud } from 'lucide-react';
import nProgress from 'nprogress';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import CustomAlert from '../CustomAlert';

interface PdfUploadProps {
    onFileChange?: (file: File | null) => void;
}

export function PdfUpload({ onFileChange }: PdfUploadProps) {
    const { control, setValue, watch } = useForm();
    const [fileName, setFileName] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const selectedFile = watch('pdf');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setFileName(file.name);
            setValue('pdf', file);
            onFileChange?.(file);
        } else {
            setFileName(null);
            setValue('pdf', null);
            onFileChange?.(null);
            setAlert({ message: 'Solo se permiten archivos PDF.', type: 'error' });
        }
    };

    const handleUpload = useCallback(async () => {
        if (!selectedFile) {
            setAlert({ message: 'Por favor, selecciona un archivo PDF.', type: 'error' });
            return;
        }

        setIsUploading(true);
        nProgress.start();

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await axios.post('/cargar-pdf', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setAlert({ message: response.data.mensaje || 'Archivo subido correctamente.', type: 'success' });

            // Limpiar el input y el estado después de la carga exitosa
            setFileName(null);
            setValue('pdf', null);
            onFileChange?.(null);
        } catch (error) {
            setAlert({ message: 'Error al subir el archivo. Intenta nuevamente.', type: 'error' });
        } finally {
            setIsUploading(false);
            nProgress.done();
        }
    }, [selectedFile, setValue, onFileChange]);

    // Manejo de eventos de drag y drop
    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files?.[0];
        if (file && file.type === 'application/pdf') {
            setFileName(file.name);
            setValue('pdf', file);
            onFileChange?.(file);
        } else {
            setFileName(null);
            setValue('pdf', null);
            onFileChange?.(null);
            setAlert({ message: 'Solo se permiten archivos PDF.', type: 'error' });
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <>{alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}</>
            <Label className="text-sm font-medium">Subir PDF</Label>
            <Controller
                name="pdf"
                control={control}
                render={() => (
                    <div>
                        <label
                            htmlFor="pdf-upload"
                            className={cn(
                                'hover:border-primary flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 p-6 transition hover:bg-gray-400/50 dark:hover:bg-gray-950/80',
                                selectedFile ? 'border-green-500' : '',
                            )}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <UploadCloud className="mb-2 h-20 w-10 text-gray-500" />
                            {selectedFile ? (
                                <div
                                    className={cn(
                                        'animate-fadeIn w-full rounded-md border border-gray-300 bg-gray-50 p-4 opacity-100 shadow-md transition-opacity duration-500 dark:border-gray-600 dark:bg-gray-800/80',
                                        fileName && fileName.length > 20 ? 'max-w-6xl' : 'max-w-xl',
                                    )}
                                >
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-2xl text-gray-700 dark:text-gray-300">
                                        <p>{fileName}</p>
                                        <p className="text-right">
                                            <strong className="rounded-md bg-cyan-300 px-2 py-0.5 dark:bg-cyan-700">
                                                {(selectedFile.size / 1024).toFixed(2)} KB
                                            </strong>
                                        </p>

                                        <p>{selectedFile.type}</p>
                                        <p className="text-right">{new Date(selectedFile.lastModified).toLocaleDateString()}</p>
                                    </div>

                                    <p className="mt-2 text-center text-2xl text-green-500">¡Archivo cargado y listo para subir!</p>
                                </div>
                            ) : (
                                <span className="text-sm text-gray-600 dark:text-gray-300">Arrastra o selecciona un archivo PDF</span>
                            )}
                        </label>
                        <Input id="pdf-upload" type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                    </div>
                )}
            />
            {fileName && (
                <div className="flex items-center gap-2 text-2xl text-gray-900 dark:text-gray-200">
                    <FileText className="h-5 w-5 text-gray-900 dark:text-gray-200" />
                    {fileName}
                </div>
            )}
            {alert && (
                <div className={`rounded-md p-2 text-lg ${alert.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {alert.message}
                </div>
            )}
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    onClick={() => {
                        setFileName(null);
                        setValue('pdf', null);
                    }}
                >
                    Quitar archivo
                </Button>
                <Button onClick={handleUpload} disabled={isUploading}>
                    {isUploading ? 'Subiendo...' : 'Subir archivo'}
                </Button>
            </div>
        </div>
    );
}
