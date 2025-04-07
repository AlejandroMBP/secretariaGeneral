import React, { useEffect } from 'react';

const CursorFollower: React.FC = () => {
    useEffect(() => {
        // Crear el círculo que sigue al cursor
        const cursor = document.createElement('div');
        cursor.classList.add('cursor-follower');
        document.body.appendChild(cursor);

        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        const speed = 0.08;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.pageX;
            mouseY = e.pageY;
        };

        const updateCursorPosition = () => {
            currentX += (mouseX - currentX) * speed;
            currentY += (mouseY - currentY) * speed;

            cursor.style.left = `${currentX}px`;
            cursor.style.top = `${currentY}px`;

            requestAnimationFrame(updateCursorPosition);
        };

        document.addEventListener('mousemove', handleMouseMove);
        updateCursorPosition();

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.body.removeChild(cursor);
        };
    }, []);

    return null; // No es necesario retornar un div aquí, el círculo lo maneja el código dentro de useEffect
};

export default CursorFollower;
