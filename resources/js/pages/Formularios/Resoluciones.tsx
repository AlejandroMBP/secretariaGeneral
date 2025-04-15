import CustomAlert from '@/components/CustomAlert';
import PdfUploader from '@/components/propios/PdfUploader';
import AppLayout from '@/layouts/app-layout';
import { DocumentosFormularioProps } from '@/types/interfaces';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import nProgress from 'nprogress';
import { useState } from 'react';

export default function ResolucionesFormulario(props: DocumentosFormularioProps) {
    const [formData, setFormData] = useState({
        titulo: '',
        numero: '',
        fecha: '',
        descripcion: '',
        tipoDocumentoId: '',
        detalleDocumentoId: '',
        archivo: null as File | null,
    });

    const [preprocesado, setPreprocesado] = useState(false);
    const [textoExtraido, setTextoExtraido] = useState('');
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [rutaTemporal, setRutaTemporal] = useState('');

    const handleUpload = (file: File) => {
        setFormData({ ...formData, archivo: file });
    };

    const handlePreprocesar = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.archivo) return;

        setCargando(true);
        nProgress.start();

        const formDataToSend = new FormData();
        formDataToSend.append('archivo', formData.archivo);

        try {
            const response = await axios.post('/documentos/preprocesar', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

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
            console.error('Error al guardar el documento:', error.response?.data || error.message);
            setAlert({ message: 'Error al guardar el documento', type: 'error' });
        } finally {
            nProgress.done();
        }
    };

    const tipoResolucion = props.tipoDocumento.find((tipo) => tipo.Nombre_tipo === 'Resolucion');

    return (
        <AppLayout breadcrumbs={[{ title: 'Resoluciones', href: '/formulario/resoluciones' }]}>
            <Head title="Formulario de Resoluciones" />

            {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Formulario de Resoluciones</h1>

                <form onSubmit={handlePreprocesar} className="space-y-4">
                    <div>
                        <label htmlFor="detalleDocumentoId" className="block text-sm font-medium text-gray-700 dark:text-white">
                            Detalle del Documento
                        </label>
                        <select
                            id="detalleDocumentoId"
                            name="detalleDocumentoId"
                            value={formData.detalleDocumentoId}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        >
                            <option value="">Seleccione un tipo</option>
                            {tipoResolucion?.detalles?.map((detalle) => (
                                <option key={detalle.id} value={detalle.id}>
                                    {detalle.Nombre}
                                </option>
                            )) || (
                                <option disabled value="">
                                    No hay detalles disponibles
                                </option>
                            )}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="numero" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Número de resolución
                            </label>
                            <input
                                type="text"
                                name="numero"
                                id="numero"
                                value={formData.numero}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        <div>
                            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Titulo de la resolución
                            </label>
                            <input
                                type="text"
                                name="titulo"
                                id="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Fecha
                            </label>
                            <input
                                type="date"
                                name="fecha"
                                id="fecha"
                                value={formData.fecha}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        <div>
                            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Lo que resuelve
                            </label>
                            <textarea
                                name="descripcion"
                                id="descripcion"
                                rows={4}
                                value={formData.descripcion}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                    </div>

                    <PdfUploader onUpload={handleUpload} reset={preprocesado} />

                    <button
                        type="submit"
                        disabled={cargando}
                        className={`w-full rounded-md p-3 text-white transition-all ${
                            cargando ? 'cursor-not-allowed bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {cargando ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                                Procesando...
                            </span>
                        ) : (
                            'Preprocesar Documento'
                        )}
                    </button>

                    {preprocesado && (
                        <div className="mt-6 rounded-lg bg-gray-50 p-4 shadow-md dark:bg-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resultado del Preprocesamiento</h3>
                            <textarea
                                value={textoExtraido}
                                onChange={(e) => setTextoExtraido(e.target.value)}
                                className="mt-2 w-full rounded-md border border-gray-300 p-3 focus:ring focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                rows={10}
                            />
                            <div className="mt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setPreprocesado(false)}
                                    className="w-full rounded-md bg-yellow-500 p-3 text-white hover:bg-yellow-600"
                                >
                                    Volver a Intentar
                                </button>

                                <button
                                    type="button"
                                    onClick={handleGuardar}
                                    className="w-full rounded-md bg-green-600 p-3 text-white hover:bg-green-700"
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-between">
                        <Link
                            href="/archivos"
                            className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                        >
                            Volver
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
