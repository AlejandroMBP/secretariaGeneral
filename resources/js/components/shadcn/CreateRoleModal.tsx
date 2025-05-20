import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface Permission {
    id: number;
    name: string;
}
interface Role {
    id: number;
    name: string;
    permissions: { name: string }[];
}

interface CreateRoleModalProps {
    permissions: Permission[];
    isOpen: boolean;
    onClose: () => void;
    onRoleCreated: (role: Role) => void;
}

export default function CreateRoleModal({ permissions, isOpen, onClose, onRoleCreated }: CreateRoleModalProps) {
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        permissions: [] as string[],
    });

    const handlePermissionChange = (permissionName: string) => {
        setData(
            'permissions',
            data.permissions.includes(permissionName) ? data.permissions.filter((p) => p !== permissionName) : [...data.permissions, permissionName],
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('roles.store'), {
            onSuccess: (response: any) => {
                onRoleCreated(response.props.role as Role);
                reset();
                onClose();
            },
        });
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900 dark:text-white">
                <h2 className="mb-4 text-xl font-semibold">Registrar Nuevo Rol</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300">Nombre del Rol</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="focus:ring-primary mt-1 w-full rounded-lg border px-3 py-2 focus:ring dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300">Permisos</label>
                        <div className="mt-2 grid max-h-40 grid-cols-2 gap-2 overflow-y-auto">
                            {permissions.map((permission) => (
                                <label key={permission.id} className="flex items-center gap-2 text-sm dark:text-gray-300">
                                    <Checkbox
                                        checked={data.permissions.includes(permission.name)}
                                        onCheckedChange={() => handlePermissionChange(permission.name)}
                                    />
                                    {permission.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Guardar
                        </Button>
                    </div>
                </form>

                {/* Botón para cerrar en la esquina */}
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                    onClick={onClose}
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
