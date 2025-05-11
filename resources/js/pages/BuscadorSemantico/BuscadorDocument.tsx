import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function BuscarDocumentos() {
    const [query, setQuery] = useState('');
    const [tipo, setTipo] = useState('');
    const [gestion, setGestion] = useState('');
    const [fechaEmision, setFechaEmision] = useState('');
    const resultados = [
        {
            id: 1,
            tipo: 'Resolución',
            titulo: 'Aprobación de Reglamento Interno',
            resumen: 'Se resuelve aprobar el reglamento interno de la facultad...',
            gestion: '2023',
            fecha: '2023-04-12',
            url: '/descargas/documento-1.pdf',
        },
        {
            id: 2,
            tipo: 'Convenio',
            titulo: 'Convenio Marco con UMSA',
            resumen: 'Se establece un convenio de cooperación entre ambas universidades...',
            gestion: '2022',
            fecha: '2022-09-15',
            url: '/descargas/documento-2.pdf',
        },
    ];
    return (
        <AppLayout breadcrumbs={[{ title: 'Buscar Documentos', href: '/documentos/buscar' }]}>
            <Head title="Buscar Documentos" />
            <div className="container mx-auto p-4">
                {/* Buscador principal */}
                <div className="mb-6 flex items-center justify-center">
                    <div className="relative w-full max-w-xl">
                        <Search className="absolute top-2.5 left-3 text-gray-400" />
                        <input
                            type="text"
                            className="w-full rounded-xl border border-gray-300 py-2 pr-4 pl-10 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Buscar documentos..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filtros */}
                <div className="mb-6 flex flex-wrap justify-center gap-4">
                    <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="rounded-md border p-2">
                        <option value="">Todos los tipos</option>
                        <option value="Resolución">Resolución</option>
                        <option value="Convenio">Convenio</option>
                        <option value="Diploma">Diploma</option>
                    </select>

                    <input
                        type="number"
                        placeholder="Gestión"
                        value={gestion}
                        onChange={(e) => setGestion(e.target.value)}
                        className="w-36 rounded-md border p-2"
                    />

                    <input type="date" value={fechaEmision} onChange={(e) => setFechaEmision(e.target.value)} className="rounded-md border p-2" />
                </div>

                {/* Resultados */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {resultados.map((doc) => (
                        <div key={doc.id} className="rounded-xl border bg-white p-4 shadow-md">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">{doc.tipo}</span>
                                <span className="text-sm text-gray-500">{doc.fecha}</span>
                            </div>
                            <h3 className="text-lg font-semibold">{doc.titulo}</h3>
                            <p className="mt-2 text-sm text-gray-600">{doc.resumen}</p>
                            <div className="mt-4">
                                <a
                                    href={doc.url}
                                    className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                                    download
                                >
                                    Ver/Descargar
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
