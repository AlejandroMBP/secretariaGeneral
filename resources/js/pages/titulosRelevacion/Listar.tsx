import { bachillerHeaders } from '@/hooks/bachilerHeaders';
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
        <AppLayout breadcrumbs={[{ title: 'Revalidacion', href: '/Revalidacion' }]}>
            <Head title="Títulos profesionales por revalidación" />
            <div className="flex flex-col gap-6 p-6">
                <div className="dark:bg-sidebar rounded-xl bg-white p-6 shadow-md">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gestion de títulos profesionales por revalidación </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Aquí puedes gestionar y consultar los títulos profesionales por revalidación.
                    </p>
                </div>
                <div className="dark:bg-sidebar rounded-lg bg-white p-6 shadow-md dark:text-white">
                    <h2 className="mb-4 text-xl font-bold">Lista de títulos profesionales</h2>
                    <TableComponent headers={bachillerHeaders} data={documentos} apiEndpoint="/diplomas-update" tipoDocumento="relevacion" />
                </div>
            </div>
        </AppLayout>
    );
}
