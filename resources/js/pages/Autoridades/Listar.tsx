import ButtonAction from '@/components/propios/ActionButton';
import AutoridadFormModal from '@/components/propios/ModalAutoridades';
import { autoridadesHeaders } from '@/hooks/autoridadesHeaders';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
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

interface Props extends PageProps {
    documentos: Documento[];
    [key: string]: any;
}

export default function Listar() {
    const { documentos } = usePage<Props>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <AppLayout breadcrumbs={[{ title: 'Autoridades', href: '/Autoridades' }]}>
            <Head title="Autoridades" />
            <div className="flex flex-col gap-6 p-6">
                <div className="dark:bg-sidebar rounded-xl bg-white p-6 shadow-md">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Autoridades</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Aquí puedes gestionar, consultar los documentos relacionados con las autoridades.
                    </p>
                </div>
                <div className="dark:bg-sidebar rounded-lg bg-white p-6 shadow-md dark:text-white">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="mb-4 text-xl font-bold">Lista de Documentos Cargados</h2>

                        <ButtonAction onClick={() => setIsModalOpen(true)}>Registrar Autoridad</ButtonAction>
                    </div>
                    <TableComponent headers={autoridadesHeaders} data={documentos} apiEndpoint="/Autoridades-update" tipoDocumento="autoridades" />
                </div>
            </div>
            <AutoridadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </AppLayout>
    );
}
