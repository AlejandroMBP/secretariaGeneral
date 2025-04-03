import Pagination from '@/components/propios/Pagination';
import PDFViewerModal from '@/components/propios/PDFModal';
import Search from '@/components/propios/Search';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import axios from 'axios';
import { MoreHorizontal, Pencil, Printer, ScanEye, Trash } from 'lucide-react';
import { useState } from 'react';
interface TableComponentProps {
    headers: { label: string; key: string }[]; // Cabeceras con 'label' y 'key'
    data: any[]; // Los datos de la tabla
    itemsPerPage?: number; // Cantidad de elementos por página
}

const TableComponent: React.FC<TableComponentProps> = ({ headers, data, itemsPerPage = 5 }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filtrar los datos en función del término de búsqueda
    const filteredData = data.filter((row) => {
        return headers.some((header) => {
            const fieldValue = row[header.key];
            if (typeof fieldValue === 'string') {
                return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return false; // Si el valor no es un string, no se incluye en la búsqueda
        });
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1); // Resetear a la primera página después de realizar la búsqueda
    };
    const handleEdit = (row: any) => {
        console.log('Editar', row);
        // Aquí puedes abrir un modal o redirigir a otra vista de edición
    };

    const handleDelete = (id: number) => {
        console.log('Eliminar ID:', id);
        // Aquí puedes agregar la lógica de eliminación
    };
    const handlePrint = (ruta: string) => {
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
    };
    const handleViewPDF = async (ruta: string) => {
        try {
            const response = await axios.post(route('documentos.verPDFImagen'), { ruta });
            const PDF = response.data.url;
            setPdfUrl(PDF);
            if (PDF) {
                // window.open(PDF, '_blank');
                // setIsModalOpen(true);
                setPdfUrl(PDF);
            }
            console.log('Respuesta del servidor:', PDF);
        } catch (error) {
            console.error('Error en la petición:', error);
        }
    };

    return (
        <div>
            <Search fields={headers.map((header) => header.label)} onSearch={handleSearch} />

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
                                                <MoreHorizontal className="h-5 w-5 text-gray-500 dark:text-gray-400" />
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
            {isModalOpen && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-gray-700/10">
                    <div className="w-full max-w-4xl rounded-lg bg-transparent p-5 shadow-lg">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 text-5xl text-gray-500 hover:text-gray-700">
                            ×
                        </button>
                        <iframe src={pdfUrl || ''} width="100%" height="600px" frameBorder="0" title="PDF Viewer" />
                    </div>
                </div>
            )}
            {pdfUrl && <PDFViewerModal fileUrl={pdfUrl} onClose={() => setPdfUrl(null)} />}
        </div>
    );
};

export default TableComponent;
