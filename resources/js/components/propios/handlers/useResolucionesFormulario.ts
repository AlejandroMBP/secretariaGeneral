import { DocumentosFormularioProps } from '@/types/interfaces';
import axios from 'axios';
import nProgress from 'nprogress';
import { useState } from 'react';

// Tipado de las propiedades que recibe el hook
interface UseResolucionesFormProps {
    tipoDocumento: DocumentosFormularioProps['tipoDocumento'];
}

// Hook personalizado para manejar el formulario de resoluciones
export function useResolucionesForm({ tipoDocumento }: UseResolucionesFormProps) {
    // Estado principal del formulario
    const [formData, setFormData] = useState({
        titulo: '',
        numero: '',
        fecha: '',
        descripcion: '',
        tipoDocumentoId: '',
        detalleDocumentoId: '',
        archivo: null as File | null,
    });

    // Estado para controlar si ya se preprocesó el documento
    const [preprocesado, setPreprocesado] = useState(false);

    // Texto extraído del documento después del preprocesamiento
    const [textoExtraido, setTextoExtraido] = useState('');

    // Estado de carga para mostrar indicadores visuales
    const [cargando, setCargando] = useState(false);

    // Alertas informativas, de éxito o error
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    // Ruta temporal donde se almacena el archivo procesado
    const [rutaTemporal, setRutaTemporal] = useState('');

    // Errores de validación del backend
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    /**
     * Maneja la carga del archivo en el estado
     * @param file Archivo seleccionado por el usuario
     */
    const handleUpload = (file: File) => {
        setFormData((prev) => ({ ...prev, archivo: file }));
    };

    /**
     * Maneja los cambios de los campos del formulario
     * @param e Evento de cambio de input, textarea o select
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Actualiza el valor en el estado
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Elimina errores previos si se está corrigiendo el campo
        if (errors[name]) {
            setErrors((prevErrors) => {
                const updatedErrors = { ...prevErrors };
                delete updatedErrors[name];
                return updatedErrors;
            });
        }
    };

    /**
     * Envía el archivo al backend para extraer texto (preprocesamiento)
     * @param e Evento del formulario
     */
    const handlePreprocesar = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación: debe haber archivo
        if (!formData.archivo) return;

        setCargando(true);
        nProgress.start();

        const formDataToSend = new FormData();
        formDataToSend.append('archivo', formData.archivo);

        try {
            const response = await axios.post('/documentos/preprocesar', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Guarda los datos extraídos y ruta temporal
            setTextoExtraido(response.data.texto_extraido);
            setRutaTemporal(response.data.ruta_temporal);
            setPreprocesado(true);
        } catch (error: any) {
            console.error('Error al preprocesar el documento:', error.response?.data || error.message);
            setAlert({ message: 'Error al preprocesar el documento', type: 'error' });
        } finally {
            setCargando(false);
            nProgress.done();
        }
    };

    /**
     * Envía los datos del formulario (incluye el texto extraído) para guardar en la base de datos
     */
    const handleGuardar = async () => {
        nProgress.start();

        const datos = new FormData();
        datos.append('titulo', formData.titulo);
        datos.append('descripcion', formData.descripcion);
        datos.append('numero', formData.numero);
        datos.append('fecha', formData.fecha);
        datos.append('ruta_temporal', rutaTemporal);
        datos.append('detalleDocumentoId', formData.detalleDocumentoId);
        datos.append('texto_extraido', textoExtraido);

        try {
            await axios.post('/formulario/resoluciones/guardar', datos, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Notificación de éxito y limpieza del formulario
            setAlert({ message: 'Documento guardado exitosamente', type: 'success' });
            setPreprocesado(false);
            setTextoExtraido('');
            setFormData({
                titulo: '',
                numero: '',
                fecha: '',
                descripcion: '',
                tipoDocumentoId: '',
                detalleDocumentoId: '',
                archivo: null,
            });
        } catch (error: any) {
            if (error.response && error.response.status === 422) {
                // Errores de validación
                setErrors(error.response.data.errors);
            } else {
                setAlert({ message: 'Error al guardar el documento', type: 'error' });
            }
        } finally {
            nProgress.done();
        }
    };

    /**
     * Filtra el tipo de documento que corresponde a "RESOLUCIÓN"
     */
    const tipoResolucion = tipoDocumento.find((tipo) => tipo.Nombre_tipo === 'RESOLUCIÓN');

    // Devuelve todos los estados y funciones útiles del formulario
    return {
        formData,
        setFormData,
        handleUpload,
        handleChange,
        handlePreprocesar,
        handleGuardar,
        preprocesado,
        setPreprocesado,
        textoExtraido,
        setTextoExtraido,
        cargando,
        alert,
        setAlert,
        rutaTemporal,
        errors,
        tipoResolucion,
    };
}
