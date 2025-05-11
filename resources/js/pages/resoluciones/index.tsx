import FormularioCard from '@/components/propios/FOrmularioCard';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Gavel, ScrollText } from 'lucide-react';

export default function DocumentosFormulario() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Resoluciones', href: '/resoluciones' }]}>
            <Head title="Resoluciones" />

            <div className="flex flex-col gap-6 p-6">
                <div className="dark:bg-sidebar rounded-xl bg-white p-6 shadow-md">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Gestor de Resoluciones</h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Gestión de documentos resolutivos oficiales de la institución universitaria.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <FormularioCard
                        title="Resoluciones de H.C.U."
                        description="Documentos oficiales del Honorable Consejo Universitario"
                        href="/Hcu-listar"
                        Icon={Gavel}
                    />
                    <FormularioCard
                        title="Resoluciones rectorales"
                        description="Documentos y decisiones emitidas por el Rectorado"
                        href="/Rectorales-listar"
                        Icon={ScrollText}
                    />
                    <FormularioCard
                        title="Resoluciones A.G.D.E"
                        description="Documentos emitidas por A.G.D.E."
                        href="/Agde-listar"
                        Icon={ScrollText}
                    />
                    <FormularioCard
                        title="Resoluciones de congreso"
                        description="Documentos emitidas por congreso."
                        href="/Congreso-listar"
                        Icon={ScrollText}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
