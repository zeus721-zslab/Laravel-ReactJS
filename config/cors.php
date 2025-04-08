<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    // ★ 수정 필요: 실제 API 경로 패턴 포함시키기
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout'],

    'allowed_methods' => ['*'],

    // ★ 수정 필요: 실제 프론트엔드 URL 목록으로 교체하기
    'allowed_origins' => [
        env('APP_URL', 'localhost'),
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'], // 필요 시 'Content-Type', 'X-Requested-With', 'Authorization', 'X-XSRF-TOKEN', 'Accept' 등으로 구체화

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // 이 값은 true 유지
];
