import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

// Función para truncar y resaltar coincidencias
const renderNombre = (nombre: string, search: string) => {
    const maxLength = 80;

    if (!search) {
        const truncated = nombre.length > maxLength ? nombre.slice(0, maxLength) + '...' : nombre;
        return <span>{truncated}</span>;
    }

    const regex = new RegExp(`(${search})`, 'gi');
    const parts = nombre.split(regex);

    const highlighted = parts.map((part, idx) =>
        regex.test(part) ? (
            <mark key={idx} className="bg-yellow-300 text-black">
                {part}
            </mark>
        ) : (
            part
        ),
    );

    const result = highlighted.reduce((acc: any[], part, index) => {
        const total = acc.reduce((sum, el) => sum + (typeof el === 'string' ? el.length : 0), 0);
        if (total < maxLength) {
            acc.push(part);
        }
        return acc;
    }, []);

    const totalLength = result.reduce((sum, el) => sum + (typeof el === 'string' ? el.length : 0), 0);
    const needsEllipsis = totalLength < nombre.length;

    return (
        <span>
            {result}
            {needsEllipsis && '...'}
        </span>
    );
};

interface Documento {
    id: number;
    nombre: string;
    tipo: string;
    gestion: string;
    usuario: { name: string };
    ruta: string;
    created_at: string;
}

interface Props {
    documentos: Documento[];
    tipos: string[];
    gestiones: string[];
}

export default function BuscarDocumentos() {
    const { documentos, tipos, gestiones } = usePage<Props>().props;
    const [search, setSearch] = useState('');
    const [tipo, setTipo] = useState('');
    const [gestion, setGestion] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/documentos/buscar', { search, tipo, gestion }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Buscar Documentos', href: '/documentos/buscar' }]}>
            <Head title="Buscar Documentos" />

            <div className="flex flex-col gap-6 p-6">
                {/* Formulario de búsqueda */}
                <div className="dark:bg-sidebar rounded-xl bg-white p-6 shadow-md">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Búsqueda de Documentos</h1>

                    <form onSubmit={handleSearch} className="mt-4 flex flex-wrap gap-4">
                        <input
                            type="text"
                            placeholder="Buscar por texto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:outline-none md:w-1/3 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                        <select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:outline-none md:w-1/4 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        >
                            <option value="">Todos los Tipos</option>
                            {tipos.map((t, idx) => (
                                <option key={idx} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                        <select
                            value={gestion}
                            onChange={(e) => setGestion(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:outline-none md:w-1/4 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        >
                            <option value="">Todas las Gestiones</option>
                            {gestiones.map((g, idx) => (
                                <option key={idx} value={g}>
                                    {g}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow transition duration-200 hover:bg-indigo-700"
                        >
                            Buscar
                        </button>
                    </form>
                </div>

                {/* Resultados */}
                <div className="dark:bg-sidebar rounded-lg bg-white p-6 shadow-md dark:text-white">
                    <h2 className="mb-4 text-xl font-bold">Resultados</h2>

                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                <tr>
                                    <th className="px-4 py-2">Nombre</th>
                                    <th className="px-4 py-2">Tipo</th>
                                    <th className="px-4 py-2">Gestión</th>
                                    <th className="px-4 py-2">Usuario</th>
                                    <th className="px-4 py-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documentos.map((doc) => (
                                    <tr
                                        key={doc.id}
                                        className="border-t border-gray-200 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                                    >
                                        <td className="px-4 py-2">{renderNombre(doc.nombre, search)}</td>
                                        <td className="px-4 py-2">{doc.tipo}</td>
                                        <td className="px-4 py-2">{doc.gestion}</td>
                                        <td className="px-4 py-2">{doc.usuario.name}</td>
                                        <td className="px-4 py-2">
                                            <a
                                                href={doc.ruta}
                                                className="text-indigo-600 hover:underline dark:text-indigo-400"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Ver/Descargar
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                                {documentos.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-4 text-center text-gray-500 dark:text-gray-300">
                                            No se encontraron documentos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
