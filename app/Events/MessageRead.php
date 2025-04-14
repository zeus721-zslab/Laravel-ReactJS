<?php

// 파일 경로: app/Events/MessageRead.php
// 수정: ShouldQueue 추가, Channel 사용, broadcastWith에 recipientUserId 추가

namespace App\Events;

use Illuminate\Broadcasting\Channel; // ★ 일반 Channel 사용
use Illuminate\Broadcasting\InteractsWithSockets;
// use Illuminate\Broadcasting\PresenceChannel; // 필요 없어짐
// use Illuminate\Broadcasting\PrivateChannel; // 필요 없어짐
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Queue\ShouldQueue; // ★ ShouldQueue 임포트
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;


// ★ ShouldBroadcast 와 ShouldQueue 인터페이스 구현
class MessageRead implements ShouldBroadcast, ShouldQueue
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    // 속성은 그대로 유지
    public int $roomId;
    public array $messageIds;
    public Carbon $readAt;
    public int $recipientUserId; // ★ Node.js로 전달되어야 할 정보

    /**
     * 새 이벤트 인스턴스를 생성합니다.
     * (생성자 코드는 변경 없음)
     */
    public function __construct(int $roomId, array $messageIds, Carbon $readAt, int $recipientUserId)
    {
        $this->roomId = $roomId;
        $this->messageIds = $messageIds;
        $this->readAt = $readAt;
        $this->recipientUserId = $recipientUserId;

        Log::info('===== Worker Config Check =====', [
            'Default Prefix' => config('database.redis.default.prefix'),
            'Broadcast Connection Prefix' => config('database.redis.redis-broadcast.prefix'),
            'Broadcaster Connection Name' => config('broadcasting.connections.redis.connection'),
            'Default Broadcaster' => config('broadcasting.default'),
            'ENV REDIS_PREFIX' => env('REDIS_PREFIX', 'Not Set'), // .env 값 확인
            'ENV APP_NAME' => env('APP_NAME', 'laravel'), // .env 값 확인
        ]);

    }

    /**
     * 이벤트가 브로드캐스트될 채널을 가져옵니다.
     * Redis Pub/Sub으로 발행할 채널 이름을 지정합니다.
     * Node.js 서버는 이 채널 이름을 구독해야 합니다.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        // ★ 일반 채널 이름 사용 (Node.js 구독 채널과 일치시킬 이름)
        return [new Channel('chat-read-events')];
        // 또는 return [new Channel('chat-notifications')]; 등 원하는 이름 사용
    }

    /**
     * 이벤트의 브로드캐스트 이름입니다.
     * Node.js 서버가 받아서 Socket.IO로 emit할 이벤트 이름입니다.
     * (broadcastAs 메소드 코드는 변경 없음)
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'message.read';
    }

    /**
     * 브로드캐스트될 데이터를 가져옵니다. (Redis Pub/Sub으로 발행될 데이터)
     * Node.js 서버가 이 데이터를 받아 처리합니다.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'roomId' => $this->roomId,
            'messageIds' => $this->messageIds,
            'readAt' => $this->readAt->toIso8601String(),
            'recipientUserId' => $this->recipientUserId, // ★ Node.js가 타겟 유저를 알 수 있도록 반드시 포함
        ];
    }
}
