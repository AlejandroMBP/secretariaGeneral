import { documentHeaders } from '@/hooks/documentHeaders';
import AppLayout from '@/layouts/app-layout';
import TableComponent from '@/pages/Documentos/TableComponent';
import { PageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';

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

interface Props extends PageProps {
    documentos: Documento[];
    [key: string]: any;
}

export default function Listar() {
    const { documentos } = usePage<Props>().props;

    return (
        <AppLayout breadcrumbs={[{ title: 'HCU', href: '/HCU' }]}>
            <Head title="HCU" />
            <div className="flex flex-col gap-6 p-6">
                <div className="dark:bg-sidebar rounded-xl bg-white p-6 shadow-md">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Resoluciones HCU</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Aquí puedes gestionar y consultar los documentos relacionados con las resoluciones del HCU.
                    </p>
                </div>
                <div className="dark:bg-sidebar rounded-lg bg-white p-6 shadow-md dark:text-white">
                    <h2 className="mb-4 text-xl font-bold">Lista de Documentos Cargados</h2>
                    <TableComponent headers={documentHeaders} data={documentos} apiEndpoint="/hcu-update" tipoDocumento={'resoluciones'} />
                </div>
            </div>
        </AppLayout>
    );
}
