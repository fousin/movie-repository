<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AutorizacaoMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $modulo): Response
    {
        dd($modulo);
        $user = auth()->user()->load('permissoes.role');
        foreach($user->permissoes as $permissao) {
            if ($permissao->role->name == 'admin' || $permissao->role->name == $modulo) {
                return $next($request);
            }
        }
        abort(403, 'Acesso negado');
    }
}
