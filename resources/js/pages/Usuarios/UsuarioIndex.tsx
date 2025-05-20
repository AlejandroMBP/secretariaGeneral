import Modal from '@/components/propios/modal';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useState } from 'react';

type User = {
    id: number;
    name: string;
    email: string;
    role_id?: number;
    roles: Role[];
};

type Role = {
    id: number;
    name: string;
};

export default function UsuarioIndex({ users, roles }: { users: User[]; roles: Role[] }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const { data, setData, post, put, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role_id: '', // Asegúrate de que sea un string
    });

    // Funciones para cerrar los modales
    const closeModal = () => {
        reset();
        setErrors({});
        setIsModalOpen(false);
    };

    const closeEditModal = () => {
        reset();
        setErrors({});
        setSelectedUser(null);
        setIsEditModalOpen(false);
    };

    // Función para abrir el modal de edición
    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            role_id: user.role_id ? String(user.role_id) : '', // Convertir el rol a string
        });
        setIsEditModalOpen(true);
    };

    // Envío del formulario de edición
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        NProgress.start(); // Inicia la barra de progreso
        put(`/usuarios/${selectedUser.id}`, {
            onSuccess: () => {
                NProgress.done(); // Finaliza la barra de progreso
                closeEditModal();
            },
            onError: (err: any) => {
                NProgress.done(); // Finaliza en caso de error
                setErrors(err);
            },
        });
    };

    // Envío del formulario de nuevo usuario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        NProgress.start(); // Inicia la barra de progreso
        post('/usuarios', {
            onSuccess: () => {
                NProgress.done(); // Finaliza la barra de progreso
                closeModal();
            },
            onError: (err: any) => {
                NProgress.done(); // Finaliza la barra de progreso si hay error
                setErrors(err);
            },
        });
    };

    // Eliminar usuario
    const handleDelete = (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

        NProgress.start(); // Inicia la barra de progreso
        router.delete(`/usuarios/${id}`, {
            onSuccess: () => NProgress.done(), // Finaliza la barra de progreso
            onError: (err: any) => {
                NProgress.done(); // Finaliza en caso de error
                console.error(err);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Usuarios', href: '/usuarios' }]}>
            <Head title="Usuarios" />

            <div className="flex flex-col gap-6 p-6">
                {/* Sección de Bienvenida */}
                <div className="dark:bg-sidebar rounded-xl bg-white p-6 shadow-md">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Administración de Usuarios</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Administra los usuarios de la plataforma. Puedes agregar, editar y eliminar registros.
                    </p>
                </div>

                {/* Sección de Tabla con Botón */}
                <div className="dark:bg-sidebar rounded-xl bg-white p-6 shadow-md">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Lista de Usuarios</h2>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-primary hover:bg-opacity-90 rounded-lg px-4 py-2 font-semibold text-white transition dark:text-black"
                        >
                            Registrar Nuevo Usuario
                        </button>
                    </div>

                    {/* Tabla de Usuarios */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse overflow-hidden rounded-xl">
                            <thead>
                                <tr className="bg-primary dark:bg-secondary text-left text-white dark:text-white">
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Nombre</th>
                                    <th className="p-3">Correo</th>
                                    <th className="p-3">Rol</th>
                                    <th className="p-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-300 bg-white dark:divide-gray-700 dark:bg-black">
                                {users.map((user) => {
                                    console.log('User Role ID:', users); // Verifica si role_id está presente
                                    return (
                                        <tr key={user.id}>
                                            <td className="p-3">{user.id}</td>
                                            <td className="p-3">{user.name}</td>
                                            <td className="p-3">{user.email}</td>
                                            <td className="p-3">{user.roles[0]?.name || 'Sin rol asignado'}</td>

                                            <td className="flex justify-center gap-2 p-3 text-center">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="rounded-lg bg-blue-950 px-4 py-2 font-semibold text-white transition hover:bg-blue-600"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="rounded-lg bg-gray-900 px-4 py-2 font-semibold text-white transition hover:bg-red-600"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL PARA EDITAR USUARIO */}
            <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Editar Usuario">
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="focus:ring-primary w-full rounded-lg border p-3 focus:ring-2 dark:border-black dark:bg-black/30 dark:text-gray-200"
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

                        <input
                            type="email"
                            placeholder="Correo"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="focus:ring-primary w-full rounded-lg border p-3 focus:ring-2 dark:border-black dark:bg-black/30 dark:text-gray-200"
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}

                        {/* Campo para seleccionar rol */}
                        <select
                            value={data.role_id}
                            onChange={(e) => setData('role_id', e.target.value)}
                            className="focus:ring-primary w-full rounded-lg border p-3 focus:ring-2 dark:border-black dark:bg-black/30 dark:text-gray-200"
                        >
                            <option value="">Selecciona un rol</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.role_id && <p className="text-sm text-red-500">{errors.role_id}</p>}
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={closeEditModal}
                            className="rounded-lg border-2 border-transparent bg-white px-4 py-2 text-black transition hover:border-red-500 hover:bg-red-500"
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="rounded-lg bg-blue-950 px-4 py-2 text-white transition hover:bg-blue-600">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </Modal>

            {/* MODAL PARA CREAR NUEVO USUARIO */}
            <Modal isOpen={isModalOpen} onClose={closeModal} title="Registrar Nuevo Usuario">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="focus:ring-primary w-full rounded-lg border p-3 focus:ring-2 dark:border-black dark:bg-black/30 dark:text-gray-200"
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

                        <input
                            type="email"
                            placeholder="Correo"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="focus:ring-primary w-full rounded-lg border p-3 focus:ring-2 dark:border-black dark:bg-black/30 dark:text-gray-200"
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}

                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="focus:ring-primary w-full rounded-lg border p-3 focus:ring-2 dark:border-black dark:bg-black/30 dark:text-gray-200"
                        />
                        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}

                        {/* Campo para seleccionar rol */}
                        <select
                            value={data.role_id}
                            onChange={(e) => setData('role_id', e.target.value)}
                            className="focus:ring-primary w-full rounded-lg border p-3 focus:ring-2 dark:border-black dark:bg-black/30 dark:text-gray-200"
                        >
                            <option value="">Selecciona un rol</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.role_id && <p className="text-sm text-red-500">{errors.role_id}</p>}
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="rounded-lg border-2 border-transparent bg-white px-4 py-2 text-black transition hover:border-red-500 hover:bg-red-500"
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="rounded-lg bg-blue-950 px-4 py-2 text-white transition hover:bg-blue-600">
                            Registrar Usuario
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
