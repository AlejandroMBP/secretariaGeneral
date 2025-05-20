import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface Role {
    id: number;
    name: string;
    permissions: { name: string }[];
}

interface Permission {
    id: number;
    name: string;
}

interface EditRoleModalProps {
    role: Role | null;
    permissions: Permission[];
    isOpen: boolean;
    onClose: () => void;
}

export default function EditRoleModal({ role, permissions, isOpen, onClose }: EditRoleModalProps) {
    const { data, setData, put, processing, reset } = useForm({
        name: role?.name || '',
        permissions: role?.permissions.map((p) => p.name) || [],
    });

    useEffect(() => {
        if (role) {
            setData({
                name: role.name,
                permissions: role.permissions.map((p) => p.name),
            });
        } else {
            reset();
        }
    }, [role]);

    const handlePermissionChange = (permissionName: string) => {
        setData(
            'permissions',
            data.permissions.includes(permissionName) ? data.permissions.filter((p) => p !== permissionName) : [...data.permissions, permissionName],
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!role) return;
        put(route('roles.update', role.id), {
            onSuccess: () => onClose(),
        });
    };

    if (!isOpen) return null;

    // Calcular columnas dinámicamente según la cantidad de permisos
    const columnCount = Math.min(Math.ceil(permissions.length / 5), 4); // máximo 4 columnas

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm dark:bg-black/70">
            <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Editar Rol</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Campo Nombre */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Nombre del Rol</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                    </div>

                    {/* Lista de permisos */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Permisos</label>
                        <div
                            className={`grid grid-cols-1 gap-2 sm:grid-cols-2 ${
                                columnCount >= 3 ? 'md:grid-cols-3' : ''
                            } ${columnCount === 4 ? 'lg:grid-cols-4' : ''}`}
                        >
                            {permissions.map((permission) => (
                                <label key={permission.id} className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200">
                                    <input
                                        type="checkbox"
                                        checked={data.permissions.includes(permission.name)}
                                        onChange={() => handlePermissionChange(permission.name)}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600"
                                    />
                                    <span>{permission.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded bg-gray-200 px-4 py-2 text-sm text-gray-800 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-indigo-600 px-4 py-2 text-sm text-white transition hover:bg-indigo-700 disabled:opacity-50"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
