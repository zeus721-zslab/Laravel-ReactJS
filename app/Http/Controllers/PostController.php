<?php
namespace App\Http\Controllers;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;

class PostController extends Controller
{

    /* ------------------------- WEB */
    public function list() : Response
    {
        $posts = Post::orderBy('created_at', 'desc')->get();
        $resp = [
            'lists' => $posts
        ];
        return Inertia::render('Posts/Index',$resp);
    }

    public function edit(int $id) : Response
    {
        $post = Post::findOrFail($id);

        $resp = [
            'posts' => $post
        ];
        return Inertia::render('Posts/Edit',$resp);
    }

    /* ------------------------- API */

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        $data = $request->all();
        $data['user_id'] = auth()->id();

        Post::create($data);
        return redirect()->route('posts.list');
    }

    public function show($id)
    {
        return Post::findOrFail($id); // 특정 포스트 반환
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        $post = Post::findOrFail($id);
        $post->update($request->all());

        return redirect()->route('posts.list');
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        $post->delete();

        return response()->json(null, 204); // 삭제된 포스트 응답
    }
}
