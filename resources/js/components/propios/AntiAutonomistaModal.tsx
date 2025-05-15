import React, { useEffect, useRef, useState } from 'react';
import FloatingInput from './FloatingImput';
import FloatingSelect from './FloatingSelect';

interface Texto {
    id: string;
    texto: string;
}

interface Documento {
    id: string;
    nombres: string;
    apellidos: string;
    tipoPersona: string;
    ci: string;
}

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedData: Documento) => void;
    data: Documento;
    errors?: Record<string, string[]>;
}

const EditAnti: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, data, errors }) => {
    const [formData, setFormData] = useState<Documento>({
        nombres: '',
        apellidos: '',
        tipoPersona: '',
        ci: '',
        id: '',
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
                nombres: data.nombres ?? '',
                apellidos: data.apellidos ?? '',
                tipoPersona: data.tipoPersona ?? '',
                ci: data.ci ?? '',
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
                    <h2 className="mb-6 text-center text-2xl font-bold text-white">Editar Antiautonomista</h2>

                    {/* Campos en dos columnas */}
                    <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Columna Izquierda */}
                        <div className="space-y-4">
                            <FloatingInput
                                id="nombres"
                                name="nombres"
                                label="Nombre(s)"
                                value={formData.nombres}
                                onChange={handleChange}
                                required
                                error={getError('nombres')}
                            />
                            <FloatingInput
                                id="apellidos"
                                name="apellidos"
                                label="Apellido(s)"
                                value={formData.apellidos}
                                onChange={handleChange}
                                required
                                error={getError('apeliidos')}
                            />
                        </div>

                        {/* Columna Derecha */}
                        <div className="space-y-4">
                            <FloatingInput id="ci" name="ci" label="ci" value={formData.ci} onChange={handleChange} required error={getError('ci')} />

                            <FloatingSelect
                                id="tipoPersona"
                                name="tipoPersona"
                                label="Tipo"
                                value={formData.tipoPersona}
                                onChange={handleChange}
                                options={[
                                    { value: 'Docente', label: 'DOCENTE' },
                                    { value: 'Estudiante', label: 'ESTUDIANTE' },
                                    { value: 'Administrativo', label: 'ADMINISTRATIVO' },
                                ]}
                                error={getError('tipo_documento')}
                            />
                        </div>
                    </div>

                    {/* Textarea que ocupa el ancho completo */}

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
        </>
    );
};

export default EditAnti;
