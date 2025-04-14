<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // BelongsTo 임포트

class Message extends Model
{
    use HasFactory;

    /**
     * 대량 할당이 가능한 속성입니다.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'room_id',  // <-- 추가
        'user_id',  // <-- 추가
        'content',  // <-- 추가
        // 필요에 따라 다른 대량 할당 허용 필드 추가
        'read_at', // 추가

    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'read_at' => 'datetime', // 추가 (자동 Carbon 인스턴스 변환)
    ];

    /**
     * 이 메시지를 보낸 사용자와의 관계 (역 N:1)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 이 메시지가 속한 채팅방과의 관계 (역 N:1)
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}
