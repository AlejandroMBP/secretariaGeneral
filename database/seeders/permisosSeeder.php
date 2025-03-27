<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class permisosSeeder extends Seeder
{
    public function run()
    {
        // Definir permisos por módulo
        $modules = [
            'usuarios' => ['ver', 'crear', 'editar', 'eliminar'],
            'roles' => ['ver', 'crear', 'editar', 'eliminar'],
            'documentos' => ['ver', 'crear', 'editar', 'eliminar'],
            'cargar_documentos' => ['ver', 'subir', 'eliminar'],
            'resoluciones' => ['ver', 'crear', 'editar', 'eliminar'],
        ];

        // Crear permisos
        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                Permission::firstOrCreate(['name' => "$action $module"]);
            }
        }

        // Definir roles y sus permisos
        $roles = [
            'Super Admin' => Permission::all(),
            'Administrador' => Permission::whereIn('name', [
                'ver usuarios', 'crear usuarios', 'editar usuarios', 'eliminar usuarios',
                'ver roles', 'crear roles', 'editar roles', 'eliminar roles',
                'ver documentos', 'crear documentos', 'editar documentos', 'eliminar documentos',
                'ver cargar_documentos', 'subir cargar_documentos', 'eliminar cargar_documentos',
                'ver resoluciones', 'crear resoluciones', 'editar resoluciones', 'eliminar resoluciones',
            ])->get(),
            'Usuario' => Permission::whereIn('name', ['ver documentos', 'ver resoluciones'])->get(),
        ];

        // Crear roles y asignar permisos
        foreach ($roles as $roleName => $permissions) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->syncPermissions($permissions);
        }
    }
}
