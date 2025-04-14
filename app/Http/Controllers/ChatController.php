<?php
namespace App\Http\Controllers;
use Inertia\Response;
use Inertia\Inertia;
use App\Models\User; // User 모델 임포트
use App\Models\Message; // Message 모델 임포트
use App\Models\Room; // Room 모델 임포트
use Illuminate\Support\Facades\Auth; // Auth 파사드 임포트
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse; // JsonResponse 임포트
use Illuminate\Validation\Rule; // Rule 임포트
use App\Events\MessageRead; // ★ 아래에서 생성할 이벤트
use Illuminate\Support\Facades\Log; // Log Facade 추가

class ChatController extends Controller
{

    /* ------------------------- WEB */
    public function index(): Response
    {

        // 현재 로그인한 사용자 ID 가져오기
        $currentUserId = Auth::id();

        // 현재 사용자를 제외한 모든 사용자 조회 (id, name, email 컬럼만 선택)
        // 필요에 따라 가져올 컬럼을 조정하세요.
        $users = User::where('id', '!=', $currentUserId)
            ->select('id', 'name', 'email') // 필요한 정보만 선택적으로 가져옵니다.
            ->get();

        /* 만약 routes/web.php 에서 Inertia 렌더링 시 전달한다면 아래와 같이 사용*/
        return inertia('Chat/Index', [ // Chat/Index 페이지 렌더링
            'chatUsers' => $users // props 로 사용자 목록 전달
        ]);

    }


    public function room(User $user): Response
    {
        $currentUser = Auth::user(); // 현재 로그인한 사용자

        // 본인과 채팅 불가 처리
        if ($currentUser->id === $user->id) {
            abort(403, 'You cannot chat with yourself.');
        }

        // 1. 기존 1:1 채팅방 찾기
        // 두 사용자(currentUser와 targetUser) 모두 참여하고 있는 '1on1' 타입의 방을 검색
        $room = Room::where('type', '1on1')
            ->whereHas('users', function ($query) use ($currentUser) {
                $query->where('user_id', $currentUser->id);
            })
            ->whereHas('users', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->first();

        // 2. 채팅방이 없으면 새로 생성
        if (!$room) {
            $room = Room::create(['type' => '1on1']); // 새 1:1 방 생성
            // 생성된 방에 두 사용자 참여 정보 추가 (room_user 테이블)
            $room->users()->attach([$currentUser->id, $user->id]);
            // $room->refresh(); // 필요 시 관계 로드를 위해 refresh
        }

        // 3. Inertia 렌더링 시 roomId 전달
        return Inertia::render('Chat/Room', [
            'targetUser' => $user->only(['id', 'name', 'email']),
            'roomId' => $room->id // <--- 찾거나 생성한 채팅방의 ID를 전달
        ]);
    }

    /**
     * 특정 채팅방의 메시지 목록을 가져옵니다. (Pagination 적용)
     *
     * @param Request $request
     * @param int $roomId
     * @return JsonResponse
     */
    public function getMessages(Request $request, int $roomId): JsonResponse
    {
        // 1. 사용자가 이 채팅방에 참여하고 있는지 권한 확인 (매우 중요!)
        $user = Auth::user();
        $room = Room::whereHas('users', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->find($roomId); // findOrFail($roomId) 사용도 가능

        if (!$room) {
            return response()->json(['message' => 'Unauthorized or Room not found.'], 403);
        }

        // 2. 메시지 조회 (Pagination 적용, 최신 메시지가 마지막 페이지에 오도록)
        $messages = Message::where('room_id', $roomId)
            ->with('user:id,name') // 보낸 사람 정보(id, name) 함께 로드 (Eager Loading)
            ->orderBy('created_at', 'desc') // 시간 오름차순 정렬
            ->paginate(50); // 예시: 한 페이지당 50개 메시지

        // 3. JSON 형태로 결과 반환 (Laravel Pagination 기본 구조 사용)
        return response()->json($messages);
    }
    /**
     * 새 채팅 메시지를 저장합니다.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function storeMessage(Request $request): JsonResponse
    {
        // 1. 데이터 유효성 검사
        $validated = $request->validate([
            'roomId' => [
                'required',
                'integer',
                // 현재 사용자가 해당 roomId에 속해 있는지 확인하는 Rule 추가 (매우 중요!)
                Rule::exists('room_user', 'room_id')->where(function ($query) {
                    $query->where('user_id', Auth::id());
                }),
            ],
            'message' => 'required|string|max:65535', // TEXT 컬럼 최대 길이에 맞춰 조정 가능
        ]);

        $roomId = $validated['roomId'];
        $content = $validated['message'];
        $userId = Auth::id();

        // 2. 메시지 생성 및 저장
        $message = Message::create([
            'room_id' => $roomId,
            'user_id' => $userId,
            'content' => $content,
        ]);

        // 3. 저장된 메시지 정보 반환 (보낸 사용자 정보 포함 - Eager Loading)
        // 실시간 전송 및 화면 표시에 필요한 정보 포함
        $newMessage = Message::with('user:id,name') // user 관계 로드 (id, name만)
        ->findOrFail($message->id);

        // (선택) 다른 사용자에게 이벤트 방송 트리거 (Laravel Echo 사용 시)
        // broadcast(new NewMessageSent($newMessage))->toOthers();

        // 4. JSON 형태로 새로 생성된 메시지 반환
        return response()->json($newMessage, 201); // 201 Created 상태 코드
    }

    public function markAsRead(Request $request, $roomId)
    {
        $messageIds = $request->input('messageIds', []);
        if (empty($messageIds)) {
            return response()->json(['status' => 'no_ids'], 400);
        }

        // 현재 사용자가 읽지 않은, *상대방이 보낸* 메시지만 찾아 업데이트
        $messagesToUpdate = Message::whereIn('id', $messageIds)
            ->where('room_id', $roomId)
            ->where('user_id', '!=', auth()->id()) // 내가 보내지 않은 메시지
            ->whereNull('read_at') // 아직 읽지 않은 메시지
            ->get();

        if ($messagesToUpdate->isEmpty()) {
            return response()->json(['status' => 'no_messages_to_update'], 200);
        }

        // 읽음 처리 업데이트
        $updatedIds = $messagesToUpdate->pluck('id')->toArray();
        Message::whereIn('id', $updatedIds)->update(['read_at' => now()]);

        // ★ WebSocket 이벤트 발행 (메시지 발신자에게 알림)
        //   - 이벤트에는 어떤 메시지들이 읽혔는지 ID 목록과 읽은 시간 전송
        //   - 메시지 발신자(들)을 알아내야 함 (1:1 채팅에서는 상대방 ID)
        //   - 예: 첫번째 업데이트된 메시지의 발신자 ID 가져오기
        $senderId = $messagesToUpdate->first()->user_id; // 알림 받을 상대방 ID
        $now = now(); // 이벤트 발생 시각 변수화

        // --- ★ 로그 추가하여 broadcast 호출 확인 ★ ---
        Log::info("Attempting to dispatch/broadcast MessageRead event for room {$roomId}", [
            'updatedIds' => $updatedIds,
            'recipientUserId' => $senderId
        ]);
        try {
            // 여기가 이벤트 발행(Dispatch) 및 큐잉 지점
            broadcast(new MessageRead($roomId, $updatedIds, $now, $senderId));

            // ★ 이 로그가 찍히는지 확인! ★
            Log::info('MessageRead broadcast() call completed successfully.');

        } catch (\Throwable $e) { // Throwable 로 변경하여 더 넓은 범위의 오류 감지
            Log::error('Failed during broadcast() call:', [ // ★ 에러 발생 시 로그 확인!
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString() // 상세 스택 트레이스 로깅
            ]);
            // 오류 발생 시 클라이언트에게 오류 응답을 보낼 수도 있습니다.
            // return response()->json(['status' => 'broadcast_dispatch_error'], 500);
        }
        // --- ★ 여기까지 ★ ---

        return response()->json(['status' => 'success', 'updated_ids' => $updatedIds], 200);
    }

}
