import { useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import Modal from "@/components/propios/modal";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

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
        name: "",
        email: "",
        password: "",
        role_id: "", // Asegúrate de que sea un string
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
            password: "",
            role_id: user.role_id ? String(user.role_id) : "", // Convertir el rol a string
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
            onError: (err) => {
                NProgress.done(); // Finaliza en caso de error
                setErrors(err);
            },
        });
    };

    // Envío del formulario de nuevo usuario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        NProgress.start(); // Inicia la barra de progreso
        post("/usuarios", {
            onSuccess: () => {
                NProgress.done(); // Finaliza la barra de progreso
                closeModal();
            },
            onError: (err) => {
                NProgress.done(); // Finaliza la barra de progreso si hay error
                setErrors(err);
            },
        });
    };

    // Eliminar usuario
    const handleDelete = (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

        NProgress.start(); // Inicia la barra de progreso
        router.delete(`/usuarios/${id}`, {
            onSuccess: () => NProgress.done(), // Finaliza la barra de progreso
            onError: (err) => {
                NProgress.done(); // Finaliza en caso de error
                console.error(err);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Usuarios", href: "/usuarios" }]}>
            <Head title="Usuarios" />

            <div className="flex flex-col gap-6 p-6">
                {/* Sección de Bienvenida */}
                <div className="p-6 bg-white dark:bg-sidebar rounded-xl shadow-md">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Administración de Usuarios</h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Administra los usuarios de la plataforma. Puedes agregar, editar y eliminar registros.
                    </p>
                </div>

                {/* Sección de Tabla con Botón */}
                <div className="p-6 bg-white dark:bg-sidebar rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Lista de Usuarios</h2>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-primary text-white dark:text-black font-semibold rounded-lg hover:bg-opacity-90 transition"
                        >
                            Registrar Nuevo Usuario
                        </button>
                    </div>

                    {/* Tabla de Usuarios */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse rounded-xl overflow-hidden">
                            <thead>
                                <tr className="bg-primary text-white text-left dark:bg-secondary dark:text-white">
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Nombre</th>
                                    <th className="p-3">Correo</th>
                                    <th className="p-3">Rol</th>
                                    <th className="p-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-black divide-y divide-gray-300 dark:divide-gray-700">
                                {users.map((user) => {
                                    console.log("User Role ID:", users); // Verifica si role_id está presente
                                    return (
                                        <tr key={user.id}>
                                            <td className="p-3">{user.id}</td>
                                            <td className="p-3">{user.name}</td>
                                            <td className="p-3">{user.email}</td>
                                            <td className="p-3">
                                                {user.roles[0]?.name || "Sin rol asignado"}
                                            </td>

                                            <td className="p-3 text-center flex gap-2 justify-center">
                                                <button onClick={() => openEditModal(user)} className="px-4 py-2 bg-blue-950 text-white font-semibold rounded-lg hover:bg-blue-600 transition">Editar</button>
                                                <button onClick={() => handleDelete(user.id)} className="px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-red-600 transition">Eliminar</button>
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
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-black/30 dark:border-black dark:text-gray-200"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                        <input
                            type="email"
                            placeholder="Correo"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-black/30 dark:border-black dark:text-gray-200"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                        {/* Campo para seleccionar rol */}
                        <select
                            value={data.role_id}
                            onChange={(e) => setData("role_id", e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-black/30 dark:border-black dark:text-gray-200"
                        >
                            <option value="">Selecciona un rol</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.role_id && <p className="text-red-500 text-sm">{errors.role_id}</p>}
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={closeEditModal}
                            className="px-4 py-2 rounded-lg border-2 border-transparent bg-white text-black
                            hover:bg-red-500 hover:border-red-500 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-950 text-white hover:bg-blue-600 transition"
                        >
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
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-black/30 dark:border-black dark:text-gray-200"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                        <input
                            type="email"
                            placeholder="Correo"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-black/30 dark:border-black dark:text-gray-200"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-black/30 dark:border-black dark:text-gray-200"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                        {/* Campo para seleccionar rol */}
                        <select
                            value={data.role_id}
                            onChange={(e) => setData("role_id", e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-black/30 dark:border-black dark:text-gray-200"
                        >
                            <option value="">Selecciona un rol</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.role_id && <p className="text-red-500 text-sm">{errors.role_id}</p>}
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 rounded-lg border-2 border-transparent bg-white text-black
                            hover:bg-red-500 hover:border-red-500 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-950 text-white hover:bg-blue-600 transition"
                        >
                            Registrar Usuario
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
