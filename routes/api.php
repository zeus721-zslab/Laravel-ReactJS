<?php
// routes/api.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;


Route::middleware('auth:sanctum')->group(function () {
    // ... 기존 /api/chat/users 라우트 ...

    // 특정 채팅방의 메시지 목록 조회 API 라우트
    Route::get('/chat/rooms/{roomId}/messages', [ChatController::class, 'getMessages'])
        ->where('roomId', '[0-9]+') // roomId는 숫자여야 함
        ->name('chat.messages'); // 라우트 이름 부여

    // 새 메시지 저장 API 라우트
    Route::post('/chat/messages', [ChatController::class, 'storeMessage'])
        ->name('chat.messages.store'); // 라우트 이름 부여

});

