import { cn } from "@/lib/utils";
import React, { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import CustomAlert from "../CustomAlert";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
const mainVariant = {
    initial: {
        x: 0,
        y: 0,
    },
    animate: {
        x: 20,
        y: -20,
        opacity: 0.9,
    },
};

const secondaryVariant = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
    },
};

export const FileUpload = ({
    onChange,
}: {
    onChange?: (files: File[] | any) => void; // Cambié el tipo para permitir pasar cualquier dato
}) => {
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const handleFileChange = useCallback((newFiles: File[]) => {
        setFiles([newFiles[0]]);
        onChange?.(newFiles);
    }, [onChange]);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const { getRootProps, isDragActive } = useDropzone({
        multiple: false,
        noClick: true,
        onDrop: handleFileChange,
        onDropRejected: (error) => {
            console.log(error);
        },
        accept: {
            'application/pdf': []
        },
    });

    const handleUpload = useCallback(async () => {
        if (files.length === 0) {
            setAlert({ message: "No file selected", type: "error" });
            return;
        }

        setIsUploading(true);
        NProgress.start();

        try {
            const formData = new FormData();
            formData.append("file", files[0]);

            const response = await axios.post("/cargar-pdf", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setAlert({ message: response.data.mensaje || 'Archivo subido correctamente.', type: "success" });
        } catch (error: unknown) {
            setAlert({ message: 'Ocurrió un error al subir el archivo.', type: "error" });
        } finally {
            setIsUploading(false);
            NProgress.done();
        }
    }, [files]);


    return (
        <div className="w-full" {...getRootProps()}>
            <div>
                {alert && (
                    <CustomAlert
                        message={alert.message}
                        type={alert.type}
                        onClose={() => setAlert(null)}
                    />
                )}

            </div>
            <motion.div
                onClick={handleClick}
                whileHover="animate"
                className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
            >
                <input
                    ref={fileInputRef}
                    id="file-upload-handle"
                    type="file"
                    onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
                    className="hidden"
                    accept=".pdf"
                />
                <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
                    <GridPattern />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
                        Subir archivos
                    </p>
                    <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
                        Arrastre o suelte sus archivos aquí o haga clic para cargarlos
                    </p>
                    <div className="relative w-full mt-10 max-w-xl mx-auto">
                        {files.length > 0 && (
                            <motion.div
                                layoutId="file-upload"
                                variants={mainVariant}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                }}
                                className={cn(
                                    "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                                    "shadow-sm"
                                )}
                            >
                                <div className="flex justify-between w-full items-center gap-4">
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        layout
                                        className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs"
                                    >
                                        {files[0].name}
                                    </motion.p>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        layout
                                        className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-neutral-600 dark:bg-cyan-500 dark:text-white shadow-input"
                                    >
                                        {(files[0].size / (1024 * 1024)).toFixed(2)} MB
                                    </motion.p>
                                </div>

                                <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        layout
                                        className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 "
                                    >
                                        {files[0].type}
                                    </motion.p>

                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        layout
                                    >
                                        modified{" "}
                                        {new Date(files[0].lastModified).toLocaleDateString()}
                                    </motion.p>
                                </div>
                            </motion.div>
                        )}

                        {!files.length && (
                            <motion.div
                                layoutId="file-upload"
                                variants={mainVariant}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                }}
                                className={cn(
                                    "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                                    "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                                )}
                            >
                                {isDragActive ? (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-neutral-600 flex flex-col items-center"
                                    >
                                        Drop it
                                        <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                                    </motion.p>
                                ) : (
                                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>

            {files.length > 0 && (
                <div className="mt-4 text-center">
                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className={`px-6 py-2 text-white ${isUploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} rounded-lg`}
                    >
                        {isUploading ? (
                            <span>Cargando...</span>
                        ) : (
                            <span>Subir archivo</span>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export function GridPattern() {
    return (
    <div
    className="w-full h-full bg-gradient-to-r from-gray-300 to-gray-500 dark:from-blue-900 dark:to-blue-700"
    >
    </div>


    );
}


