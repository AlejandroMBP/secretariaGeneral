import AppLayout from '@/layouts/app-layout';
import { Documento } from '@/types/interfaces';
import { Head, router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PageProps } from 'react-pdf';
import { useDebounce } from 'use-debounce';

interface Props extends PageProps {
    documentos: Documento[];
    tipos: string[];
    gestiones: string[];
    gestion_resolucion: string[];
    [key: string]: any;
}

export default function BuscarDocumentos() {
    const { documentos, tipos, gestiones } = usePage<Props>().props;
    const [search, setSearch] = useState('');
    const [tipo, setTipo] = useState('');
    const [gestion, setGestion] = useState('');
    const [gestion_resolucion, setGestionResolucion] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    // Usamos debounce para evitar hacer muchas solicitudes mientras se escribe
    const [debouncedSearch] = useDebounce(search, 500);
    const [debouncedTipo] = useDebounce(tipo, 500);
    const [debouncedGestion] = useDebounce(gestion, 500);
    const [debouncedGestionResolucion] = useDebounce(gestion_resolucion, 500);

    useEffect(() => {
        // Verificamos si hay algún filtro activo
        const hasFilters = debouncedSearch || debouncedTipo || debouncedGestion || debouncedGestionResolucion;

        if (hasFilters) {
            router.get(
                '/documentos/buscar',
                {
                    search: debouncedSearch,
                    tipo: debouncedTipo,
                    gestion: debouncedGestion,
                    gestion_resolucion: debouncedGestionResolucion,
                },
                {
                    preserveState: true,
                    replace: true,
                },
            );
            setHasSearched(true);
        } else {
            // Si no hay filtros, limpiamos los resultados
            setHasSearched(false);
        }
    }, [debouncedSearch, debouncedTipo, debouncedGestion, debouncedGestionResolucion]);

    return (
        <AppLayout breadcrumbs={[{ title: 'Buscar Documentos', href: '/documentos/buscar' }]}>
            <Head title="Buscar Documentos" />

            <div className="flex flex-col gap-6 p-6">
                {/* Formulario de búsqueda */}
                <div className="dark:bg-sidebar rounded-xl bg-white p-6 shadow-md">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Búsqueda de Documentos</h1>
                    <div className="container mx-auto p-4">
                        {/* buscador principal */}
                        <div className="mb-6 flex items-center justify-center">
                            <div className="relative w-full max-w-xl">
                                <Search className="absolute top-2.5 left-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por texto..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 py-2 pr-4 pl-10 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="mb-6 flex flex-wrap justify-center gap-4">
                            <select
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                className="dark:bg-sidebar w-full rounded-md border border-gray-300 p-2 px-4 py-2 shadow-sm focus:border-indigo-500 focus:outline-none md:w-1/4 dark:border-gray-600 dark:text-white"
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
                                className="dark:bg-sidebar w-full rounded-md border border-gray-300 p-2 px-4 py-2 shadow-sm focus:border-indigo-500 focus:outline-none md:w-1/4 dark:border-gray-600 dark:text-white"
                            >
                                <option value="">Todas las Gestiones</option>
                                {gestiones.map((g, idx) => (
                                    <option key={idx} value={g}>
                                        {g}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Resultados */}
                {hasSearched ? (
                    documentos.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {documentos.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="dark:bg-sidebar rounded-xl border border-gray-200 bg-white p-4 shadow-md transition-colors duration-300 dark:border-gray-700"
                                >
                                    {/* ... (código de la tarjeta igual que antes) ... */}
                                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                        {/* Resolución */}
                                        {doc.tipo_documento && (
                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                                {doc.tipo_documento}
                                            </span>
                                        )}
                                        {doc.gestion_resolucion && (
                                            <span className="text-sm text-gray-500 dark:text-gray-400">{doc.gestion_resolucion}</span>
                                        )}
                                        {doc.numero_resolucion && (
                                            <span className="text-sm text-gray-500 dark:text-gray-400">{doc.numero_resolucion}</span>
                                        )}

                                        {/* Diploma */}
                                        {doc.numero_serie && <span className="text-sm text-gray-500 dark:text-gray-400">{doc.numero_serie}</span>}
                                        {doc.carrera && <span className="text-sm text-gray-500 dark:text-gray-400">{doc.carrera}</span>}

                                        {/* antiAutonimista */}
                                        {doc.cedula_de_identidad && (
                                            <span className="text-sm text-gray-500 dark:text-gray-400">{doc.cedula_de_identidad}</span>
                                        )}
                                        {doc.anti_tipo && <span className="text-sm text-gray-500 dark:text-gray-400">{doc.anti_tipo}</span>}

                                        {/* Autoridad */}
                                        {doc.gestion && <span className="text-sm text-gray-500 dark:text-gray-400">{doc.gestion}</span>}
                                        {doc.autoridad_tipo_posicio && (
                                            <span className="text-sm text-gray-500 dark:text-gray-400">{doc.autoridad_tipo_posicio}</span>
                                        )}
                                    </div>

                                    {/* Títulos por tipo */}
                                    {doc.resolucion_nombre && (
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{doc.resolucion_nombre}</h3>
                                    )}
                                    {doc.convenio_titulo && (
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{doc.convenio_titulo}</h3>
                                    )}
                                    {doc.diploma_nombre && (
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{doc.diploma_nombre}</h3>
                                    )}
                                    {doc.anti_nombre && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{doc.anti_nombre}</h3>}
                                    {doc.autoridad_nombre && (
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{doc.autoridad_nombre}</h3>
                                    )}

                                    {/* Descripciones o contenido relevante */}
                                    {doc.resolucion_lo_que_resuelve && (
                                        <p className="mt-2 text-sm font-bold text-purple-800 dark:text-purple-400">
                                            {doc.resolucion_lo_que_resuelve}
                                        </p>
                                    )}
                                    {/* Adenda */}
                                    {doc.fecha_inicio && (
                                        <p className="mt-2 text-sm font-bold text-purple-800 dark:text-purple-400">
                                            Fecha inicio: {doc.fecha_inicio}
                                        </p>
                                    )}
                                    {doc.fecha_fin && (
                                        <p className="mt-2 text-sm font-bold text-purple-800 dark:text-purple-400">Fecha fin: {doc.fecha_fin}</p>
                                    )}
                                    {doc.adenda && <p className="mt-2 text-sm font-bold text-purple-800 dark:text-purple-400">{doc.adenda}</p>}

                                    {/* Diploma */}
                                    {doc.fecha_nacimiento && (
                                        <p className="mt-2 text-sm font-bold text-purple-800 dark:text-purple-400">
                                            Nacimiento: {doc.fecha_nacimiento}
                                        </p>
                                    )}
                                    {doc.fecha_emision && (
                                        <p className="mt-2 text-sm font-bold text-purple-800 dark:text-purple-400">Emisión: {doc.fecha_emision}</p>
                                    )}

                                    {/* Texto buscado */}
                                    {doc.texto && <p className="mt-2 line-clamp-5 text-sm text-gray-600 dark:text-gray-300">{doc.texto}</p>}

                                    {/* Botón Ver/Descargar */}
                                    <div className="mt-4">
                                        {doc.ruta && (
                                            <a
                                                href={doc.ruta}
                                                className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 dark:hover:bg-blue-500"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Ver/Descargar
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-10 text-center">
                            <p className="text-gray-500 dark:text-gray-400">No se encontraron documentos con los filtros seleccionados</p>
                        </div>
                    )
                ) : (
                    <div className="py-10 text-center">
                        <p className="text-gray-500 dark:text-gray-400">Ingrese algún término de búsqueda o seleccione filtros para ver resultados</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
