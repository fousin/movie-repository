<?php

use App\Http\Controllers\FilmeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::controller(FilmeController::class)->prefix('filmes')->name('filmes.')->group(function () {

    Route::get('/{id}', 'show')->name('show');

    Route::get('/all/{page}/{size}', 'show')->name('getAllPaginated');
    Route::post('/store', 'store')->name('store');
    Route::post('/searh', 'searh')->name('store');
    Route::put('/update/{id}', 'update')->name('update');
    Route::delete('/destroy/{id}', 'destroy')->name('destroy');
});







