import { useForm } from '@inertiajs/react';
import axios from 'axios';
import nProgress from 'nprogress';
import { Fragment, useEffect, useState } from 'react';
import CustomAlert from '../CustomAlert';
import AutocompleteSelect from './AutocompleteSelect';
import FloatingInput from './FloatingImput';
import FloatingSelect from './FloatingSelect';

interface AutoridadesFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SelectOption {
    value: string;
    label: string;
}

export default function AutoridadFormModal({ isOpen, onClose }: AutoridadesFormModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        apellido: '',
        numeroRes: '',
        posicion: '',
        celular: '',
        gestion: '',
    });

    // Opciones fijas para el tipo de persona
    const personasOptions: SelectOption[] = [
        { value: 'HCU', label: 'H.C.U.' },
        { value: 'AGDE', label: 'A.G.D.E.' },
        { value: 'CONGRESO', label: 'Congreso' },
    ];

    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [loadingResoluciones, setLoadingResoluciones] = useState(false);
    const [resoluciones, setResoluciones] = useState([]);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    const handleClose = () => {
        reset(); // Limpia el formulario
        setAlert(null); // Limpia cualquier alerta
        setValidationErrors({}); // Limpia los errores de validación
        onClose(); // Cierra el modal
    };

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
            if (e.key === 'Escape') handleClose();
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        nProgress.start();
        try {
            const response = await axios.post('/cargar-autoridad', data);

            if (response.data.success) {
                setAlert({
                    message: response.data.message,
                    type: 'success',
                });
                reset();
                setValidationErrors({});
                setTimeout(() => {
                    onClose();
                    nProgress.done();
                    window.location.reload();
                }, 1000);
            } else {
                nProgress.done();
                setAlert({
                    message: response.data.message,
                    type: 'error',
                });
            }
        } catch (error) {
            nProgress.done();
            let errorMessage = 'Error al procesar la solicitud';

            if (axios.isAxiosError(error)) {
                if (error.response?.status === 422 && error.response?.data?.errors) {
                    const validationErrors = error.response.data.errors;
                    setValidationErrors(validationErrors);
                    errorMessage = 'Por favor corrige los errores en el formulario';
                } else {
                    errorMessage = error.response?.data?.message || errorMessage;
                }
            }

            setAlert({
                message: errorMessage,
                type: 'error',
            });
        }
    };

    if (!isOpen) return null;

    return (
        <Fragment>
            {/* Fondo oscuro */}
            <div className="bg-opacity-50 fixed inset-0 z-40 bg-black/30" onClick={handleClose} />
            <>{alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}</>

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="dark:bg-sidebar w-full max-w-2xl rounded-lg bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Registrar autoridad</h3>
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
                                    error={errors.nombre || (validationErrors.nombre && validationErrors.nombre[0])}
                                />

                                <FloatingInput
                                    id="apellido"
                                    name="apellido"
                                    label="Apellido(s)"
                                    value={data.apellido}
                                    onChange={(e) => setData('apellido', e.target.value)}
                                    required
                                    error={errors.apellido || (validationErrors.apellido && validationErrors.apellido[0])}
                                />
                            </div>

                            {/* Columna Derecha */}
                            <div className="space-y-6">
                                <FloatingInput
                                    id="celular"
                                    name="celular"
                                    label="Celular"
                                    value={data.celular}
                                    onChange={(e) => setData('celular', e.target.value)}
                                    required
                                    error={errors.celular || (validationErrors.celular && validationErrors.celular[0])}
                                />

                                <AutocompleteSelect
                                    id="numeroRes"
                                    name="numeroRes"
                                    label="Número de Resolución"
                                    value={data.numeroRes}
                                    onChange={(value) => setData('numeroRes', value)}
                                    required
                                    error={errors.numeroRes || (validationErrors.numeroRes && validationErrors.numeroRes[0])}
                                    fetchUrl="/buscar-resolucion"
                                />
                            </div>
                            {/* Select de Tipo de posicion (ancho completo) */}
                            <div className="mb-6">
                                <FloatingSelect
                                    id="posicion"
                                    name="posicion"
                                    label="Posicionado"
                                    value={data.posicion}
                                    onChange={(e) => setData('posicion', e.target.value)}
                                    required
                                    error={errors.posicion || (validationErrors.posicion && validationErrors.posicion[0])}
                                    options={personasOptions}
                                />
                            </div>
                            <div className="mb-6">
                                <FloatingInput
                                    id="gestion"
                                    name="gestion"
                                    label="Gestion"
                                    value={data.gestion}
                                    onChange={(e) => setData('gestion', e.target.value)}
                                    required
                                    error={errors.gestion || (validationErrors.gestion && validationErrors.gestion[0])}
                                />
                            </div>
                        </div>

                        {/* Footer con botones */}
                        <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={handleClose}
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
