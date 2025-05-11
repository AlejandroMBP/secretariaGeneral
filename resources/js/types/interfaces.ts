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

export interface Documento {
    id: number;
    tipo_documento: string;
    texto: string;
    tipo: string;
    gestion_resolucion: string;
    gestion: string;
    usuario: { name: string };
    ruta: string;
    created_at: string;
    numero_resolucion: number;
    numero_serie: string;
    carrera: string;
    cedula_de_identidad: string;
    anti_tipo: string;
    autoridad_tipo_posicio: string;
    resolucion_nombre: string;
    convenio_titulo: string;
    diploma_nombre: string;
    anti_nombre: string;
    autoridad_nombre: string;
    resolucion_lo_que_resuelve: string;
    fecha_inicio: string;
    fecha_fin: string;
    adenda: string;
    fecha_nacimiento: string;
    fecha_emision: string;
}
