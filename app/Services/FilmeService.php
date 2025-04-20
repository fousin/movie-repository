<?php
namespace App\Services;

use App\Models\Filme;
use Storage;

class FilmeService
{
    public function __construct(protected Filme $filmeDB)
    {
    }

    public function getAllPaginated(int $page, int $size)
    {
        $filmes = $this->filmeDB->paginate($size, ['*'], 'page', $page);
        foreach($filmes as $filme) {
            $filme->url_capa = env('APP_URL') . '/storage/' . ($filme->url_capa ?? 'capas/default-capa.jpg');
            $filme->url_filme = env('APP_URL') . '/storage/' . $filme->url_filme;
        }
        return $filmes;
    }

    public function getOne(int $id)
    {
        return $this->filmeDB->findOrFail($id);
    }

    public function store(array $data)
    {
        $this->filmeDB->create($data);
    }

    public function update(array $data, int $id)
    {
        $filme = $this->filmeDB->findOrFail($id);
        return $filme->update($data);
    }

    public function delete(int $id)
    {
        $filme = $this->filmeDB->findOrFail($id);

        Storage::disk('public')->delete($filme->url_capa);
        Storage::disk('public')->delete($filme->url_filme);

        return $filme->delete();
    }

    public function search(string $search)
    {
        return $this->filmeDB->where('titulo', 'like', "%$search%")->orWhere('sinopse', 'like', "%$search%")->get();
    }
}