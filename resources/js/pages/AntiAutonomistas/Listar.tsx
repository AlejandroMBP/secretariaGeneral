import ButtonAction from '@/components/propios/ActionButton';
import AntiAutonomistaFormModal from '@/components/propios/ModalAntiautonomista';
import { antiAutonomistaHeaders } from '@/hooks/antiAutonomistasHeaders';
import AppLayout from '@/layouts/app-layout';
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

interface Props {
    documentos: Documento[];
    [key: string]: any;
}

export default function Listar() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { documentos } = usePage<Props>().props;

    return (
        <AppLayout breadcrumbs={[{ title: 'Anti-Autonomista', href: '/Anti-Autonomista' }]}>
            <Head title="Anti-Autonomista" />
            <div className="flex flex-col gap-6 p-6">
                <div className="dark:bg-sidebar rounded-xl bg-white p-6 shadow-md">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Antiautonomistas</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Aquí puedes gestionar, consultar los documentos relacionados con los Antiautonomistas.
                    </p>
                </div>
                <div className="dark:bg-sidebar rounded-lg bg-white p-6 shadow-md dark:text-white">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold">Lista de Documentos Cargados</h2>
                        <ButtonAction onClick={() => setIsModalOpen(true)}>Registrar a Antiautonomista</ButtonAction>
                    </div>
                    <TableComponent headers={antiAutonomistaHeaders} data={documentos} apiEndpoint="/Anti-update" tipoDocumento="antiAutonomista" />
                </div>
            </div>
            <AntiAutonomistaFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </AppLayout>
    );
}
