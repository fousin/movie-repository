<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Arquivo extends Model
{
    protected $fillable = [
        'original_name',
        'name',
        'url',
        'type',
    ];
}
