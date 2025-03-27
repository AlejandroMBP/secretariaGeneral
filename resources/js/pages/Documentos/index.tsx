import { FileUpload } from '@/components/ui/file-upload';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import 'nprogress/nprogress.css';
import { useState } from 'react';

export default function UsuarioIndex() {
    const [files, setFiles] = useState<File[]>([]);
    const handleFileUpload = (files: File[]) => {
        setFiles(files);
        console.log(files);
    };
    return (
        <AppLayout breadcrumbs={[{ title: 'Documentos', href: '/documentos' }]}>
            <Head title="Documentos" />

            <div className="flex flex-col gap-6 p-6">
                <div className="dark:bg-sidebar rounded-xl bg-white p-6 shadow-md">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Administración de Documentos</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">Puedes carfar los documentos</p>
                </div>
                <div className="dark:bg-sidebar rounded-xl bg-white p-6 shadow-md">
                    <FileUpload onChange={handleFileUpload} />
                </div>
            </div>
        </AppLayout>
    );
}
