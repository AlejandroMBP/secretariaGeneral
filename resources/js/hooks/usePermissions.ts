import { usePage } from '@inertiajs/react';

export default function usePermissions() {
    const { props } = usePage();
    const permissions = props.auth.user?.permissions || [];
    const roles = props.auth.user?.roles || [];

    const hasPermission = (permission: string): boolean => {
        return permissions.includes(permission);
    };

    const hasRole = (role: string): boolean => {
        return roles.includes(role);
    };

    return { hasPermission, hasRole };
}
