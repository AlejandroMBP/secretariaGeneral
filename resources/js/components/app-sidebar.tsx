import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, FileArchive, FileBadge, FilePlus2, FileWarning, Folder, Gavel, Handshake, LayoutGrid, ListPlus, Users } from 'lucide-react';
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
        title: 'Carga Archivos',
        href: '/archivos',
        icon: FilePlus2,
    },

    {
        title: 'Diplomas',
        href: '/Diplomas-Cards',
        icon: FileBadge,
    },
    {
        title: 'Resoluciones',
        href: '/Resoluciones-Cards',
        icon: FileArchive,
    },
    {
        title: 'Anti-Autonomistas',
        href: '/AntiAutonomistas-listar',
        icon: FileWarning,
    },

    {
        title: 'Buscador Semantico',
        href: '/documentos/buscar',
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
