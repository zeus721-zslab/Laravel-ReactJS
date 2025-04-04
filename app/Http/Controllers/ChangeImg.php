<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Auth; // Auth 파사드 사용

class ChangeImg extends Controller
{

    public function upload(Request $request)
    {
        if ($request->hasFile('image')) {

            $path = $request->file('image')->store('uploads');

            // 현재 인증된 사용자의 ID를 가져옵니다.
            $userId = Auth::id();
            $payload = json_encode(['path' => $path, 'user_id' => $userId]);

            Redis::publish('image_processing_queue', $payload);

            return response()->json(['message' => '이미지 업로드 및 처리 요청 성공', 'path' => $path]);

        }

        return response()->json(['error' => '업로드된 이미지가 없습니다..'], 400);
    }
}

