// interface de los tipos de documetnos
export interface TipoDocumento {
    id: number;
    Nombre_tipo: string;
}

export interface DocumentosFormularioProps {
    tipoDocumentos: TipoDocumento[];
}
