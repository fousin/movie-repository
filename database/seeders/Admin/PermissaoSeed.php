<?php

namespace Database\Seeders\Admin;

use App\Models\Admin\Permissao;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissaoSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Permissao::create([
            'user_id' => 1,
            'role_id' => 1,
        ]);
    }
}
