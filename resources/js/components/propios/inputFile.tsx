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
        } catch (error) {
            setAlert({ message: 'Error al subir el archivo. Intenta nuevamente.', type: 'error' });
        } finally {
            setIsUploading(false);
            nProgress.done();
        }
    }, [selectedFile]);

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
                                'hover:border-primary flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 p-6 transition hover:bg-gray-100/80',
                                selectedFile ? 'border-primary' : '',
                            )}
                        >
                            <UploadCloud className="mb-2 h-10 w-10 text-gray-500" />
                            <span className="text-sm text-gray-600">{fileName || 'Arrastra o selecciona un archivo PDF'}</span>
                        </label>
                        <Input id="pdf-upload" type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                    </div>
                )}
            />
            {fileName && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FileText className="text-primary h-5 w-5" />
                    {fileName}
                </div>
            )}
            {alert && (
                <div className={`rounded-md p-2 text-sm ${alert.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
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
