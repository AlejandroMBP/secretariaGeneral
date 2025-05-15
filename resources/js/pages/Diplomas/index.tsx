import FormularioCard from '@/components/propios/FOrmularioCard';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Award, BookMarked, BookOpenCheck, FileBadge, FileCheck, GraduationCap } from 'lucide-react';

export default function DocumentosFormulario() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Diplomas', href: '/diplomas' }]}>
            <Head title="Diplomas" />

            <div className="flex flex-col gap-6 p-6">
                <div className="dark:bg-sidebar rounded-xl bg-white p-6 shadow-md">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Gestor de Diplomas</h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Carga los diferentes archivos en el sistema de gestión documental.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <FormularioCard
                        title="Diplomas de Bachilleres"
                        description="Gestión de diplomas de nivel bachillerato"
                        href="/Bachiller-listar"
                        Icon={GraduationCap}
                    />
                    <FormularioCard
                        title="Diplomas Académicos"
                        description="Gestión de diplomas académicos varios"
                        href="/Academicos-listar"
                        Icon={Award}
                    />
                    <FormularioCard
                        title="Diplomas profesionales"
                        description="Gestión de diplomas de titulación profesional"
                        href="/Profesionales-listar"
                        Icon={BookOpenCheck}
                    />
                    <FormularioCard
                        title="Diplomas de post grado"
                        description="Gestión de diplomas de postgrado y maestrías"
                        href="/post-grado-listar"
                        Icon={BookMarked}
                    />
                    <FormularioCard
                        title="Títulos por revalidación"
                        description="Gestión de títulos profesionales por revalidación"
                        href="/relevacion-listar"
                        Icon={FileBadge}
                    />
                    <FormularioCard
                        title="Certificados supletorios"
                        description="Gestión de certificados supletorios y especiales"
                        href="/supletorio-listar"
                        Icon={FileCheck}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
