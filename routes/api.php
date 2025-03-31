<?php

use App\Http\Controllers\ArquivoController;
use App\Http\Controllers\FilmeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::controller(FilmeController::class)->prefix('filmes')->name('filmes.')->group(function () {

    Route::get('/{id}', 'show')->name('show');
    Route::get('/all/{page}/{size}', 'getAllPaginated')->name('all');
    Route::post('/store', 'store')->name('store');
    Route::post('/searh', 'searh')->name('searh');
    Route::post('/update/{id}', 'update')->name('update');
    Route::delete('/{id}', 'destroy')->name('destroy');
    
})->middleware('auth:sanctum');

Route::controller(ArquivoController::class)->prefix('arquivos')->name('arquivos.')->group(function () {
    Route::get('/all/{page}/{size}', 'getAllPaginated')->name('all'); 
    Route::post('/store', 'store')->name('store');
    Route::delete('/{id}', 'delete')->name('delete');
    Route::delete('/filme/{filme_id}', 'deletesByFilme')->name('deletesByFilme');
})->middleware('auth:sanctum');






