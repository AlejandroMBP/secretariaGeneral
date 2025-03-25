import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
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
    const handleFileChange = (newFiles: File[]) => {
        setFiles([newFiles[0]]);
        onChange && onChange(newFiles);
        console.log(newFiles);
    };

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

    const handleUpload = async () => {
        if (files.length === 0) {
            setAlert({ message: "No file selected", type: "error" });
            return;
        }

        const formData = new FormData();
        formData.append("file", files[0]);
        setIsUploading(true);
        NProgress.start();
        try {
            const response = await axios.post("/cargar-pdf", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },

            });

            console.log("Archivo subido correctamente:", response.data);
            setAlert({ message: response.data.mensaje || 'Archivo subido correctamente.', type: "success" });
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setAlert({ message: `Error al subir el archivo: ${error.response?.data?.message || error.message}`, type: "error" });
            } else {
                setAlert({ message: 'Ocurrió un error desconocido.', type: "error" });
            }
        } finally {
            setIsUploading(false);
            NProgress.done();
        }
    };

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
                className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden bg-blue-950"
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
                        Upload file
                    </p>
                    <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
                        Drag or drop your files here or click to upload
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
    const columns = 41;
    const rows = 11;

    return (
        <div className="flex bg-cyan-300 dark:bg-neutral-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
            {Array.from({ length: rows }).map((_, row) =>
                Array.from({ length: columns }).map((_, col) => {
                    const index = row * columns + col;
                    return (
                        <div
                            key={`${col}-${row}`}
                            className={`w-10 h-10 flex shrink-0 rounded-[2px] ${index % 2 === 0
                                ? "bg-cyan-400 dark:bg-cyan-800"
                                : "bg-white dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"}`} />
                    );
                })
            )}
        </div>
    );
}

