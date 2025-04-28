<?php

use App\Http\Controllers\Admin\PermissaoController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
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

Route::controller(UserController::class)->prefix('users')->name('users.')->group(function () {
    Route::get('/all/{page}/{size}', 'getAllPaginated')->name('all'); 
    Route::delete('/{id}', 'delete')->name('delete');
})->middleware('auth:sanctum');

Route::controller(RoleController::class)->prefix('admin/role')->name('role.')->group( function(){
    Route::get('all', 'getAll')->name('all');
    Route::get('one/{id}', 'getOne')->name('one');
    Route::put('update/{id}','update')->name('update');
    Route::post('store', 'store')->name('store');
    Route::delete('delete/{id}', 'delete')->name('delete');
})->middleware('auth:sanctum');

Route::controller(PermissaoController::class)->prefix('admin/permissao')->name('permissao.')->group( function(){
    Route::get('all', 'getAll')->name('all');
    Route::get('all/{user_id}', 'getAllUser')->name('user');
    Route::get('one/{id}', 'getOne')->name('one');
    Route::post('create', 'create')->name('create');
    Route::delete('delete/{id}', 'delete')->name('delete');
})->middleware('auth:sanctum');