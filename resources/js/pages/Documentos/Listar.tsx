import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { EyeIcon } from 'lucide-react';
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
        <AppLayout breadcrumbs={[{ title: 'Documentos', href: '/documentos' }]}>
            <Head title="Documentos" />
            <div className="flex flex-col gap-6 p-6">
                <div className="dark:bg-sidebar rounded-xl bg-white p-6 shadow-md">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Administración de Documentos</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">Puedes carfar los documentos</p>
                </div>
                <div className="dark:bg-sidebar rounded-lg bg-white p-6 shadow-md dark:text-white">
                    <h2 className="mb-4 text-xl font-bold">Lista de Documentos</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nro.</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Fecha de cargado</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documentos.map((doc, index) => (
                                <TableRow key={doc.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{doc.nombre}</TableCell>
                                    <TableCell>{doc.tipo}</TableCell>
                                    <TableCell>{doc.usuario.name}</TableCell>
                                    <TableCell>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => window.open(`/storage/${doc.ruta}`, '_blank')}
                                            className="flex items-center space-x-2 text-blue-500 hover:text-blue-700"
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                            <span>Ver</span>
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
