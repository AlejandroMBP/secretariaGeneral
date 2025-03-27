import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            {/* Logo en la parte superior izquierda */}
            <div className="absolute top-6 left-6 z-20 md:top-10 md:left-10">
                <img
                    src="/image/logoSecretaria.png"
                    alt="Logo Secretaría"
                    className="animate-spin-slow h-20 w-20 rounded-full border-4 border-white shadow-lg md:h-16 md:w-16"
                />
            </div>

            {/* Video de fondo */}
            <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover">
                <source src="/image/login/video3.mp4" type="video/mp4" />
                Tu navegador no soporta videos.
            </video>

            {/* Capa de degradado */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-black to-blue-500 opacity-70"></div>

            {/* Contenido */}
            <div className="relative z-10 flex w-full max-w-4xl items-center gap-8 rounded-3xl bg-black p-8">
                {/* Imagen a la izquierda */}
                <div className="hidden w-1/2 md:block">
                    <img src="/image/login/fondo2.jpg" alt="Imagen de fondo" className="h-full w-full rounded-2xl object-cover" />
                </div>

                {/* Contenido */}
                <div className="flex w-1/2 flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-muted-foreground text-center text-sm">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
