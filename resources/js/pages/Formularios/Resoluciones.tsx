import CustomAlert from '@/components/CustomAlert';
import FloatingInput from '@/components/propios/FloatingImput';
import FloatingTextarea from '@/components/propios/FloatingTextarea';
import { useResolucionesForm } from '@/components/propios/handlers/useResolucionesFormulario';
import PdfUploader from '@/components/propios/PdfUploader';
import AppLayout from '@/layouts/app-layout';
import { DocumentosFormularioProps } from '@/types/interfaces';
import { Head, Link } from '@inertiajs/react';

export default function ResolucionesFormulario(props: DocumentosFormularioProps) {
    const {
        formData,
        handleChange,
        handleUpload,
        handlePreprocesar,
        handleGuardar,
        preprocesado,
        setPreprocesado,
        textoExtraido,
        setTextoExtraido,
        cargando,
        alert,
        setAlert,
        errors,
        tipoResolucion,
    } = useResolucionesForm({ tipoDocumento: props.tipoDocumento });

    return (
        <AppLayout breadcrumbs={[{ title: 'Resoluciones', href: '/formulario/resoluciones' }]}>
            <Head title="Formulario de Resoluciones" />

            {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Formulario de Resoluciones</h1>

                <form onSubmit={handlePreprocesar} className="dark:bg-sidebar space-y-4 rounded-xl bg-white p-6 shadow-md">
                    <div>
                        <select
                            id="detalleDocumentoId"
                            name="detalleDocumentoId"
                            value={formData.detalleDocumentoId}
                            onChange={handleChange}
                            className="dark:bg-sidebar w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 focus:ring dark:border-white dark:text-gray-100"
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
                        <FloatingInput
                            id="numero"
                            name="numero"
                            label="Numero resolucion"
                            value={formData.numero}
                            type="number"
                            onChange={handleChange}
                            required
                            error={errors.numero ? errors.numero[0] : ''}
                        />
                        <FloatingInput
                            id="titulo"
                            name="titulo"
                            label="Titulo de la resolución"
                            value={formData.titulo}
                            onChange={handleChange}
                            required
                            error={errors.titulo ? errors.titulo[0] : ''}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FloatingInput
                            id="fecha"
                            name="fecha"
                            label="Gestion de resolución"
                            value={formData.fecha}
                            onChange={handleChange}
                            required
                            type="date"
                            error={errors.fecha ? errors.fecha[0] : ''}
                        />
                        <FloatingTextarea
                            id="descripcion"
                            name="descripcion"
                            label="Gestion de resolución"
                            value={formData.descripcion}
                            onChange={handleChange}
                            required
                            error={errors.descripcion ? errors.descripcion[0] : ''}
                            rows={6}
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
