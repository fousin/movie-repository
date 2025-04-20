<?php

use App\Http\Controllers\ArquivoController;
use App\Http\Controllers\FilmeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', [FilmeController::class, 'index'])->name('filmes.index');
Route::get('filmes/show/{id}', [FilmeController::class, 'show']);

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [FilmeController::class, 'dashboard'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/arquivos', [ArquivoController::class, 'index'])->name('arquivos.index');
    Route::get('filmes/create', [FilmeController::class, 'create']);
    Route::get('filmes/edit/{id}', [FilmeController::class, 'edit']);
});

require __DIR__ . '/auth.php';
