import React from 'react';
import ReactCompareImage from 'react-compare-image';

interface ImageCompareProps {
    originalImage: string;
    ocrImage: string;
}

const ImageCompare: React.FC<ImageCompareProps> = ({ originalImage, ocrImage }) => {
    return (
        <div className="mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Comparación de Imágenes</h3>
            <p className="text-gray-600 dark:text-gray-300">Desliza para ver las diferencias entre la imagen original y la procesada por OCR.</p>
            <div className="mt-4">
                <ReactCompareImage leftImage={originalImage} rightImage={ocrImage} />
            </div>
        </div>
    );
};

export default ImageCompare;
