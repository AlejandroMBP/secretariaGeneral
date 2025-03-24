import { motion, AnimatePresence } from "framer-motion";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={onClose} // Cerrar modal al hacer clic fuera
                >
                    <motion.div
                        className="bg-white dark:bg-sidebar p-6 rounded-xl shadow-lg w-full max-w-md border-2 border-b-blue-900"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        role="dialog"
                        aria-modal="true"
                        onClick={(e) => e.stopPropagation()} // Evita que el modal se cierre al hacer clic dentro
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">{title}</h2>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 flex items-center justify-center rounded-full
               text-gray-500 transition-all duration-300 ease-in-out
               hover:text-black hover:bg-gray-200
               dark:hover:text-gray-300 dark:hover:bg-gray-700"
                                aria-label="Cerrar"
                            >
                                ✕
                            </button>


                        </div>
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
