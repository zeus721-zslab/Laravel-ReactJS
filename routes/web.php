<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

//Route::get('/', function () {
//    return Inertia::render('Welcome', [
//        'canLogin' => Route::has('login'),
//        'canRegister' => Route::has('register'),
//        'laravelVersion' => Application::VERSION,
//        'phpVersion' => PHP_VERSION,
//    ]);
//});

//Route::get('/dashboard', function () {
//    return Inertia::render('Dashboard');
//})->middleware(['auth', 'verified'])->name('dashboard');



Route::get('/', function () { return redirect()->route('dashboard'); });
Route::get('/dashboard', function () {

    $deploymentTime = env('DEPLOYMENT_TIME', 'N/A'); // 환경 변수가 없으면 'N/A'를 기본값으로 사용
    return Inertia::render('Dashboard' , [
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'deploymentTime'   => $deploymentTime
    ]);

})->name('dashboard');

Route::get('/posts/list', [PostController::class, 'list'])->name('posts.list');

/**
 *
 */
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/posts/create', function() { return Inertia::render('Posts/Create'); })->name('posts.create');
    Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');

    Route::apiResource('posts', PostController::class);
});

require __DIR__.'/auth.php';
