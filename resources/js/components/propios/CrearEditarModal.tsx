import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import NProgress from 'nprogress';
import { useState } from 'react';

interface Role {
    id: number;
    name: string;
    permissions: { name: string }[];
}

interface Permission {
    id: number;
    name: string;
}

interface Props {
    roles: Role[];
    permissions: Permission[];
}

// Componente Modal para Crear/Editar Rol
const RoleModal = ({
    isOpen,
    onClose,
    onSubmit,
    role = null,
    permissions,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; permissions: number[] }) => void;
    role?: Role | null;
    permissions: Permission[];
}) => {
    const [name, setName] = useState(role?.name || '');
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>(role?.permissions.map((p) => p.id) || []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="dark:bg-sidebar w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{role ? 'Editar Rol' : 'Crear Nuevo Rol'}</h3>

                <div className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre del Rol</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Permisos</label>
                        <div className="mt-2 space-y-2">
                            {permissions.map((permission) => (
                                <div key={permission.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`perm-${permission.id}`}
                                        checked={selectedPermissions.includes(permission.id)}
                                        onChange={() => {
                                            setSelectedPermissions((prev) =>
                                                prev.includes(permission.id) ? prev.filter((id) => id !== permission.id) : [...prev, permission.id],
                                            );
                                        }}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                    <label htmlFor={`perm-${permission.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                        {permission.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="outline" onClick={onClose} className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => onSubmit({ name, permissions: selectedPermissions })}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                        {role ? 'Guardar Cambios' : 'Crear Rol'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Componente de Confirmación para Eliminar
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="dark:bg-sidebar w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">¿Eliminar Rol?</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Esta acción no se puede deshacer. ¿Estás seguro de continuar?</p>
                <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="outline" onClick={onClose} className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} className="dark:bg-red-700 dark:hover:bg-red-800">
                        Confirmar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default function Index({ roles: initialRoles, permissions }: Props) {
    const [roles, setRoles] = useState(initialRoles);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

    const handleCreate = (data: { name: string; permissions: number[] }) => {
        // Simulación de creación - reemplazar con tu API
        const newRole = {
            id: Math.max(...roles.map((r) => r.id)) + 1,
            name: data.name,
            permissions: permissions.filter((p) => data.permissions.includes(p.id)),
        };
        setRoles([...roles, newRole]);
        setIsCreateModalOpen(false);
        NProgress.done();
    };

    const handleEdit = (data: { name: string; permissions: number[] }) => {
        if (!selectedRole) return;

        const updatedRoles = roles.map((role) =>
            role.id === selectedRole.id
                ? {
                      ...role,
                      name: data.name,
                      permissions: permissions.filter((p) => data.permissions.includes(p.id)),
                  }
                : role,
        );

        setRoles(updatedRoles);
        setIsEditModalOpen(false);
        NProgress.done();
    };

    const handleDelete = (roleId: number) => {
        setRoleToDelete(roleId);
        setIsDeleteModalOpen(true);
        NProgress.start();
    };

    const confirmDelete = () => {
        if (roleToDelete) {
            setRoles(roles.filter((role) => role.id !== roleToDelete));
            NProgress.done();
        }
        setIsDeleteModalOpen(false);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Roles y Permisos', href: '/roles' }]}>
            <Head title="Roles y Permisos" />
            <div className="dark:bg-sidebar rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Roles y Permisos</h2>
                    <Button
                        className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Nuevo Rol
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg border border-gray-200 dark:border-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase dark:text-white">Rol</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase dark:text-white">Permisos</th>
                                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700 uppercase dark:text-white">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role) => (
                                <tr key={role.id} className="dark:bg-sidebar border-t border-gray-200 bg-white dark:border-gray-700">
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{role.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {role.permissions.length > 0 ? (
                                                role.permissions.map((permission, index) => (
                                                    <span
                                                        key={index}
                                                        className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/80 dark:text-blue-200"
                                                    >
                                                        {permission.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-sm text-gray-500 dark:text-gray-400">Sin permisos</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                                                onClick={() => {
                                                    setSelectedRole(role);
                                                    setIsEditModalOpen(true);
                                                }}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="dark:bg-red-700 dark:hover:bg-red-800"
                                                onClick={() => handleDelete(role.id)}
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modales */}
            <RoleModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreate} permissions={permissions} />

            {selectedRole && (
                <RoleModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleEdit}
                    role={selectedRole}
                    permissions={permissions}
                />
            )}

            <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} />
        </AppLayout>
    );
}
