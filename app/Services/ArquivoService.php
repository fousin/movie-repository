<?php
namespace App\Services;

use App\Models\Arquivo;
use App\Models\Filme;
use Storage;

class ArquivoService{


    public function __construct(protected Arquivo $arquivoDB)
    {
    }
    public function getAllPaginated(int $page, int $size)
    {
        return $this->arquivoDB->orderBy('id', 'desc')->paginate($size, ['*'], 'page', $page);
    }
    
    public function store(array $data)
    {
        return $this->arquivoDB->create($data);
    }

    public function delete(int $id)
    {
        $file = $this->arquivoDB->find($id);
        Storage::disk('public')->delete($file->url);
        return $file->delete();
    }

    public function deletesByFilme(int $filme_id)
    {
        $filme = Filme::findOrFail($filme_id);
        
        Storage::disk('public')->delete($filme->url_capa);
        Storage::disk('public')->delete($filme->url_filme);

        $this->arquivoDB->where('url_capa', $filme->url_capa)->delete();
        $this->arquivoDB->where('url_capa', $filme->url_filmea)->delete();

        return $filme->delete();
    }

}