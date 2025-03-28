<?php

namespace App\Http\Controllers;

use App\Services\FilmeService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Str;

class FilmeController extends Controller
{
    public function __construct(protected FilmeService $service){}


    public function index()
    {
        try{
            $filmes = $this->service->getAllPaginated(1, 30);
        }catch(\Exception $e){
            return redirect()->route('filmes.index');
        }
        return Inertia::render('Filmes/Index', ['filmes' => $filmes]);
    }

    public function create()
    {
        return Inertia::render('Filmes/Create');
    }

    public function show($id)
    {
        try{
            $filmes = $this->service->getOne($id);
        }catch(\Exception $e){
            return redirect()->route('filmes.index');
        }
        return Inertia::render('Filmes/show', ['filmes' => $filmes]);
    }

    public function edit(int $id)
    {
        try{
            $filmes = $this->service->getOne($id);
        }catch(\Exception $e){
            return redirect()->route('filmes.index');
        }
        return Inertia::render('Filmes/create', ['filmes' => $filmes]);
    }

    
    public function store(Request $request)
    {
        // Validação dos dados
        $validatedData = $request->validate([
            'titulo' => 'required|string|max:255',
            'sinopse' => 'required|string',
            'capa' => 'required|url',
            'video' => 'required|file|mimes:mp4,mkv,avi,flv|max:1024000', // Limite de 1GB (1024000 KB)
        ]);

        // Processar o upload do vídeo
        if ($request->hasFile('video') && $request->file('video')->isValid()) {
            // Gerar nome único para o vídeo
            $videoName = Str::random(10) . '.' . $request->file('video')->getClientOriginalExtension();
            
            // Armazenar o vídeo no diretório 'videos'
            $videoPath = $request->file('video')->storeAs('videos', $videoName, 'public');
        } else {
            return response()->json(['error' => 'Arquivo de vídeo inválido ou não enviado'], 400);
        }

        // Criar o filme no banco de dados
        try{
            $this->service->store([
                'titulo' => $validatedData['titulo'],
                'sinopse' => $validatedData['sinopse'],
                'url_capa' => $validatedData['capa'],
                'url_filme' => $videoPath, // Caminho para o vídeo
            ]);
        }catch(\Exception $e){
            return response()->json(['error' => $e->getMessage(), 'mensagem' => 'Erro ao cadastrar filme'], 500);
        }

        return response()->json(['message' => 'Filme cadastrado com sucesso!'], 201);
    }


    public function update(Request $request, $id)
    {
        try{
            $this->service->update($request->only('titulo', 'sinopse', 'url_capa', 'url_filme'), $id);
        }catch(\Exception $e){
            response()->json(['error' => $e->getMessage(), 'mensagem' => 'Erro ao atualizar filme']);
        }

        return redirect()->route('filmes.index');
    }

    public function destroy($id)
    {
        try{
            $this->service->delete($id);
        }catch(\Exception $e){
            response()->json(['error' => $e->getMessage(), 'mensagem' => 'Erro ao deletar filme']);
        }

        return redirect()->route('filmes.index');
    }

    public function getAllPaginated($page, $size)
    {
        try{
            dd('asasda');
            $filmes = $this->service->getAllPaginated($page, $size);

        }catch(\Exception $e){
            return response()->json(['error' => $e->getMessage(), 'mensagem' => 'Erro ao buscar filmes']);
        }

        return response()->json(['filmes' => $filmes]);
    }

    public function search(Request $request)
    {
        $dados = $request->only('search');

        try{
            $filmes = $this->service->search($dados['search']);
        }catch(\Exception $e){
            return response()->json(['error' => $e->getMessage(), 'mensagem' => 'Erro ao buscar filmes']);
        }

        return response()->json(['filmes' => $filmes]);
    }

}
