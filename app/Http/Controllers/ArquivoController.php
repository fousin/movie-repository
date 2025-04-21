<?php

namespace App\Http\Controllers;

use App\Services\ArquivoService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Str;

class ArquivoController extends Controller
{
    public function __construct(protected ArquivoService $service)
    {
    }

    public function index()
    {
        try {
            $arquivos = $this->service->getAllPaginated(1, 30);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao buscar os arquivos',
                'error' => $e->getMessage(),
            ], 500);
        }

        return Inertia::render('Arquivos/Index', ['arquivos' => $arquivos]);
    }

    public function getAllPaginated($page, $size)
    {
        try {
            $arquivos = $this->service->getAllPaginated($page, $size);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao buscar os arquivos',
                'error' => $e->getMessage(),
            ], 500);
        }

        return response()->json(['arquivos' => $arquivos]);
    }

    public function store(Request $request)
    {
        if ($request['type'] == 'filme') {
            $dados = $request->validate([
                'type' => 'required|string',
                'file' => 'required|mimes:mp4,mov,avi,wmv|max:204800',
            ]);
        } else {
            $dados = $request->validate([
                'type' => 'required|string',
                'file' => 'required|mimes:jpg,jpeg,png|max:8192',
            ]);
        }

        $fileName = Str::random(10) . '.' . $request->file('file')->getClientOriginalExtension();
        $filePath = $request->file('file')->storeAs($dados['type'], $fileName, 'public');
        $dados['url_capa'] = $filePath;

        try {
            $this->service->store(['name' => $fileName, 'url' => $filePath, 'type' => $dados['type'], 'original_name' => $request->file('file')->getClientOriginalName()]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao salvar o arquivo',
                'error' => $e->getMessage(),
            ], 500);
        }

        return response()->json(['message' => 'Arquivo salvo com sucesso',], 201);
    }

    public function delete(int $id)
    {
        try {
            $this->service->delete($id);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao deletar o arquivo',
                'error' => $e->getMessage(),
            ], 500);
        }
        return response()->json(['message' => 'Arquivo deletado com sucesso',]);
    }

    public function deletesByFilme($filme_id)
    {
        try {
            $this->service->deletesByFilme($filme_id);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao deletar o arquivo',
                'error' => $e->getMessage(),
            ], 500);
        }

        return response()->json(['message' => 'Arquivos deletados com sucesso',]);

    }

}
