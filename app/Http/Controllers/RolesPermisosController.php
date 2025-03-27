<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesPermisosController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->get();
        $permissions = Permission::all();
        return Inertia::render('Roles/Index', compact('roles', 'permissions'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'unique:roles,name', 'regex:/^[a-zA-Z0-9\s]+$/'],
        ], [
            'name.required' => 'El nombre es obligatorio.',
            'name.unique' => 'El nombre del rol ya existe.',
            'name.regex' => 'El nombre solo puede contener letras, números y espacios.',
        ]);

        $role = Role::create(['name' => $request->name]);

        if ($request->permissions) {
            $role->syncPermissions($request->permissions);
        }

        return Inertia::location(route('roles.index'));
    }


    public function update(Request $request, Role $role)
    {
        $request->validate(['name' => 'required|unique:roles,name,' . $role->id]);
        $role->update(['name' => $request->name]);
        if ($request->permissions) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->back();
    }

    public function destroy($roleId)
    {
        try {
            // Encuentra el rol por ID y elimina
            $role = Role::findOrFail($roleId);
            $role->delete();

            return redirect()->route('roles.index')->with('error', 'Usuario no eliminado.');
        } catch (\Exception $e) {
            return redirect()->route('roles.index')->with('success', 'Usuario eliminado.');
        }
    }

    public function assingPermissions(Request $request, Role $role)
    {
        $request->validate(['permissions' => 'array']);
        $role->syncPermissions($request->permissions);
        return redirect()->back();
    }
}
