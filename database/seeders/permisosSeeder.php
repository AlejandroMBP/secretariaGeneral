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
        // Definir permisos por módulo (ver, crear, editar, eliminar)
        $modules = [
            'usuarios' => ['ver', 'crear', 'editar', 'eliminar'],
            'roles' => ['ver', 'crear', 'editar', 'eliminar'],
            'documentos' => ['ver', 'crear', 'editar', 'eliminar'],
            'cargar_documentos' => ['ver', 'crear', 'eliminar'],
            'resoluciones' => ['ver', 'crear', 'editar', 'eliminar'],
            'Bachiller' => ['ver', 'crear', 'editar', 'eliminar'],
            'Academicos' => ['ver', 'crear', 'editar', 'eliminar'],
            'AntiAutonomistas' => ['ver', 'crear', 'editar', 'eliminar'],
            'Autoridades' => ['ver', 'crear', 'editar', 'eliminar'],
            'Profesionales' => ['ver', 'crear', 'editar', 'eliminar'],
            'Hcu' => ['ver', 'crear', 'editar', 'eliminar'],
            'Rectorales' => ['ver', 'crear', 'editar', 'eliminar'],
            'Convenios' => ['ver', 'crear', 'editar', 'eliminar'],
            'Consejeros' => ['ver', 'crear', 'editar', 'eliminar'],
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
                'ver cargar_documentos', 'crear cargar_documentos', 'eliminar cargar_documentos',
                'ver resoluciones', 'crear resoluciones', 'editar resoluciones', 'eliminar resoluciones',
                'ver Bachiller', 'crear Bachiller', 'editar Bachiller', 'eliminar Bachiller',
                'ver Academicos', 'crear Academicos', 'editar Academicos', 'eliminar Academicos',
                'ver AntiAutonomistas', 'crear AntiAutonomistas', 'editar AntiAutonomistas', 'eliminar AntiAutonomistas',
                'ver Autoridades', 'crear Autoridades', 'editar Autoridades', 'eliminar Autoridades',
                'ver Profesionales', 'crear Profesionales', 'editar Profesionales', 'eliminar Profesionales',
                'ver Hcu', 'crear Hcu', 'editar Hcu', 'eliminar Hcu',
                'ver Rectorales', 'crear Rectorales', 'editar Rectorales', 'eliminar Rectorales',
                'ver Convenios', 'crear Convenios', 'editar Convenios', 'eliminar Convenios',
                'ver Consejeros', 'crear Consejeros', 'editar Consejeros', 'eliminar Consejeros',
            ])->get(),
            'Usuario' => Permission::whereIn('name', [
                'ver usuarios', 'crear usuarios', 'editar usuarios', 'eliminar usuarios',
                'ver roles', 'crear roles', 'editar roles', 'eliminar roles',
                'ver documentos', 'crear documentos', 'editar documentos', 'eliminar documentos',
                'ver cargar_documentos', 'crear cargar_documentos', 'eliminar cargar_documentos',
                'ver resoluciones', 'crear resoluciones', 'editar resoluciones', 'eliminar resoluciones',
                'ver Bachiller', 'crear Bachiller', 'editar Bachiller', 'eliminar Bachiller',
                'ver Academicos', 'crear Academicos', 'editar Academicos', 'eliminar Academicos',
                'ver AntiAutonomistas', 'crear AntiAutonomistas', 'editar AntiAutonomistas', 'eliminar AntiAutonomistas',
                'ver Autoridades', 'crear Autoridades', 'editar Autoridades', 'eliminar Autoridades',
                'ver Profesionales', 'crear Profesionales', 'editar Profesionales', 'eliminar Profesionales',
                'ver Hcu', 'crear Hcu', 'editar Hcu', 'eliminar Hcu',
                'ver Rectorales', 'crear Rectorales', 'editar Rectorales', 'eliminar Rectorales',
                'ver Convenios', 'crear Convenios', 'editar Convenios', 'eliminar Convenios',
                'ver Consejeros', 'crear Consejeros', 'editar Consejeros', 'eliminar Consejeros',
            ])->get(),
        ];

        // Crear roles y asignar permisos
        foreach ($roles as $roleName => $permissions) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->syncPermissions($permissions);
        }
    }
}