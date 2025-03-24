<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;


class userController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->get(); // Asegúrate de que roles esté relacionado correctamente
        $roles = Role::all();

        return Inertia::render('Usuarios/UsuarioIndex', [
            'users' => $users,
            'roles' => $roles
        ]);
    }

    public function store(Request $request)
    {
        // Validación
        $request->validate([
            'name' => 'required|string|max:225',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|min:6',
            'role_id' => 'required|exists:roles,id', // Validar que el role_id existe
        ]);

        // Crear el usuario
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        $role = Role::find($request->role_id);

        $user->assignRole($role->name); // Asignar el nombre del rol

        // Redirigir con éxito
        return redirect()->route('usuario.index')->with('success', 'Usuario creado satisfactoriamente');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'role_id' => 'required|exists:roles,id', // Validación para asegurar que el rol existe
        ]);

        // Actualizar los datos del usuario
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        // Obtener el nuevo rol desde la base de datos
        $role = Role::find($request->role_id);

        // Sincronizar el rol del usuario (esto reemplazará el rol actual por el nuevo)
        $user->syncRoles([$role->name]);

        return redirect()->back()->with('success', 'Usuario actualizado correctamente.');
    }



    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('usuario.index')->with('success', 'Usiario eliminado.');
    }
}
