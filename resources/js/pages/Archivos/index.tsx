import FormularioCard from '@/components/propios/FOrmularioCard';
import AppLayout from '@/layouts/app-layout';
import { DocumentosFormularioProps } from '@/types/interfaces';
import { Head } from '@inertiajs/react';
import { Book, FileArchive, FileText } from 'lucide-react';

export default function DocumentosFormulario(props: DocumentosFormularioProps) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Archivos', href: '/archivos' }]}>
            <Head title="Archivos" />

            <div className="flex flex-col gap-6 p-6">
                <div className="dark:bg-sidebar rounded-xl bg-white p-6 shadow-md">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Administración de Archivos</h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Carga los diferentes archivos en el sistema de gestión documental.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <FormularioCard
                        title="Formulario de Resoluciones"
                        description="Registrar resoluciones en el sistema."
                        href="/formulario/resoluciones"
                        Icon={FileText}
                    />
                    <FormularioCard
                        title="Formulario de Diplomas"
                        description="Carga de diplomas o títulos."
                        href="/formulario/diplomas"
                        Icon={Book}
                    />
                    <FormularioCard
                        title="Formulario de Convenios"
                        description="Carga de convenios."
                        href="/formulario/convenio"
                        Icon={FileArchive}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
