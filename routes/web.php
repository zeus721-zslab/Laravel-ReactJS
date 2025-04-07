<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ChangeImg;
use App\Http\Controllers\ELKController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () { return redirect()->route('dashboard'); });
Route::get('/dashboard', function () {
    $deploymentTime = 'N/A';
    $filePath = storage_path('deployment_time.txt');
    if (File::exists($filePath)) $deploymentTime = trim(File::get($filePath));
    return Inertia::render('Dashboard' , [
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'deploymentTime'   => $deploymentTime
    ]);
})->name('dashboard');

Route::get('/posts/list', [PostController::class, 'list'])->name('posts.list');

Route::get('/changeImg', function(){
    return Inertia::render('changeImage/Index');
})->name('changeImg');

Route::get('/ELK', [ELKController::class, 'Index'])->name('elk');
// ELK 데이터 추가를 위한 API 라우트 (POST 방식)
Route::post('/ELK/add-data', [ELKController::class, 'store']);

/**
 *
 */
Route::middleware('auth')->group(function () {
    //프로필
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //Posts
    Route::get('/posts/create', function() { return Inertia::render('Posts/Create'); })->name('posts.create');
    Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
    Route::apiResource('posts', PostController::class);

    //Change Image
    Route::post('/changeImg/upload', [ChangeImg::class, 'upload']);



});

require __DIR__.'/auth.php';
