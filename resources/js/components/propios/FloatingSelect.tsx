import React from 'react';

interface FloatingSelectProps {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    error?: string;
    options: { value: string; label: string }[];
}

const FloatingSelect: React.FC<FloatingSelectProps> = ({ id, name, label, value, onChange, required = false, error, options }) => {
    return (
        <div className="relative w-full">
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="peer dark:bg-sidebar block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 pt-5 pb-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 dark:border-white dark:text-white dark:focus:border-blue-400"
            >
                <option value="" disabled hidden>
                    Seleccione una opción
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <label
                htmlFor={id}
                className="dark:bg-sidebar absolute start-3 top-1 z-10 origin-[0] -translate-y-3 scale-75 transform rounded-4xl border-transparent bg-white px-3 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-300 dark:peer-focus:text-blue-400"
            >
                {label}
            </label>
            {error && <p className="mt-2 text-xs text-red-500 dark:text-red-400">{error}</p>}
        </div>
    );
};

export default FloatingSelect;
