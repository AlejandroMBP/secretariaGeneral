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
            const response = await axios.delete(route('documentos.eliminar', id));
            setData((prevData) => prevData.filter((item) => item.id !== id));
            setAlert({ message: response.data.message, type: 'success' });
        } catch (error) {
            setAlert({ message: 'Algo pasó al eliminar el archivo, inténtelo más tarde.', type: 'error' });
        } finally {
            nProgress.done();
        }
    };

    const handleSaveEdit = async (updatedData: any) => {
        try {
            nProgress.start();
            const response = await axios.put(route('documento.editar'), updatedData);
            setData((prevData) => prevData.map((item) => (item.id === updatedData.id ? { ...item, ...updatedData } : item)));
            setAlert({ message: 'Editado satisfactoriamente.', type: 'success' });
            setValidationErrors({});
            setIsEditModalOpen(false);
        } catch (error: any) {
            if (error.response && error.response.status === 422) {
                setValidationErrors(error.response.data.errors);
            } else {
                setAlert({ message: 'Error al editar el documento.', type: 'error' });
            }
            console.error('Error al guardar los cambios:', error);
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
