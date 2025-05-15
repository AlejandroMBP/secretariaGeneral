import { ArrowRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import FloatingInput from './FloatingImput';
import FloatingSelect from './FloatingSelect';

interface Texto {
    id: string;
    texto: string;
}

interface Documento {
    id: string;
    titulo: string;
    fecha_inicio: string;
    fecha_fin: string;
    adenda: string;
    documento_id: string;
    tipo_documento: string;
    texto_id: string;
    texto_contenido: string;
    Nombre_tipo: string;
}

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedData: Documento) => void;
    data: Documento;
    errors?: Record<string, string[]>;
}

const EditConvenios: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, data, errors }) => {
    const [formData, setFormData] = useState<Documento>({
        id: '',
        titulo: '',
        fecha_inicio: '',
        fecha_fin: '',
        adenda: '',
        documento_id: '',
        tipo_documento: '',
        texto_id: '',
        texto_contenido: '',
        Nombre_tipo: '',
    });

    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const getError = (field: string): string | undefined => {
        if (!errors) return;
        return (errors[field] || errors[`textos.${0}.${field}`] || errors[`textos[0].${field}`] || [])[0];
    };

    useEffect(() => {
        if (data) {
            setFormData({
                id: data.id ?? '',
                titulo: data.titulo ?? '',
                fecha_inicio: data.fecha_inicio ?? '',
                fecha_fin: data.fecha_fin ?? '',
                adenda: data.adenda ?? '',
                documento_id: data.documento_id ?? '',
                tipo_documento: data.tipo_documento ?? '',
                texto_id: data.texto_id ?? '',
                texto_contenido: data.texto_contenido ?? '',
                Nombre_tipo: data.Nombre_tipo ?? '',
            });
        }
    }, [data]);

    useEffect(() => {
        if (isSecondModalOpen && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isSecondModalOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
                    <h2 className="mb-6 text-center text-2xl font-bold text-white">Editar convenios</h2>

                    {/* Campos en dos columnas */}
                    <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Columna Izquierda */}
                        <div className="space-y-4">
                            <FloatingInput
                                id="titulo"
                                name="titulo"
                                label="Titulo de convenio"
                                value={formData.titulo}
                                onChange={handleChange}
                                required
                                error={getError('titulo')}
                            />
                            <FloatingInput
                                id="fecha_inicio"
                                name="fecha_inicio"
                                label="Fecha de inicio"
                                value={formData.fecha_inicio}
                                onChange={handleChange}
                                required
                                type="date"
                                error={getError('fecha_inicio')}
                            />

                            <FloatingInput
                                id="adenda"
                                name="adenda"
                                label="Adenda"
                                value={formData.adenda}
                                onChange={handleChange}
                                required
                                type="date"
                                error={getError('adenda')}
                            />
                        </div>

                        {/* Columna Derecha */}
                        <div className="space-y-4">
                            <FloatingSelect
                                id="tipo_documento"
                                name="tipo_documento"
                                label="Tipo de Documento"
                                value={formData.tipo_documento}
                                onChange={handleChange}
                                options={[
                                    { value: 'NACIONAL', label: 'NACIONAL' },
                                    { value: 'INTERNACIONAL', label: 'INTERNACIONAL' },
                                ]}
                                error={getError('tipo_documento')}
                            />
                            <FloatingInput
                                id="fecha_fin"
                                name="fecha_fin"
                                label="Fecha de fin"
                                value={formData.fecha_fin}
                                onChange={handleChange}
                                required
                                type="date"
                                error={getError('fecha_fin')}
                            />
                        </div>
                    </div>

                    {/* Textarea que ocupa el ancho completo */}
                    <div className="mt-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Contenido del Diploma</label>
                        <textarea
                            name="texto_contenido"
                            value={formData.texto_contenido}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            rows={5}
                            placeholder="Escribe el contenido del diploma aquí..."
                        />
                        {getError('texto') && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getError('texto')}</p>}
                        <button
                            className="mt-3 flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                            onClick={() => setIsSecondModalOpen(true)}
                        >
                            <span className="mr-2">Ampliar Editor</span>
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    {/* Botones de acción */}
                    <div className="mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-6 dark:border-gray-700">
                        <button
                            className="rounded-lg bg-gray-200 px-5 py-2 text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            className={`rounded-lg px-5 py-2 text-white transition-colors ${
                                isLoading
                                    ? 'cursor-not-allowed bg-blue-400 dark:bg-blue-500'
                                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
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
                    <div className="w-full max-w-5xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Editor Completo del Diploma</h2>
                            <button
                                onClick={() => setIsSecondModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
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
                            className="w-full rounded-lg border border-gray-300 bg-white p-4 text-gray-900 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            rows={20}
                            placeholder="Escribe el contenido completo del diploma aquí..."
                        />

                        <div className="mt-4 flex justify-end space-x-3">
                            <button
                                className="rounded-lg bg-gray-200 px-5 py-2 text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                                onClick={() => setIsSecondModalOpen(false)}
                            >
                                Cerrar
                            </button>
                            <button
                                className="rounded-lg bg-green-600 px-5 py-2 text-white transition-colors hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
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

export default EditConvenios;
