import axios from 'axios';
import nProgress from 'nprogress';
import React from 'react';

interface AlertProps {
    message: string;
    type: 'success' | 'error' | 'info';
}

interface HandlersProps {
    setPdfUrl: (url: string | null) => void;
    setAlert: (alert: AlertProps) => void;
    setSelectedRow: (row: any | null) => void;
    setIsEditModalOpen: (value: boolean) => void;
    setValidationErrors: (errors: Record<string, string[]>) => void;
    setSearchTerm: (term: string) => void;
    setCurrentPage: (page: number) => void;
    setData: React.Dispatch<React.SetStateAction<any[]>>;
    apiEndpoint?: string; // Nueva prop para la ruta base de la API
    customEditHandler?: (data: any) => Promise<void>; // Manejador personalizado opcional
    customDeleteHandler?: (id: number) => Promise<void>; // Manejador personalizado para eliminar
}

export const createTableHandlers = ({
    setPdfUrl,
    setAlert,
    setSelectedRow,
    setIsEditModalOpen,
    setValidationErrors,
    setSearchTerm,
    setCurrentPage,
    setData,
    apiEndpoint,
    customEditHandler,
    customDeleteHandler,
}: HandlersProps) => {
    const handleViewPDF = async (ruta: string) => {
        try {
            nProgress.start();
            const response = await axios.post(route('documentos.verPDFImagen'), { ruta });
            const PDF = response.data.url;
            setPdfUrl(PDF);
            setAlert({ message: 'Documento abierto', type: 'success' });
        } catch (error) {
            setAlert({ message: 'Error al abrir el documento.', type: 'error' });
        } finally {
            nProgress.done();
        }
    };

    const handlePrint = (ruta: string) => {
        try {
            nProgress.start();
            let printFrame = document.getElementById('print-frame') as HTMLIFrameElement;
            if (!printFrame) {
                printFrame = document.createElement('iframe');
                printFrame.id = 'print-frame';
                printFrame.style.position = 'absolute';
                printFrame.style.width = '0px';
                printFrame.style.height = '0px';
                printFrame.style.border = 'none';
                document.body.appendChild(printFrame);
            }

            printFrame.src = `/storage/${ruta}`;
            printFrame.onload = () => {
                printFrame.contentWindow?.focus();
                printFrame.contentWindow?.print();
            };

            setAlert({ message: 'Documento listo para impresión.', type: 'success' });
        } catch (error) {
            setAlert({ message: 'Paso algo al intentar la impresión.', type: 'error' });
        } finally {
            nProgress.done();
        }
    };

    const handleEdit = (row: any) => {
        setSelectedRow(row);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        try {
            nProgress.start();

            if (customDeleteHandler) {
                await customDeleteHandler(id);
            } else if (apiEndpoint) {
                await axios.delete(`${apiEndpoint}/${id}`);
            } else {
                throw new Error('No se configuró un endpoint para eliminar');
            }

            setData((prevData) => prevData.filter((item) => item.id !== id));
            setAlert({ message: 'Registro eliminado con éxito', type: 'success' });
        } catch (error: any) {
            setAlert({
                message: error.response?.data?.message || 'Error al eliminar el registro',
                type: 'error',
            });
        } finally {
            nProgress.done();
        }
    };

    const handleSaveEdit = async (editedData: any) => {
        try {
            nProgress.start();

            if (customEditHandler) {
                await customEditHandler(editedData);
            } else if (apiEndpoint) {
                const response = await axios.put(`${apiEndpoint}/${editedData.id}`, editedData);

                // Actualizar los datos en el estado
                setData((prevData) => prevData.map((item) => (item.id === editedData.id ? response.data : item)));
            } else {
                throw new Error('No se configuró un endpoint para guardar los cambios');
            }

            setAlert({ message: 'Cambios guardados con éxito', type: 'success' });
            setIsEditModalOpen(false);
            window.location.reload();
        } catch (error: any) {
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors);
            } else {
                setAlert({
                    message: error.response?.data?.message || 'Error al guardar los cambios',
                    type: 'error',
                });
            }
        } finally {
            nProgress.done();
        }
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return {
        handleViewPDF,
        handlePrint,
        handleEdit,
        handleDelete,
        handleSaveEdit,
        handleSearch,
        handlePageChange,
    };
};
