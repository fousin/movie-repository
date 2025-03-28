<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Filme extends Model
{
    protected $fillable = ['titulo', 'sinopse', 'url_capa', 'url_filme'];
}
