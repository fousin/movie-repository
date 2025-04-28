<?php

namespace App\Services\Admin;

use App\Models\User;


class UserService
{
    public function __construct(protected User $userDB)
    {
    }

    public function getAllPaginated($page, $size){
        return $this->userDB->paginate($size, ['*'], 'page', $page);
    }

    public function getOne($id){
        return $this->userDB->findOrFail($id);
    }

    public function create(array $dados){
        return $this->userDB->create($dados);
    }   

    public function update(array $dados, $id){
        $role = $this->userDB->findOrFail($id);
        return $role->update($dados);
    }

    public function delete($id){
        $role = $this->userDB->findOrFail($id);
        return $role->delete();
    }
    
}