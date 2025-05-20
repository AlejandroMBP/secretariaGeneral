import FloatingInput from '@/components/propios/FloatingImput';
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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/50">
                <div className="bg-sidebar w-full max-w-4xl rounded-lg p-6 text-white shadow-lg">
                    <h2 className="mb-6 text-center text-2xl font-bold text-white">Editar Documento</h2>

                    {/* Campos principales */}
                    <div className="mb-4 space-y-4">
                        <FloatingInput
                            id="nombre_del_documento"
                            name="nombre_del_documento"
                            label="Nombre del Documento"
                            value={formData.nombre_del_documento}
                            onChange={handleChange}
                            required
                            error={getError('nombre_del_documento')}
                        />

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">Lo que Resuelve</label>
                            <textarea
                                name="lo_que_resuelve"
                                value={formData.lo_que_resuelve}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white focus:ring-2 focus:ring-blue-500"
                                rows={5}
                                placeholder="Editar lo que resuelve"
                            />
                            {getError('lo_que_resuelve') && <p className="mt-1 text-sm text-red-400">{getError('lo_que_resuelve')}</p>}
                        </div>

                        <FloatingInput
                            id="gestion"
                            name="gestion"
                            label="Gestión"
                            type="date"
                            value={formData.gestion}
                            onChange={handleChange}
                            required
                            error={errors?.gestion_ && errors.gestion_[0]}
                        />
                    </div>

                    {/* Textarea para el contenido */}
                    <div className="mt-4">
                        <label className="mb-2 block text-sm font-medium text-gray-300">Contenido del Documento</label>
                        <textarea
                            name="texto"
                            value={formData.texto_contenido}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white focus:ring-2 focus:ring-blue-500"
                            rows={5}
                            placeholder="Editar el contenido del documento"
                        />
                        {getError('texto') && <p className="mt-1 text-sm text-red-400">{getError('texto')}</p>}
                        <button
                            className="mt-3 flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                            onClick={() => setIsSecondModalOpen(true)}
                        >
                            <span className="mr-2">Ampliar Editor</span>
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    {/* Botones de acción */}
                    <div className="mt-6 flex justify-end space-x-3 border-t border-gray-700 pt-6">
                        <button className="rounded-lg bg-gray-600 px-5 py-2 text-white transition-colors hover:bg-gray-500" onClick={onClose}>
                            Cancelar
                        </button>
                        <button
                            className={`rounded-lg px-5 py-2 text-white transition-colors ${
                                isLoading ? 'cursor-not-allowed bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                            onClick={handleSave}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Guardando...
                                </span>
                            ) : (
                                'Guardar Cambios'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Secundario - Editor Completo */}
            {isSecondModalOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-gray-500/75 dark:bg-gray-900/80">
                    <div className="w-full max-w-5xl rounded-lg bg-gray-800 p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white">Editor Completo del Documento</h2>
                            <button onClick={() => setIsSecondModalOpen(false)} className="text-gray-400 hover:text-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <textarea
                            ref={textareaRef}
                            name="texto_contenido"
                            value={formData.texto_contenido}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-600 bg-gray-700 p-4 text-white focus:ring-2 focus:ring-blue-500"
                            rows={20}
                            placeholder="Escribe el contenido completo del documento aquí..."
                        />

                        <div className="mt-4 flex justify-end space-x-3">
                            <button
                                className="rounded-lg bg-gray-600 px-5 py-2 text-white transition-colors hover:bg-gray-500"
                                onClick={() => setIsSecondModalOpen(false)}
                            >
                                Cerrar
                            </button>
                            <button
                                className="rounded-lg bg-green-700 px-5 py-2 text-white transition-colors hover:bg-green-600"
                                onClick={() => setIsSecondModalOpen(false)}
                            >
                                Guardar y Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditModal;
