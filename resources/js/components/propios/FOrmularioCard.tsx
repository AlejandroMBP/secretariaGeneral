import { Link } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface FormularioCardProps {
    title: string;
    description?: string;
    href: string;
    Icon?: LucideIcon;
}

export default function FormularioCard({ title, description, href, Icon }: FormularioCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            href={href}
            className="relative overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`absolute inset-0 rounded-2xl ${isHovered ? 'opacity-20' : 'opacity-0'} bg-[radial-gradient(circle_at_0%_100%,_rgba(100,100,100,0.3)_0%,_transparent_70%)] transition-opacity duration-500 ${isHovered ? 'bg-[radial-gradient(circle_at_100%_0%,_rgba(100,100,100,0.3)_0%,_transparent_70%)]' : ''} `}
            ></div>

            <div
                className={`dark:bg-sidebar relative z-10 flex items-center gap-4 rounded-2xl bg-white p-6 transition-all duration-300 ${isHovered ? 'bg-opacity-90' : ''} `}
            >
                {Icon && (
                    <Icon
                        className={`h-10 w-10 text-blue-600 transition-all duration-300 ${isHovered ? 'scale-110 text-blue-700 dark:text-blue-300' : 'dark:text-blue-400'} `}
                    />
                )}
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 transition-colors duration-300 dark:text-white">{title}</h3>
                    {description && <p className="mt-1 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400">{description}</p>}
                </div>
            </div>
        </Link>
    );
}
