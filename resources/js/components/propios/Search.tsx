import { FC, useState } from 'react';

interface SearchProps {
    fields: string[]; // Los campos en los que se va a realizar la búsqueda
    onSearch: (searchTerm: string) => void; // Función para enviar el término de búsqueda
}

const Search: FC<SearchProps> = ({ fields, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <div className="mb-4 flex justify-start">
            <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-1/3 rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
        </div>
    );
};

export default Search;
