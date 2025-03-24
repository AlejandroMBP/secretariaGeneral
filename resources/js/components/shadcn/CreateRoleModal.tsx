import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

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
    onRoleCreated: (role: { id: number; name: string; permissions: { name: string }[] }) => void;
}

export default function CreateRoleModal({ permissions, isOpen, onClose, onRoleCreated }: CreateRoleModalProps) {
    const { data, setData, post, processing, reset } = useForm({
        name: "",
        permissions: [] as string[],
    });

    const handlePermissionChange = (permissionName: string) => {
        setData("permissions", data.permissions.includes(permissionName)
            ? data.permissions.filter((p) => p !== permissionName)
            : [...data.permissions, permissionName]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("roles.store"), {
            onSuccess: (response) => {
                onRoleCreated(response.props.role as Role);
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Registrar Nuevo Rol</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Nombre del Rol</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Permisos</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
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
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" disabled={processing}>Guardar</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
