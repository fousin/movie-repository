<?php
namespace App\Services;

use App\Models\Filme;

class FilmeService{
    public function __construct(protected Filme $filmeDB){}

    public function getAllPaginated(int $page, int $size){
        return $this->filmeDB->paginate($size, ['*'], 'page', $page);
    }

    public function getOne(int $id){
        return $this->filmeDB->findOrFail($id);
    }

    public function store(array $data){
        $this->filmeDB->create($data);
    }

    public function update(array $data, int $id){
        $filme = $this->filmeDB->findOrFail($id);
        return $filme->update($data);
    }

    public function delete(int $id){
        $filme = $this->filmeDB->findOrFail(id: $id);
        return $filme->delete();
    }

    public function search(string $search){
        return $this->filmeDB->where('titulo', 'like', "%$search%")->orWhere('sinopse', 'like', "%$search%")->get();
    }
}