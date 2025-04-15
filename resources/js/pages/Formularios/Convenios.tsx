import CustomAlert from '@/components/CustomAlert';
import FloatingInput from '@/components/propios/FloatingImput';
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
        fecha_inicio: '',
        fecha_fin: '',
        adenda: '',
        tipoDocumentoId: '',
        detalleId: '',
        archivo: null as File | null,
    });

    const [preprocesado, setPreprocesado] = useState(false);
    const [textoExtraido, setTextoExtraido] = useState('');
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [rutaTemporal, setRutaTemporal] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
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
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setAlert({ message: 'Error al guardar el documento', type: 'error' });
            }
        } finally {
            setCargando(false);
            nProgress.done();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'tipoDocumentoId' ? { detalleId: '' } : {}),
        }));
    };

    const handleGuardar = async () => {
        nProgress.start();
        const datos = new FormData();
        datos.append('titulo', formData.titulo);
        datos.append('fecha_inicio', formData.fecha_inicio);
        datos.append('fecha_fin', formData.fecha_fin);
        datos.append('adenda', formData.adenda);
        datos.append('ruta_temporal', rutaTemporal);
        datos.append('detalleDocumentoId', formData.detalleId);
        datos.append('tipoDocumentoId', formData.tipoDocumentoId);
        datos.append('texto_extraido', textoExtraido);
        try {
            await axios.post('/formulario/convenio/guardar', datos, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setAlert({ message: 'Documento guardado exitosamente', type: 'success' });
            setPreprocesado(false);
            setTextoExtraido('');
            setFormData({
                titulo: '',
                fecha_inicio: '',
                fecha_fin: '',
                adenda: '',
                tipoDocumentoId: '',
                detalleId: '',
                archivo: null,
            });
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
    const tipoSeleccionado = props.tipoDocumento.find((tipo) => tipo.id === Number(formData.tipoDocumentoId));

    const mostrarSegundoSelect = ![
        'TÍTULOS PROFESIONALES',
        'CERTIFICADOS SUPLETORIO',
        'TITULOS PROFESIONALES POR REVALIDACIÓN',
        'DIPLOMAS ACADÉMICOS',
    ].includes(tipoSeleccionado?.Nombre_tipo || '');
    return (
        <AppLayout breadcrumbs={[{ title: 'Convenios', href: '/formulario/convenio' }]}>
            <Head title="Formulario de convenios" />
            {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Formulario de convenios</h1>

                <form onSubmit={handlePreprocesar} className="dark:bg-sidebar space-y-4 rounded-xl bg-white p-6 shadow-md">
                    <select
                        id="tipoDocumentoId"
                        name="tipoDocumentoId"
                        value={formData.tipoDocumentoId}
                        onChange={handleChange}
                        className="dark:bg-sidebar w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 focus:ring dark:border-white dark:text-gray-100"
                    >
                        <option value="">Seleccione un tipo de Convenio</option>
                        {props.tipoDocumento.map((tipo) => (
                            <option key={tipo.id} value={String(tipo.id)}>
                                {tipo.Nombre_tipo}
                            </option>
                        ))}
                    </select>

                    {mostrarSegundoSelect && (
                        <select
                            id="detalleId"
                            name="detalleId"
                            value={formData.detalleId}
                            onChange={handleChange}
                            className="dark:bg-sidebar w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 focus:ring dark:border-white dark:text-gray-100"
                            disabled={!formData.tipoDocumentoId}
                        >
                            <option value="">Espesifique el convenio</option>
                            {tipoSeleccionado?.detalles?.map((detalle) => (
                                <option key={detalle.id} value={String(detalle.id)}>
                                    {detalle.Nombre}
                                </option>
                            ))}
                        </select>
                    )}

                    <div className="grid grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-2">
                        <FloatingInput
                            id="titulo"
                            name="titulo"
                            label="Titulo de convenio"
                            value={formData.titulo}
                            onChange={handleChange}
                            required
                            error={errors.titulo ? errors.titulo[0] : ''}
                        />
                        <FloatingInput
                            id="fecha_inicio"
                            name="fecha_inicio"
                            label="Fecha inicio"
                            value={formData.fecha_inicio}
                            onChange={handleChange}
                            required
                            type="date"
                            error={errors.fecha_inicio ? errors.fecha_inicio[0] : ''}
                        />
                        <FloatingInput
                            id="fecha_fin"
                            name="fecha_fin"
                            label="Fecha fin"
                            value={formData.fecha_fin}
                            onChange={handleChange}
                            required
                            type="date"
                            error={errors.fecha_fin ? errors.fecha_fin[0] : ''} // Pasamos el error si existe
                        />
                        <FloatingInput
                            id="adenda"
                            name="adenda"
                            label="Adenda"
                            value={formData.adenda}
                            onChange={handleChange}
                            type="date"
                            error={errors.adenda ? errors.adenda[0] : ''}
                        />
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
