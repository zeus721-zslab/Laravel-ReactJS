<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// users.{userId} 형태의 Private 채널 인증
Broadcast::channel('users.{userId}', function ($user, $userId) {
    // 현재 로그인한 사용자($user)가 요청된 채널($userId)에 접근할 권한이 있는지 확인
    return (int) $user->id === (int) $userId;
}, ['guards' => ['web', 'sanctum']]); // ★ 인증 가드 지정 (필요시)
