<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\PostCategory;
use App\Models\Post;

class PostController extends Controller
{
    public function addPost(Request $request)
    {
        try
        {
            $user = Auth::user();

                if (!$user) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Unauthorized'
                    ], 401);
                }
                //return $user;
            $validated = $request->validate([
                'post_name' => 'required|string|max:255',
                'post_desc' => 'nullable|string',
                'post_image'   => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
                'post_category_id' => 'nullable|integer',
              
                ]);
             $imagePath = null;

            if ($request->hasFile('post_image')) 
            {
        
                 $imageName = time() . '.' . $request->post_image->extension();
                 $request->post_image->move(public_path('image/post'), $imageName);
                 $imagePath = 'image/post/' . $imageName;
               
            }

            $post = Post::create([
                'post_name'   => $request->post_name,
                'post_desc' => $request->post_desc,
                'post_image'   => $imagePath,
                'post_category_id' => $request->post_category_id,

            ]);

            return response()->json([
                'success'=>true,
                'data'=>$post,
                'message'=>'Post created successfully!'
            ], 200);
        }catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        }
        
     }
     public function allPost(Request $request)
    {
        try
        {
            $user = Auth::user();

                if (!$user) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Unauthorized'
                    ], 401);
                }
            $AllPost = Post::with(['category:id,category_name']) // eager load category
                ->orderBy('id', 'desc')
                ->get();
            return response()->json([
               'success'=>true,
                'data'=>$AllPost,
                'message'=>'Post listed successfully'
            ], 200);
        }catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        } 

     }
      public function Postdetails(Request $request, $post_id)
    {
        //return $post_id;
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            $Post_details = Post::find($post_id);

            if (!$Post_details) {
                return response()->json(['message' => 'Post not found'], 404);
            }


            return response()->json([
                'success' => true,
                'data' => $Post_details,
                'message' => 'Post updated successfully!'
            ]);
           

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        }
    }
     public function updatePost(Request $request, $post_id)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            $Post = Post::find($post_id);

            if (!$Post) {
                return response()->json(['message' => 'Post not found'], 404);
            }
              $validated = $request->validate([
            'post_name' => 'required|string|max:255',
            'post_desc' => 'nullable|string',
            'post_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'post_category_id' => 'nullable|integer',
            ]);

            if ($request->filled('post_name')) {
                $Post->post_name = $request->post_name;
            }

            if ($request->filled('post_desc')) {
                $Post->post_desc = $request->post_desc;
            }

            if ($request->hasFile('post_image')) {
                // Delete old image if exists
                if ($Post->post_image && file_exists(public_path($Post->post_image))) {
                    unlink(public_path($Post->post_image));
                }

                $imageName = time().'.'.$request->file('post_image')->extension();
                $request->file('post_image')->move(public_path('image/post'), $imageName);

                $Post->post_image = 'image/post/' . $imageName;
            }

            if ($request->filled('post_category_id')) {
                $Post->post_category_id = $request->post_category_id;
            }

            $Post->save();

            return response()->json([
                'success' => true,
                'data' => $Post,
                'message' => 'Post updated successfully!'
            ]);
           

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        }
    }
     public function updatePostStatus(Request $request, $post_id)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            $Post = Post::find($post_id);
          //  return $Post;
            if (!$Post) {
                return response()->json(['message' => 'Post not found'], 404);
            }
              $request->validate([
                'is_active' => 'required|boolean',
            ]);

            //return $request->is_active;
            $Post->is_active = $request->is_active;
             $Post->save();

            return response()->json([
                'success' => true,
                'message' => 'Post status updated successfully!'
            ]);
           

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        }
    }
     public function deletePost(Request $request, $post_id)
    {
        try
        {
           // echo $postcat_id;exit;
            $user = Auth::user();

                if (!$user) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Unauthorized'
                    ], 401);
                }
           $Post = Post::find($post_id);
           // return $Post; exit;
        if (!$Post) {
            return response()->json(['message' => 'Post not found'], 404);
        }
       $Post->delete();
        return response()->json([
              'success'=>true,
              'message'=>'Post deleted successfully!'
        ]);
        }catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        }
        
     }
      public function CategoryWisePost(Request $request, $postcat_id)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            $Post = Post::where('post_category_id', $postcat_id)->get();

            if (!$Post) {
                return response()->json(['message' => 'Post not found'], 404);
            }
         

            return response()->json([
                'success' => true,
                'data' => $Post,
                'message' => 'Post updated successfully!'
            ]);
           

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        }
    }
}
