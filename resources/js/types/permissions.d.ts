type AppPermissions =
    | 'ver usuarios'
    | 'crear usuarios'
    | 'editar usuarios'
    | 'eliminar usuarios'
    | 'ver roles'
    | 'crear roles'
    | 'editar roles'
    | 'eliminar roles'
    | 'ver documentos'
    | 'crear documentos'
    | 'editar documentos'
    | 'eliminar documentos'
    | 'ver cargar_documentos'
    | 'crear cargar_documentos'
    | 'eliminar cargar_documentos'
    | 'ver resoluciones'
    | 'crear resoluciones'
    | 'editar resoluciones'
    | 'eliminar resoluciones'
    | 'ver Bachiller'
    | 'crear Bachiller'
    | 'editar Bachiller'
    | 'eliminar Bachiller'
    | 'ver Academicos'
    | 'crear Academicos'
    | 'editar Academicos'
    | 'eliminar Academicos'
    | 'ver AntiAutonomistas'
    | 'crear AntiAutonomistas'
    | 'editar AntiAutonomistas'
    | 'eliminar AntiAutonomistas'
    | 'ver Autoridades'
    | 'crear Autoridades'
    | 'editar Autoridades'
    | 'eliminar Autoridades'
    | 'ver Profesionales'
    | 'crear Profesionales'
    | 'editar Profesionales'
    | 'eliminar Profesionales'
    | 'ver Hcu'
    | 'crear Hcu'
    | 'editar Hcu'
    | 'eliminar Hcu'
    | 'ver Rectorales'
    | 'crear Rectorales'
    | 'editar Rectorales'
    | 'eliminar Rectorales'
    | 'ver Convenios'
    | 'crear Convenios'
    | 'editar Convenios'
    | 'eliminar Convenios'
    | 'ver Consejeros'
    | 'crear Consejeros'
    | 'editar Consejeros'
    | 'eliminar Consejeros';
declare module '@inertiajs/core' {
    interface PageProps {
        auth: {
            user: {
                id: number;
                name: string;
                email: string;
                permissions: AppPermissions[];
                roles?: string[]; // Opcional
            } | null;
        };
    }
}
