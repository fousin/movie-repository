<?php

namespace App\Services\Admin;

use App\Models\Admin\Permissao;

class PermissaoService
{
    public function __construct(protected Permissao $permissaoDB)
    {
    }

    public function getAll(){
        return $this->permissaoDB->all();
    }
    public function getAllUser($user_id){
        return $this->permissaoDB->with('role')->where('user_id', $user_id)->get();
    }
    public function getOne($id){
        return $this->permissaoDB->with('user','role')->findOrFail($id);
    }

    public function create(array $dados){
        return $this->permissaoDB->create($dados);
    }
    public function delete($id){
        $permissao = $this->permissaoDB->findOrFail($id);
        return $permissao->delete();
    }
    
}