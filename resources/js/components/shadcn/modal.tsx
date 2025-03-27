import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Sincronizar datos cuando el modal se abre o el rol cambia
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Editar Rol</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Nombre del Rol</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="focus:ring-primary mt-1 w-full rounded-lg border px-3 py-2 focus:ring"
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Permisos</label>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                            {permissions.map((permission) => (
                                <label key={permission.id} className="flex items-center gap-2">
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
            </DialogContent>
        </Dialog>
    );
}
