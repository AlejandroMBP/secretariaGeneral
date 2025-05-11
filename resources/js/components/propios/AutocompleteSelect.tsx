import { Combobox, ComboboxOption } from '@headlessui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface AutocompleteSelectProps {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    error?: string;
    fetchUrl: string;
}

interface ResolucionOption {
    id: string;
    numero_resolucion: string;
    display_text: string;
}

export default function AutocompleteSelect({ id, name, label, value, onChange, required = false, error, fetchUrl }: AutocompleteSelectProps) {
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState<ResolucionOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (query.length > 1) {
            const timer = setTimeout(() => {
                fetchOptions(query);
            }, 300);

            return () => clearTimeout(timer);
        } else {
            setOptions([]);
        }
    }, [query]);

    const fetchOptions = async (search: string) => {
        try {
            setLoading(true);
            const response = await axios.get(`${fetchUrl}?search=${search}`);
            setOptions(response.data.data);
        } catch (err) {
            console.error('Error fetching options:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full">
            <Combobox as="div" value={value} onChange={onChange}>
                <div className="relative">
                    <Combobox.Input
                        id={id}
                        name={name}
                        className={`peer dark:bg-sidebar block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 pt-5 pb-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 dark:border-white dark:text-white dark:focus:border-blue-400 ${
                            value ? 'has-value' : ''
                        } ${error ? 'border-red-500' : ''}`}
                        onChange={(event) => setQuery(event.target.value)}
                        displayValue={(value: string) => {
                            const selected = options.find((opt) => opt.id === value);
                            return selected ? selected.display_text : '';
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />

                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {loading ? (
                            <svg className="h-5 w-5 animate-spin text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        ) : (
                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                    </Combobox.Button>

                    <label
                        htmlFor={id}
                        className={`absolute start-3 top-1 z-10 origin-[0] -translate-y-3 scale-75 transform rounded-4xl border-transparent bg-white px-3 text-sm text-gray-500 duration-300 ${
                            value || isFocused
                                ? 'top-1 -translate-y-3 scale-75 peer-focus:text-blue-600 dark:peer-focus:text-blue-400'
                                : 'top-3.5 translate-y-0 scale-100'
                        } dark:bg-sidebar peer-focus:top-1 peer-focus:-translate-y-3 peer-focus:scale-75 dark:text-gray-300`}
                    >
                        {label} {loading && '(Cargando...)'}
                    </label>
                </div>

                <Combobox.Options className="ring-opacity-5 dark:bg-sidebar absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black focus:outline-none">
                    {loading ? (
                        <div className="relative cursor-default px-4 py-2 text-gray-700 select-none dark:text-gray-300">Buscando...</div>
                    ) : options.length === 0 ? (
                        <div className="relative cursor-default px-4 py-2 text-gray-700 select-none dark:text-gray-300">
                            {query.length > 1 ? 'No se encontraron resultados' : 'Escribe para buscar...'}
                        </div>
                    ) : (
                        options.map((item) => (
                            <ComboboxOption
                                key={item.id}
                                value={item.id}
                                className={({ active }) =>
                                    `relative cursor-default py-2 pr-9 pl-3 select-none ${
                                        active ? 'bg-blue-600 text-white' : 'text-gray-900 dark:text-white'
                                    }`
                                }
                            >
                                {item.display_text}
                            </ComboboxOption>
                        ))
                    )}
                </Combobox.Options>
            </Combobox>

            {error && <p className="mt-2 text-xs text-red-500 dark:text-red-400">{error}</p>}
        </div>
    );
}
