import { useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import Modal from "@/components/propios/modal";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { FileUpload } from "@/components/ui/file-upload";

export default function UsuarioIndex() {
    const [files, setFiles] = useState<File[]>([]);
    const handleFileUpload = (files: File[]) => {
        setFiles(files);
        console.log(files);
    };
    return (
        <AppLayout breadcrumbs={[{ title: "Documentos", href: "/documentos" }]}>
            <Head title="Documentos" />

            <div className="flex flex-col gap-6 p-6">
                <div className="p-6 bg-white dark:bg-sidebar rounded-xl shadow-md">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Administración de Documentos</h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Puedes carfar los documentos
                    </p>
                </div>
                <div className="p-6 bg-white dark:bg-sidebar rounded-xl shadow-md">
                    <FileUpload onChange={handleFileUpload} />
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Lista de Usuarios</h2>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
