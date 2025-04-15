export interface TipoDocumentoDetalle {
    id: number;
    Nombre: string;
    tipo_documento_id: number;
}

export interface TipoDocumento {
    id: number;
    Nombre_tipo: string;
    detalles?: TipoDocumentoDetalle[];
}

export interface DocumentosFormularioProps {
    tipoDocumento: TipoDocumento[];
}
