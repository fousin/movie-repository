<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\PermissaoService;
use Illuminate\Http\Request;

class PermissaoController extends Controller
{
    public function __construct(protected PermissaoService $service){}

    public function getAll(){
        try{
            $permissoes = $this->service->getAll();
        }catch(\Exception $e){
            return response()->json([
                'error' => 'Erro ao buscar permissões',
                'exception' => $e->getMessage(),
            ], 500);
        }

        return response()->json(['permissoes' => $permissoes]);
    }

    public function getAllUser($user_id){
        try{
            $permissoes = $this->service->getAllUser($user_id);
        }catch(\Exception $e){
            return response()->json([
                'error' => 'Erro ao buscar permissões do usuário',
                'exception' => $e->getMessage(),
            ], 500);
        }
        
        return response()->json(['permissoes' => $permissoes]);

    }

    public function getOne($id){
        try{
            $permissao = $this->service->getOne($id);
        }catch(\Exception $e){
            return response()->json([
                'error' => 'Erro ao buscar permissão',
                'exception' => $e->getMessage(),
            ], 500);
        }

        return response()->json(['permissao' => $permissao]);
    }


    public function create(Request $request){
        $dados = $request->validate([
            'user_id' => 'required|integer',
            'role_id' => 'required|integer',
        ], [
            'user_id.required' => 'O id do usuário é obrigatório',
            'user_id.integer' => 'O id do usuário deve ser um número inteiro',
            'role_id.required' => 'O id da role é obrigatório',
            'role_id.integer' => 'O id da role deve ser um número inteiro',
        ]);

        try{
            $permissao = $this->service->create($dados);
            $permissao = $this->service->getOne($permissao->id);
        }catch(\Exception $e){
            return response()->json([
                'error' => 'Erro ao criar permissão',
                'exception' => $e->getMessage(),
            ], 500);
        }
        return response()->json(['permissao' => $permissao], 201);
    }

    public function delete($id){
        try{
            $this->service->delete($id);
        }catch(\Exception $e){
            return response()->json([
                'error' => 'Erro ao deletar permissão',
                'exception' => $e->getMessage(),
            ], 500);
        }
        return response()->json([], 200);
    }

}
