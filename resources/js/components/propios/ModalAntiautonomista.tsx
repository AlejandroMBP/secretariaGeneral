import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import AutocompleteSelect from './AutocompleteSelect';
import FloatingInput from './FloatingImput';
import FloatingSelect from './FloatingSelect';

interface AntiAutonomistaFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SelectOption {
    value: string;
    label: string;
}

export default function AntiAutonomistaFormModal({ isOpen, onClose }: AntiAutonomistaFormModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        apellido: '',
        ci: '',
        numeroRes: '',
        persona: '',
    });

    // Opciones fijas para el tipo de persona
    const personasOptions: SelectOption[] = [
        { value: 'docente', label: 'Docente' },
        { value: 'estudiante', label: 'Estudiante' },
        { value: 'administrativo', label: 'Administrativo' },
    ];

    const [loadingResoluciones, setLoadingResoluciones] = useState(false);
    const [resoluciones, setResoluciones] = useState([]);

    useEffect(() => {
        const fetchResoluciones = async () => {
            try {
                setLoadingResoluciones(true);
                const response = await axios.get('/buscar-resolucion');
                const options = response.data.data.map((resolucion: any) => ({
                    value: resolucion.id.toString(),
                    label: resolucion.numero_resolucion,
                }));
                setResoluciones(options);
                setLoadingResoluciones(false);
            } catch (error) {
                console.error('Error obteniendo resoluciones:', error);
                setLoadingResoluciones(false);
            }
        };

        if (isOpen) {
            fetchResoluciones();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        } else {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/ruta-para-guardar-anti-autonomista', {
            onSuccess: () => {
                onClose();
                reset();
            },
            preserveScroll: true,
        });
    };

    if (!isOpen) return null;

    return (
        <Fragment>
            {/* Fondo oscuro */}
            <div className="bg-opacity-50 fixed inset-0 z-40 bg-black/30" onClick={onClose} />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="dark:bg-sidebar w-full max-w-2xl rounded-lg bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Registrar Anti-Autonomista</h3>
                    </div>

                    {/* Contenido */}
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Columna Izquierda */}
                            <div className="space-y-6">
                                <FloatingInput
                                    id="nombre"
                                    name="nombre"
                                    label="Nombre(s)"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    required
                                    error={errors.nombre}
                                />

                                <FloatingInput
                                    id="apellido"
                                    name="apellido"
                                    label="Apellido(s)"
                                    value={data.apellido}
                                    onChange={(e) => setData('apellido', e.target.value)}
                                    required
                                    error={errors.apellido}
                                />
                            </div>

                            {/* Columna Derecha */}
                            <div className="space-y-6">
                                <FloatingInput
                                    id="ci"
                                    name="ci"
                                    label="Carnet"
                                    value={data.ci}
                                    onChange={(e) => setData('ci', e.target.value)}
                                    required
                                    error={errors.ci}
                                />

                                <AutocompleteSelect
                                    id="numeroRes"
                                    name="numeroRes"
                                    label="Número de Resolución"
                                    value={data.numeroRes}
                                    onChange={(value) => setData('numeroRes', value)}
                                    required
                                    error={errors.numeroRes}
                                    fetchUrl="/buscar-resolucion"
                                />
                            </div>
                        </div>

                        {/* Select de Tipo de Persona (ancho completo) */}
                        <div className="mb-6">
                            <FloatingSelect
                                id="persona"
                                name="persona"
                                label="Tipo de Persona"
                                value={data.persona}
                                onChange={(e) => setData('persona', e.target.value)}
                                required
                                error={errors.persona}
                                options={personasOptions}
                            />
                        </div>

                        {/* Footer con botones */}
                        <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {processing ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}
