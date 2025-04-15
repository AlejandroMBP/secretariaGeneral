// resources/js/components/FormularioCard.tsx
import { Link } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

interface FormularioCardProps {
    title: string;
    description?: string;
    href: string;
    Icon?: LucideIcon;
}

export default function FormularioCard({ title, description, href, Icon }: FormularioCardProps) {
    return (
        <Link href={href} className="transform transition duration-200 hover:scale-[1.02]">
            <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-md hover:shadow-lg dark:bg-gray-800">
                {Icon && <Icon className="h-10 w-10 text-blue-600 dark:text-blue-400" />}
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
                    {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
                </div>
            </div>
        </Link>
    );
}
