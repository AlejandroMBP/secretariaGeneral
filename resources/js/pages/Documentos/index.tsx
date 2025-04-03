import CustomAlert from '@/components/CustomAlert';
import PdfUploader from '@/components/propios/PdfUploader';
import AppLayout from '@/layouts/app-layout';
import { DocumentosFormularioProps } from '@/types/interfaces';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import nProgress from 'nprogress';
import { useState } from 'react';

export default function DocumentosFormulario(props: DocumentosFormularioProps) {
    const [textoExtraido, setTextoExtraido] = useState('');
    const [usarOCR, setUsarOCR] = useState(false);
    const [rutaTemporal, setRutaTemporal] = useState('');
    const [preprocesado, setPreprocesado] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const [form, setForm] = useState({
        titulo: '',
        descripcion: '',
        categoria: '',
        fecha: '',
        archivo: null as File | null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: null });
    };

    const handleUpload = (file: File) => {
        setForm({ ...form, archivo: file });
    };

    const handlePreprocesar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.archivo) {
            setAlert({ message: 'Por favor, selecciona un archivo PDF.', type: 'info' });
            return;
        }
        nProgress.start();
        const formData = new FormData();
        formData.append('archivo', form.archivo);
        try {
            const response = await axios.post('/documentos/preprocesar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setTextoExtraido(response.data.texto_extraido);
            setRutaTemporal(response.data.ruta_temporal);
            setPreprocesado(true);
            setUsarOCR(response.data.metodo_usado === 'OCR (Tesseract)');
        } catch (error: any) {
            console.error('Error al preprocesar el documento:', error.response?.data || error.message);
            setAlert({ message: 'Error al preprocesar el documento', type: 'error' });
            // alert('Error al preprocesar el documento');
        } finally {
            nProgress.done();
        }
    };

    const handleGuardar = async () => {
        nProgress.start();
        const formData = new FormData();
        formData.append('titulo', form.titulo);
        formData.append('descripcion', form.descripcion);
        formData.append('categoria', form.categoria);
        formData.append('fecha', form.fecha);
        formData.append('ruta_temporal', rutaTemporal);
        formData.append('usarOCR', usarOCR.toString());
        formData.append('texto_extraido', textoExtraido);
        try {
            await axios.post('/documentos/guardar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            // alert('Documento guardado exitosamente');
            setAlert({ message: 'Documento guardado exitosamente', type: 'success' });
            setPreprocesado(false);
            setTextoExtraido('');
            setRutaTemporal('');
            setForm({ titulo: '', descripcion: '', categoria: '', fecha: '', archivo: null });
        } catch (error: any) {
            if (error.response && error.response.status === 422) {
                // Los errores de validación están en error.response.data.errors
                setErrors(error.response.data.errors);
            } else {
                console.error('Error al guardar el documento:', error.response?.data || error.message);
                // alert('Error al guardar el documento');
                setAlert({ message: 'Error al guardar el documento', type: 'error' });
            }
        } finally {
            nProgress.done();
        }
    };

    const handleReset = () => {
        setPreprocesado(false);
        setTextoExtraido('');
        setRutaTemporal('');
        setForm({ titulo: '', descripcion: '', categoria: '', fecha: '', archivo: null });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Documentos', href: '/documentos' }]}>
            <Head title="Documentos" />
            <>{alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}</>

            <div className="flex flex-col gap-6 p-6">
                <div className="dark:bg-sidebar rounded-xl bg-white p-6 shadow-md">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Administración de Documentos</h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Carga y administra documentos de manera sencilla.</p>
                </div>
                <div className="dark:bg-sidebar rounded-xl bg-white p-6 shadow-md">
                    <form onSubmit={handlePreprocesar} className="space-y-4">
                        <input
                            type="text"
                            name="titulo"
                            value={form.titulo}
                            onChange={handleChange}
                            placeholder="Título del documento"
                            className="w-full rounded-md border border-gray-300 p-3 focus:ring focus:ring-blue-500"
                            required
                        />
                        {errors.titulo && <p className="text-sm text-red-500">{errors.titulo[0]}</p>} {/* Error para el título */}
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            placeholder="Descripción"
                            className="w-full rounded-md border border-gray-300 p-3 focus:ring focus:ring-blue-500"
                            required
                        />
                        {errors.descripcion && <p className="text-sm text-red-500">{errors.descripcion[0]}</p>} {/* Error para la descripción */}
                        <input
                            type="date"
                            name="fecha"
                            value={form.fecha}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-300 p-3 focus:ring focus:ring-blue-500"
                            required
                        />
                        {errors.fecha && <p className="text-sm text-red-500">{errors.fecha[0]}</p>} {/* Error para la fecha */}
                        <select
                            name="categoria"
                            value={form.categoria}
                            onChange={handleChange}
                            className="dark:bg-sidebar w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 focus:ring dark:border-white dark:text-gray-100"
                            required
                        >
                            <option value="">Selecciona una categoría</option>
                            {props.tipoDocumentos.map((tipoDocumento) => (
                                <option key={tipoDocumento.id} value={tipoDocumento.id}>
                                    {tipoDocumento.Nombre_tipo}
                                </option>
                            ))}
                        </select>
                        {errors.categoria && <p className="text-sm text-red-500">{errors.categoria[0]}</p>} {/* Error para la categoría */}
                        <PdfUploader onUpload={handleUpload} reset={preprocesado} />
                        <button type="submit" className="w-full rounded-md bg-blue-600 p-3 text-white transition-all hover:bg-blue-700">
                            Preprocesar Documento
                        </button>
                    </form>
                </div>
                {preprocesado && (
                    <div className="dark:bg-sidebar rounded-xl bg-white p-6 shadow-md">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resultados del Preprocesamiento</h3>
                        <p className="text-gray-500 dark:text-gray-400">Texto extraido:</p>

                        {/* <p className="text-gray-500 dark:text-gray-400">Método: {usarOCR ? 'OCR (Tesseract)' : 'Smalot/PdfParser'}</p> */}
                        <textarea
                            className="mt-2 w-full rounded-md border border-gray-300 p-3 focus:ring focus:ring-blue-500"
                            value={textoExtraido}
                            onChange={(e) => setTextoExtraido(e.target.value)} // Permite la edición del texto extraído
                            rows={20}
                        />
                        <div className="mt-4 flex gap-4">
                            <button
                                onClick={handleGuardar}
                                className="flex-1 rounded-md bg-green-600 p-3 text-white transition-all hover:bg-green-700"
                            >
                                Guardar
                            </button>
                            <button
                                onClick={handleReset}
                                className="flex-1 rounded-md bg-yellow-600 p-3 text-white transition-all hover:bg-yellow-700"
                            >
                                Volver a Intentar
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 rounded-md bg-red-600 p-3 text-white transition-all hover:bg-red-700"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
