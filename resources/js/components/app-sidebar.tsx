import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { FileSignature, FileText, GraduationCap, LayoutGrid, SearchCode, Shield, Upload, UserCog, Users, UserX } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Graficas',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Permisos',
        href: '/roles',
        icon: Shield, // Mejor representa permisos/roles
    },
    {
        title: 'Usuarios',
        href: '/usuarios',
        icon: Users, // Más representativo para usuarios
    },
    {
        title: 'Carga Archivos',
        href: '/archivos',
        icon: Upload, // Mejor para acción de carga
    },
    {
        title: 'Diplomas',
        href: '/Diplomas-Cards',
        icon: GraduationCap, // Ideal para diplomas
    },
    {
        title: 'Resoluciones',
        href: '/Resoluciones-Cards',
        icon: FileText, // Mejor para documentos oficiales
    },
    {
        title: 'Anti-Autonomistas',
        href: '/AntiAutonomistas-listar',
        icon: UserX, // Representa personas no autorizadas
    },
    {
        title: 'Convenios',
        href: '/Convenios-listar',
        icon: FileSignature, // Mejor para acuerdos
    },
    {
        title: 'Autoridades',
        href: '/Autoridades-listar',
        icon: UserCog, // Representa usuarios con privilegios
    },
    {
        title: 'Buscador Semántico',
        href: '/documentos/buscar',
        icon: SearchCode, // Específico para búsqueda avanzada
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
