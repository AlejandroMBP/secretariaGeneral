import { ArrowRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface Texto {
    id: string;
    texto: string;
}

interface Documento {
    id: string;
    nombre_del_documento: string;
    lo_que_resuelve: string;
    gestion: string;
    texto_id: string;
    texto_contenido: string;
}

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedData: Documento) => void;
    data: Documento;
    errors?: Record<string, string[]>;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, data, errors }) => {
    const [formData, setFormData] = useState<Documento>({
        id: '',
        nombre_del_documento: '',
        lo_que_resuelve: '',
        gestion: '',
        texto_id: '',
        texto_contenido: '',
    });

    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const getError = (field: string): string | undefined => {
        if (!errors) return;
        return (errors[field] ||
            errors[`textos.${0}.${field}`] || // textos.0.texto
            errors[`textos[0].${field}`] || // textos[0].texto
            [])[0];
    };

    useEffect(() => {
        if (data) {
            setFormData({
                id: data.id ?? '',
                nombre_del_documento: data.nombre_del_documento ?? '',
                lo_que_resuelve: data.lo_que_resuelve ?? '',
                gestion: data.gestion ?? '',
                texto_id: data.texto_id ?? '',
                texto_contenido: data.texto_contenido ?? '',
            });
        }
    }, [data]);

    useEffect(() => {
        if (isSecondModalOpen && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isSecondModalOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name === 'texto' ? 'texto_contenido' : name]: value,
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error('Error al guardar:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-gray-800/50">
                <div className="w-full max-w-lg rounded-lg bg-white p-6 text-black shadow-lg dark:bg-black dark:text-white">
                    <h2 className="mb-4 text-xl font-semibold">Editar Documento</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">Nombre del Documento</label>
                            <input
                                type="text"
                                name="nombre_del_documento"
                                value={formData.nombre_del_documento}
                                onChange={handleChange}
                                className="dark:bg-sidebar w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-700"
                                placeholder="Editar Nombre del Documento"
                            />
                            {getError('nombre_del_documento') && <p className="mt-1 text-sm text-red-500">{getError('nombre_del_documento')}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">Lo que Resuelve</label>
                            <textarea
                                name="lo_que_resuelve"
                                value={formData.lo_que_resuelve}
                                onChange={handleChange}
                                className="dark:bg-sidebar w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-700"
                                rows={5}
                                placeholder="Editar lo que resuelve"
                            />
                            {getError('lo_que_resuelve') && <p className="mt-1 text-sm text-red-500">{getError('lo_que_resuelve')}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">Gestión</label>
                            <input
                                type="date"
                                name="gestion"
                                value={formData.gestion}
                                onChange={handleChange}
                                className="dark:bg-sidebar w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-700"
                            />
                            {errors?.gestion_ && <p className="mt-1 text-sm text-red-500">{errors.gestion_[0]}</p>}
                        </div>

                        <div>
                            <textarea
                                name="texto"
                                value={formData.texto_contenido}
                                onChange={handleChange}
                                className="dark:bg-sidebar w-full rounded-lg border border-gray-300 p-4 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-700"
                                rows={5}
                                placeholder="Editar el contenido del documento"
                            />
                            {getError('texto') && <p className="mt-1 text-sm text-red-500">{getError('texto')}</p>}
                            <button
                                className="mt-2 flex items-center justify-center rounded-full border-2 border-transparent bg-gray-800 px-6 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:border-blue-400 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                                onClick={() => setIsSecondModalOpen(true)}
                            >
                                <span className="mr-2">Ampliar Texto Completo</span>
                                <ArrowRight />
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            className="rounded-lg bg-gray-300 px-6 py-2 text-black hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            className={`rounded-lg px-6 py-2 text-white transition ${
                                isLoading ? 'cursor-not-allowed bg-blue-300' : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600'
                            }`}
                            onClick={handleSave}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Secundario */}
            {isSecondModalOpen && (
                <div className="bg-opacity-50 fixed inset-0 z-60 flex items-center justify-center bg-gray-800/50">
                    <div className="w-full max-w-4xl rounded-lg bg-white p-6 text-black shadow-lg dark:bg-black dark:text-white">
                        <h2 className="mb-4 text-xl font-semibold">Texto Completo del Documento</h2>
                        <textarea
                            ref={textareaRef}
                            name="texto_contenido"
                            value={formData.texto_contenido}
                            onChange={handleChange}
                            className="dark:bg-sidebar w-full rounded-lg border border-gray-300 p-4 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-700"
                            rows={20}
                            placeholder="Editar el contenido del documento"
                        />
                        <div className="mt-4 flex justify-end">
                            <button
                                className="rounded-lg bg-red-500 px-6 py-2 text-white hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600"
                                onClick={() => setIsSecondModalOpen(false)}
                            >
                                Listo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditModal;
