<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\RoleService;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function __construct(
        protected RoleService $service,
    ){}

    public function getAll(){
        try{
            $roles = $this->service->getAll();
        }catch(\Exception $e){
            return response()->json([
                'error' => 'Erro ao buscar permissões',
                'exception' => $e->getMessage(),
            ], 500);
        }
        return response()->json(['roles' => $roles]);
    }

    public function getOne($id){
        try{
            $role = $this->service->getOne($id);
        }catch(\Exception $e){
            return response()->json([
                'error' => 'Erro ao buscar permissão',
                'exception' => $e->getMessage(),
            ], 500);
            
        }
        return response()->json(['role' => $role]);
    }

    public function create(Request $request){
        $dados = $request->all();
        try{    
            $role = $this->service->create($dados);
        }catch(\Exception $e){
            return response()->json([
                'error' => 'Erro ao criar permissão',
                'exception' => $e->getMessage(),
            ], 500);
        }
        return response()->json(['role' => $role], 201);
    }

    public function update(Request $request, $id){
        $dados = $request->all();
        try{
            $role = $this->service->update($dados, $id);
        }catch(\Exception $e){
            return response()->json([
                'error' => 'Erro ao atualizar permissão',
                'exception' => $e->getMessage(),
            ], 500);
        }
        return response()->json(['role' => $role]);
    }

    public function delete($id){
        try{
            $role = $this->service->delete($id);
        }catch(\Exception $e){
            return response()->json([
                'error' => 'Erro ao apagar permissão',
                'exception' => $e->getMessage(),
            ], 500);
        }

        return response()->json([], 200);
    }
}
