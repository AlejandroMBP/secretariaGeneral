import CustomAlert from '@/components/CustomAlert';
import EditAnti from '@/components/propios/AntiAutonomistaModal';
import EditAutoridad from '@/components/propios/AutoridadesModal';
import EditConvenios from '@/components/propios/ConveniosModal';
import EditModalBachiller from '@/components/propios/EditarModalBachiller';
import { createTableHandlers } from '@/components/propios/handlers/useTableHandlers';
import Pagination from '@/components/propios/Pagination';
import PDFViewerModal from '@/components/propios/PDFModal';
import Search from '@/components/propios/Search';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { MoreHorizontal, Pencil, Printer, ScanEye, Trash } from 'lucide-react';
import { useState } from 'react';
import EditModal from './EditarModal';

interface TableComponentProps {
    headers: { label: string; key: string }[];
    data: any[];
    itemsPerPage?: number;
    apiEndpoint?: string;
    tipoDocumento: string;
    customEditHandler?: (data: any) => Promise<void>;
    customDeleteHandler?: (id: number) => Promise<void>;
}

const TableComponent: React.FC<TableComponentProps> = ({
    headers,
    data,
    itemsPerPage = 5,
    tipoDocumento,
    apiEndpoint,
    customEditHandler,
    customDeleteHandler,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [dataState, setData] = useState<any[]>(data);

    const filteredData = dataState.filter((row) => {
        return headers.some((header) => {
            const fieldValue = row[header.key];
            if (typeof fieldValue === 'string') {
                return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return false;
        });
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const { handleViewPDF, handlePrint, handleEdit, handleDelete, handleSaveEdit, handleSearch, handlePageChange } = createTableHandlers({
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
    });

    const renderEditModal = () => {
        switch (tipoDocumento) {
            case 'bachiller':
                return (
                    <EditModalBachiller
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        onSave={handleSaveEdit}
                        data={selectedRow || {}}
                        errors={validationErrors}
                    />
                );
            case 'academicos':
                return (
                    <EditModalBachiller
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        onSave={handleSaveEdit}
                        data={selectedRow || {}}
                        errors={validationErrors}
                    />
                );

            case 'resoluciones':
                return (
                    <EditModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        onSave={handleSaveEdit}
                        data={selectedRow || {}}
                        errors={validationErrors}
                    />
                );
            case 'convenios':
                return (
                    <EditConvenios
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        onSave={handleSaveEdit}
                        data={selectedRow || {}}
                        errors={validationErrors}
                    />
                );
            case 'antiAutonomista':
                return (
                    <EditAnti
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        onSave={handleSaveEdit}
                        data={selectedRow || {}}
                        errors={validationErrors}
                    />
                );
            case 'autoridades':
                return (
                    <EditAutoridad
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        onSave={handleSaveEdit}
                        data={selectedRow || {}}
                        errors={validationErrors}
                    />
                );
            default:
                return (
                    <EditModalBachiller
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        onSave={handleSaveEdit}
                        data={selectedRow || {}}
                        errors={validationErrors}
                    />
                );
        }
    };

    return (
        <div>
            <Search onSearch={handleSearch} />
            {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map((header, index) => (
                            <TableHead key={index}>{header.label}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentItems.map((row, rowIndex) => (
                        <TableRow key={row.id}>
                            {headers.map((header) => (
                                <TableCell key={header.key} className="max-w-[200px] truncate overflow-hidden break-words text-ellipsis">
                                    {header.key === 'nro' ? (
                                        rowIndex + 1 + indexOfFirstItem
                                    ) : header.key === 'acciones' ? (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="rounded-full p-2 transition hover:bg-gray-200 dark:hover:bg-gray-700">
                                                <MoreHorizontal className="cursor-hover-effect h-5 w-5 text-gray-500 dark:text-gray-400" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="rounded-lg border border-gray-300 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800"
                                            >
                                                <DropdownMenuItem
                                                    onClick={() => handleEdit(row)}
                                                    className="flex cursor-pointer items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    <Pencil className="h-4 w-4 text-green-500" />
                                                    <span>Editar</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(row.id)}
                                                    className="flex cursor-pointer items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    <Trash className="h-4 w-4 text-red-500" />
                                                    <span>Eliminar</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handlePrint(row.ruta_de_guardado)}
                                                    className="flex cursor-pointer items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    <Printer className="h-4 w-4 text-purple-500" />
                                                    <span>Imprimir</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleViewPDF(row.ruta_de_guardado)}
                                                    className="flex cursor-pointer items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    <ScanEye className="h-4 w-4 text-yellow-500" />
                                                    <span>Ver PDF</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ) : (
                                        <span title={row[header.key]}>{row[header.key]}</span>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

            {/* Renderizar el modal correspondiente */}
            {renderEditModal()}

            {pdfUrl && <PDFViewerModal fileUrl={pdfUrl} onClose={() => setPdfUrl(null)} />}
        </div>
    );
};

export default TableComponent;
