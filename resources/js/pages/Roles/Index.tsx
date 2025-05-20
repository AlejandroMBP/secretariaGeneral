import CreateRoleModal from '@/components/shadcn/CreateRoleModal';
import DeleteRoleModal from '@/components/shadcn/mConfirmacion';
import EditRoleModal from '@/components/shadcn/modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function Index({ roles: initialRoles, permissions }: Props) {
    const [roles, setRoles] = useState(initialRoles);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

    const openEditModal = (role: Role) => {
        setSelectedRole(role);
        setIsEditModalOpen(true);
        NProgress.start();
    };

    const handleRoleCreated = (newRole: Role) => {
        setRoles([...roles, newRole]);
        NProgress.done();
    };

    const openDeleteModal = (roleId: number) => {
        setRoleToDelete(roleId);
        setIsDeleteModalOpen(true);
        NProgress.start();
    };

    const handleDeleteConfirm = () => {
        if (roleToDelete !== null) {
            setRoles(roles.filter((role) => role.id !== roleToDelete));
            NProgress.done();
        }
        setIsDeleteModalOpen(false);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Roles y Permisos', href: '/roles' }]}>
            <Head title="Roles y Permisos" />
            <div className="flex flex-col gap-6 p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Administración de Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 dark:text-gray-300">Aquí puedes gestionar los roles y ver los permisos asignados a cada uno.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Button onClick={() => setIsCreateModalOpen(true)}>Registrar nuevo rol</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                            Rol
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                            Permisos
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                    {roles.length > 0 ? (
                                        roles.map((role) => (
                                            <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">{role.name}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {role.permissions.length > 0 ? (
                                                            role.permissions.map((permission, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                                                >
                                                                    {permission.name}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-sm text-gray-500 dark:text-gray-400">Sin permisos</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => openEditModal(role)}>
                                                            Editar
                                                        </Button>
                                                        <Button variant="destructive" size="sm" onClick={() => openDeleteModal(role.id)}>
                                                            Eliminar
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                No hay roles disponibles
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal para Editar Rol */}
            {selectedRole && (
                <EditRoleModal role={selectedRole} permissions={permissions} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
            )}

            {/* Modal para Crear Nuevo Rol */}
            <CreateRoleModal
                permissions={permissions}
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onRoleCreated={handleRoleCreated}
            />

            {/* Modal para Confirmación de Eliminación */}
            <DeleteRoleModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                roleId={roleToDelete!}
            />
        </AppLayout>
    );
}
