<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],
    'elasticsearch' => [
        'hosts' => [
            [
                'host' => env('ELASTICSEARCH_HOST', 'elk_elasticsearch'),
                'port' => env('ELASTICSEARCH_PORT', 9200),
                'scheme' => env('ELASTICSEARCH_SCHEME', 'http'),
                // 필요시 사용자/비밀번호 추가
                // 'user' => env('ELASTICSEARCH_USER'),
                // 'pass' => env('ELASTICSEARCH_PASSWORD'),
            ],
            // 노드가 여러 개일 경우 여기에 추가
        ],
        // 기타 설정 (예: 재시도 횟수, 타임아웃 등)
        // 'retries' => 2,
    ],

];
