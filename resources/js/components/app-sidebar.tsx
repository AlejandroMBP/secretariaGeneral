import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BookMarked,
    BookOpen,
    BookUser,
    Contact,
    FileArchive,
    FileBadge,
    FilePlus,
    FilePlus2,
    FileStack,
    FileWarning,
    Folder,
    Gavel,
    Handshake,
    LayoutGrid,
    ListPlus,
    NotebookPen,
    Users,
    UsersRound,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Permisos',
        href: '/roles',
        icon: Folder,
    },
    {
        title: 'Usuarios',
        href: '/usuarios',
        icon: BookOpen,
    },
    {
        title: 'Carga de documentos',
        href: '/documentos',
        icon: FilePlus,
    },
    {
        title: 'Carga Archivos',
        href: '/archivos',
        icon: FilePlus2,
    },
    {
        title: 'Documentos',
        href: '/documentos-listar',
        icon: FileStack,
    },
    {
        title: 'Diplomas academicos',
        icon: FileBadge,
        children: [
            {
                title: 'Bachiller',
                href: '/Bachiller-listar',
                icon: Contact,
            },
            {
                title: 'Academicos',
                href: '/Academicos-listar',
                icon: UsersRound,
            },
            {
                title: 'Profesionales',
                href: '/Profesionales-listar',
                icon: BookUser,
            },
        ],
    },
    {
        title: 'Resoluciones',
        icon: FileArchive,
        children: [
            {
                title: 'HCU.',
                href: '/Hcu-listar',
                icon: BookMarked,
            },
            {
                title: 'Rectorales',
                href: '/Rectorales-listar',
                icon: NotebookPen,
            },
        ],
    },
    {
        title: 'Anti-Autonomistas',
        href: '/AntiAutonomistas-listar',
        icon: FileWarning,
    },

    {
        title: 'Otros',
        icon: ListPlus,
        children: [
            {
                title: 'Convenios',
                href: '/Convenios-listar',
                icon: Handshake,
            },
            {
                title: 'Consejeros',
                href: '/Consejeros-listar',
                icon: Users,
            },
            {
                title: 'Autoridades',
                href: '/Autoridades-listar',
                icon: Gavel,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
