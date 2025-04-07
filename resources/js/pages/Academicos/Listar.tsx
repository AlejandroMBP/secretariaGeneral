import { documentHeaders } from '@/hooks/documentHeaders';
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
        <AppLayout breadcrumbs={[{ title: 'Académicos', href: '/Academicos' }]}>
            <Head title="Diplomas Académicos" />
            <div className="flex flex-col gap-6 p-6">
                <div className="dark:bg-sidebar rounded-xl bg-white p-6 shadow-md">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gestión de Diplomas Académicos</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Aquí puedes gestionar, cargar y consultar los documentos de los diplomas académicos.
                    </p>
                </div>
                <div className="dark:bg-sidebar rounded-lg bg-white p-6 shadow-md dark:text-white">
                    <h2 className="mb-4 text-xl font-bold">Lista de Documentos Cargados</h2>
                    <TableComponent headers={documentHeaders} data={documentos} />
                </div>
            </div>
        </AppLayout>
    );
}
