<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct(protected UserService $service)
    {
    }
    public function index(){
        $users = $this->service->getAllPaginated(1, 30);
        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }

    public function getAllPaginated($page, $size)
    {
        return $this->service->getAllPaginated($page, $size);
    }

    public function delete($id)
    {
        return $this->service->delete($id);
    }

}
