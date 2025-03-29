<?php

namespace App\Http\Controllers;

use App\Services\FilmeService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Storage;
use Str;

class FilmeController extends Controller
{
    public function __construct(protected FilmeService $service)
    {
    }


    public function index()
    {
        try {
            $filmes = $this->service->getAllPaginated(1, 30);
        } catch (\Exception $e) {
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
        try {
            $filmes = $this->service->getOne($id);
        } catch (\Exception $e) {
            return redirect()->route('filmes.index');
        }
        return Inertia::render('Filmes/show', ['filmes' => $filmes]);
    }

    public function edit(int $id)
    {
        try {
            $filmes = $this->service->getOne($id);
        } catch (\Exception $e) {
            return redirect()->route('filmes.index');
        }
        return Inertia::render('Filmes/create', ['filmes' => $filmes]);
    }


    public function store(Request $request)
    {
        // Validação dos dados
        $dados = $request->validate([
            'titulo' => 'required|string|max:255',
            'sinopse' => 'required|string',
            'capa' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'video' => 'required|file|mimes:mp4,mkv,avi,flv|max:3072000', // Limite de 3GB
        ]);

        if ($request->hasFile('video') && $request->file('video')->isValid()) {
            $videoName = Str::random(10) . '.' . $request->file('video')->getClientOriginalExtension();
            $videoPath = $request->file('video')->storeAs('videos', $videoName, 'public');
            $dados['url_filme'] = $videoPath;
        } else {
            return response()->json(['error' => 'Arquivo de vídeo inválido ou não enviado'], 400);
        }

        if ($request->hasFile('capa') && $request->file('capa')->isValid()) {
            $capaName = Str::random(10) . '.' . $request->file('capa')->getClientOriginalExtension();
            $capaPath = $request->file('capa')->storeAs('capas', $capaName, 'public');
            $dados['url_capa'] = $capaPath;
        } else {
            return response()->json(['error' => 'Arquivo de vídeo inválido ou não enviado'], 400);
        }

        try {
            $this->service->store($dados);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage(), 'mensagem' => 'Erro ao cadastrar filme'], 500);
        }

        return response()->json(['message' => 'Filme cadastrado com sucesso!'], 201);
    }


    public function update(Request $request, $id)
    {
        $dados = $request->validate([
            'titulo' => 'required|string|max:255',
            'sinopse' => 'required|string',
            'capa' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'video' => 'nullable|file|mimes:mp4,mkv,avi,flv|max:3072000', // Limite de 3GB
        ]);

        $filme = $this->service->getOne($id);

        if (!$filme) {
            return response()->json(['error' => 'Filme não encontrado'], 404);
        }

        if ($request->hasFile('video') && $request->file('video')->isValid()) {
            // Remover o vídeo antigo 
            Storage::disk('public')->delete($filme->url_filme);
            $videoName = Str::random(10) . '.' . $request->file('video')->getClientOriginalExtension();
            $videoPath = $request->file('video')->storeAs('videos', $videoName, 'public');
            $dados['url_filme'] = $videoPath;
        }

        if ($request->hasFile('capa') && $request->file('capa')->isValid()) {
            // Remover a capa antiga 
            Storage::disk('public')->delete($filme->url_capa);
            $capaName = Str::random(10) . '.' . $request->file('capa')->getClientOriginalExtension();
            $capaPath = $request->file('capa')->storeAs('capas', $capaName, 'public');
            $dados['url_capa'] = $capaPath;
        }

        try {
            $this->service->update($dados, $id);
            return response()->json(['message' => 'Filme atualizado com sucesso!']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage(), 'mensagem' => 'Erro ao atualizar filme'], 500);
        }
    }


    public function destroy($id)
    {
        try {
            $this->service->delete($id);
        } catch (\Exception $e) {
            response()->json(['error' => $e->getMessage(), 'mensagem' => 'Erro ao deletar filme']);
        }

        return redirect()->route('filmes.index');
    }

    public function getAllPaginated($page, $size)
    {
        try {
            $filmes = $this->service->getAllPaginated($page, $size);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage(), 'mensagem' => 'Erro ao buscar filmes']);
        }

        return response()->json(['filmes' => $filmes]);
    }

    public function search(Request $request)
    {
        $dados = $request->only('search');

        try {
            $filmes = $this->service->search($dados['search']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage(), 'mensagem' => 'Erro ao buscar filmes']);
        }

        return response()->json(['filmes' => $filmes]);
    }

}
