import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export type NavItem = {
    title: string;
    href?: string;
    icon?: React.ElementType;
    children?: { title: string; href: string; icon?: React.ElementType }[]; // Permitir submenús opcionales
};

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
export interface PageProps {
    auth: {
        user: User;
    };
    // Agrega aquí otras props globales que uses en tus páginas
    monthlyActivity?: Array<{ month: string; total: number }>;
    currentWeekActivity?: Array<{ day: string; total: number }>;
    // ... otras props que necesites
}
