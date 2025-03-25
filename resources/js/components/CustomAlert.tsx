import React, { useEffect, useState } from 'react';

interface CustomAlertProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, type, onClose }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        // Cierra la alerta después de 3 segundos (3000 ms)
        const timer = setTimeout(() => {
            setShow(false);
            setTimeout(onClose, 300); // Llama a onClose después del efecto de desaparición
        }, 3000);

        return () => clearTimeout(timer); // Limpia el timer si el componente se desmonta
    }, [onClose]);

    const getAlertStyle = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            case 'info':
                return 'bg-blue-500 text-white';
            default:
                return '';
        }
    };

    return (
        show && (
            <div
                className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg ${getAlertStyle()} z-50
                    transition-opacity duration-500 ease-in-out opacity-100 transform
                    ${show ? 'scale-100' : 'scale-95 opacity-0'}`}
            >
                <div className="flex items-center justify-between">
                    <span>{message}</span>
                    <button onClick={() => { setShow(false); setTimeout(onClose, 300); }} className="ml-4 text-lg font-bold text-white">
                        &times;
                    </button>
                </div>
            </div>
        )
    );
};

export default CustomAlert;
