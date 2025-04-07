import React, { useEffect, useState } from 'react';

interface CustomAlertProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, type, onClose }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            setTimeout(onClose, 300);
        }, 3000);

        return () => clearTimeout(timer);
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
                className={`fixed top-5 right-5 rounded-lg p-4 shadow-lg ${getAlertStyle()} z-50 transform opacity-100 transition-opacity duration-500 ease-in-out ${show ? 'scale-100' : 'scale-95 opacity-0'}`}
            >
                <div className="flex items-center justify-between">
                    <span>{message}</span>
                    <button
                        onClick={() => {
                            setShow(false);
                            setTimeout(onClose, 300);
                        }}
                        className="ml-4 text-lg font-bold text-white"
                    >
                        &times;
                    </button>
                </div>
            </div>
        )
    );
};

export default CustomAlert;
