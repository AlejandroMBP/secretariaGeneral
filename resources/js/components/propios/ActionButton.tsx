import React from 'react';

type AntiAutonomistaButtonProps = {
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
};

const ButtonAction: React.FC<AntiAutonomistaButtonProps> = ({ onClick, className = '', children = 'Registrar a Anti-Autonomista' }) => {
    return (
        <button onClick={onClick} className={`rounded-lg bg-gray-200 px-4 py-2 text-black transition hover:bg-gray-400 ${className}`}>
            {children}
        </button>
    );
};
export default ButtonAction;
