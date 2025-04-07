import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

    const toggleSubmenu = (title: string) => {
        setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        {item.children ? (
                            <>
                                <SidebarMenuButton onClick={() => toggleSubmenu(item.title)}>
                                    {item.icon && <item.icon className="h-5 w-5" />}
                                    <span>{item.title}</span>
                                    {openMenus[item.title] ? (
                                        <ChevronDown className="ml-auto h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="ml-auto h-4 w-4" />
                                    )}
                                </SidebarMenuButton>
                                {openMenus[item.title] && (
                                    <div className="mt-1 ml-6 space-y-1">
                                        {item.children.map((subItem) => (
                                            <SidebarMenuItem key={subItem.href}>
                                                <SidebarMenuButton asChild isActive={subItem.href === page.url}>
                                                    <Link
                                                        href={subItem.href}
                                                        prefetch
                                                        className="flex items-center gap-2 text-gray-500 hover:text-white"
                                                    >
                                                        {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                                        <span>{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <SidebarMenuButton asChild isActive={item.href === page.url}>
                                {item.href ? (
                                    <Link href={item.href} prefetch className="flex items-center gap-2">
                                        {item.icon && <item.icon className="h-5 w-5" />}
                                        <span>{item.title}</span>
                                    </Link>
                                ) : (
                                    <span className="ml-2">{item.title}</span>
                                )}
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
