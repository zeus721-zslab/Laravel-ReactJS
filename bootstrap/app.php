<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
        api: __DIR__.'/../routes/api.php', // <--- 이 줄이 있는지, 경로가 맞는지 확인하세요!
        apiPrefix: 'api', // API 라우트의 기본 접두사 (보통 'api')

    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
        // api 그룹 별도 설정 확인 (필요 시)
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class, // API도 쿠키 기반 사용 시
            // 또는 'auth:sanctum' 미들웨어는 라우트 레벨에서 주로 사용
        ]);
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
