import { useState } from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EditRoleModal from "@/components/shadcn/modal";
import CreateRoleModal from "@/components/shadcn/CreateRoleModal";
import DeleteRoleModal from "@/components/shadcn/mConfirmacion";
import NProgress from "nprogress";

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
        setRoleToDelete(roleId); // Guardamos el ID del rol a eliminar
        setIsDeleteModalOpen(true); // Abrimos el modal de confirmación
        NProgress.start();
    };

    const handleDeleteConfirm = () => {
        if (roleToDelete !== null) {
            // Eliminar el rol usando fetch o lógica que prefieras
            setRoles(roles.filter(role => role.id !== roleToDelete)); // Actualizamos el estado
            NProgress.done();
        }
        setIsDeleteModalOpen(false); // Cerramos el modal
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Roles y Permisos", href: "/roles" }]}>
            <Head title="Roles y Permisos" />
            <div className="flex flex-col gap-6 p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Administración de Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 dark:text-gray-300">
                            Aquí puedes gestionar los roles y ver los permisos asignados a cada uno.
                        </p>
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
                        <Accordion type="single" collapsible>
                            {roles.length > 0 ? (
                                roles.map((role) => (
                                    <AccordionItem key={role.id} value={String(role.id)}>
                                        <AccordionTrigger className="transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-900/50">
                                            {role.name}
                                        </AccordionTrigger>

                                        <AccordionContent>
                                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                                                {role.permissions.length > 0 ? (
                                                    role.permissions.map((permission, index) => (
                                                        <li key={index} className="text-sm">{permission.name}</li>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">No tiene permisos asignados.</p>
                                                )}
                                            </ul>

                                            <div className="mt-4 flex gap-4">
                                                <Button variant="outline" onClick={() => openEditModal(role)}>
                                                    Editar
                                                </Button>
                                                <Button variant="destructive" onClick={() => openDeleteModal(role.id)}>
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400">No hay roles disponibles.</p>
                            )}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>

            {/* Modal para Editar Rol */}
            {selectedRole && (
                <EditRoleModal
                    role={selectedRole}
                    permissions={permissions}
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                />
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
                roleId={roleToDelete!} // Asegúrate de pasar el roleId al modal
            />
        </AppLayout>
    );
}
