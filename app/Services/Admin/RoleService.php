<?php

namespace App\Services\Admin;

use App\Models\Admin\Role;


class RoleService
{
    public function __construct(protected Role $roleDB)
    {
    }

    public function getAll(){
        return $this->roleDB->all();
    }

    public function getOne($id){
        return $this->roleDB->findOrFail($id);
    }

    public function create(array $dados){
        return $this->roleDB->create($dados);
    }   

    public function update(array $dados, $id){
        $role = $this->roleDB->findOrFail($id);
        return $role->update($dados);
    }

    public function delete($id){
        $role = $this->roleDB->findOrFail($id);
        return $role->delete();
    }
    
}