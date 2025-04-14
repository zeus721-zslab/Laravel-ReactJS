<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// BelongsToMany 를 사용하기 위해 import 합니다.
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Room extends Model
{
    use HasFactory;

    /**
     * 대량 할당 가능한 속성입니다.
     * Room::create(['type' => '1on1']) 사용 시 필요합니다.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'type',
        'name', // name 컬럼도 사용한다면 추가
    ];

    /**
     * 이 채팅방에 속한 사용자들 관계 정의 (다대다)
     * 메소드 이름은 'users' 로 해야 whereHas('users', ...) 에서 인식합니다.
     */
    public function users(): BelongsToMany
    {
        // belongsToMany(연결할 모델::class, '피벗 테이블 이름', '현재 모델 외래 키', '연결 모델 외래 키')
        // 테이블/컬럼 이름이 Laravel 규칙(알파벳순, 단수형_id)을 따르면 중간 인자들 생략 가능
        // return $this->belongsToMany(User::class); // 규칙 따를 시 간단히 표현 가능

        // 명시적으로 모든 인자 지정 시 (더 안전할 수 있음)
        return $this->belongsToMany(User::class, 'room_user', 'room_id', 'user_id')
            ->withTimestamps(); // 피벗 테이블에 created_at, updated_at 이 있다면 추가
    }

    /**
     * 이 채팅방에 속한 메시지들 관계 정의 (일대다 - 향후 필요 시)
     */
    // public function messages(): \Illuminate\Database\Eloquent\Relations\HasMany
    // {
    //     return $this->hasMany(Message::class);
    // }
}
