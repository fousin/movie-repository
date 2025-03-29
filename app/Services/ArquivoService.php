<?php
namespace App\Services;

use App\Models\Arquivo;
use App\Models\Filme;
use Storage;

class ArquivoService{


    public function __construct(protected Arquivo $arquivoDB)
    {
    }

    public function store(array $data)
    {
        return $this->arquivoDB->create($data);
    }

    public function delete(int $id)
    {
        return $this->arquivoDB->find($id)->delete();
    }

    public function deletesByFilme(int $filme_id)
    {
        $filme = Filme::findOrFail($filme_id);
        $this->arquivoDB->where('url', )->delete();
        return $filme->delete();
    }

}