import { academicosHeaders } from '@/hooks/academicosHeaders';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import TableComponent from '../Documentos/TableComponent';

interface Documento {
    id: number;
    nombre: string;
    tipo: string;
    usuario: {
        name: string;
    };
    created_at: string;
    ruta: string;
}

interface Props {
    documentos: Documento[];
    [key: string]: any;
}

export default function Listar() {
    const { documentos } = usePage<Props>().props;

    return (
        <AppLayout breadcrumbs={[{ title: 'Post Grado', href: '/post-grado' }]}>
            <Head title="Post grado" />
            <div className="flex flex-col gap-6 p-6">
                <div className="dark:bg-sidebar rounded-xl bg-white p-6 shadow-md">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Post grado</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Aquí puedes gestionar y consultar los documentos relacionados con los diplomas de post grado.
                    </p>
                </div>
                <div className="dark:bg-sidebar rounded-lg bg-white p-6 shadow-md dark:text-white">
                    <h2 className="mb-4 text-xl font-bold">Lista de diplomas de porst grado cargados</h2>
                    <TableComponent headers={academicosHeaders} data={documentos} apiEndpoint="/diplomas-update" tipoDocumento="postgrado" />
                </div>
            </div>
        </AppLayout>
    );
}
