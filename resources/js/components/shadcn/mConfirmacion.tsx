import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import NProgress from "nprogress";
import { router } from "@inertiajs/react";

const DeleteRoleModal = ({
    isOpen,
    onClose,
    onConfirm,
    roleId
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (roleId: number) => void;
    roleId: number;
}) => {

    const deleteRole = async (roleId: number) => {
        try {
            NProgress.start();

            // Usando router.delete de Inertia.js para eliminar el rol
            router.delete(route('roles.destroy', { role: roleId }), {
                onSuccess: () => {
                    onConfirm(roleId); // Llamamos a la función onConfirm pasada como prop
                    NProgress.done();
                    onClose(); // Cerrar el modal después de la eliminación
                },
                onError: (error) => {
                    console.error("Error al eliminar el rol", error);
                    NProgress.done();
                },
            });

        } catch (error) {
            console.error("Error en la solicitud de eliminación", error);
            NProgress.done();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmar Eliminación</DialogTitle>
                </DialogHeader>
                <p>¿Estás seguro de que deseas eliminar este rol?</p>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button variant="destructive" onClick={() => deleteRole(roleId)}>Eliminar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteRoleModal;
