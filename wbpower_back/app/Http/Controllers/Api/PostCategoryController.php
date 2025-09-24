<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\PostCategory;

class PostCategoryController extends Controller
{
      public function addPostCategory(Request $request)
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
            $validated = $request->validate([
                'category_name' => 'required|string|max:255',
                'category_slug' => 'nullable|string',
                'category_desc' => 'nullable|string',
                'category_parent' => 'nullable|integer',
              
            ]);

            $PostCategory = PostCategory::create($validated);

            return response()->json([
                 'success'=>true,
                'data'=>$PostCategory,
                'message'=>'Post category created successfully!'
            ], 200);
        }catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        }
        
     }
     public function allPostCategory(Request $request)
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
            $AllPostCategory = PostCategory::orderBy('id', 'desc')->get();
            return response()->json([
               'success'=>true,
                'data'=>$AllPostCategory,
                'message'=>'Post category list successfully'
            ], 200);
        }catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        }
        
     }
     public function PostCategoryDetails(Request $request, $post_cat_id)
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

            $Post_category_details = PostCategory::find($post_cat_id);

            if (!$Post_category_details) {
                return response()->json(['message' => 'Post Caegory not found'], 404);
            }


            return response()->json([
                'success' => true,
                'data' => $Post_category_details,
                'message' => 'Post Category Details successfully!'
            ]);
           

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        }
    }
     public function updatePostCategory(Request $request, $postcat_id)
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
           $PostCategory = PostCategory::find($postcat_id);
            //return $PostCategory; exit;
        if (!$PostCategory) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        // Validate input
       $validated = $request->validate([
                'category_name' => 'required|string|max:255',
                'category_slug' => 'nullable|string',
                'category_desc' => 'nullable|string',
                'category_parent' => 'nullable|integer',
              
            ]);

        if ($request->has('category_name')) {
            $PostCategory->category_name = $request->category_name;
        }
        if ($request->has('category_slug')) {
            $PostCategory->category_slug = $request->category_slug;
        }
        if ($request->has('category_desc')) {
            $PostCategory->category_desc = $request->category_desc;
        }
         if ($request->has('category_parent')) {
            $PostCategory->category_parent = $request->category_parent;
        }
        $PostCategory->save();

        return response()->json([
              'success'=>true,
                'data'=>$PostCategory,
                'message'=>'Post category updated successfully!'
        ]);
        }catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        }
        
     }
        public function deletePostCategory(Request $request, $postcat_id)
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
           $PostCategory = PostCategory::find($postcat_id);
            //return $PostCategory; exit;
        if (!$PostCategory) {
            return response()->json(['message' => 'Post not found'], 404);
        }
       $PostCategory->delete();
        return response()->json([
              'success'=>true,
              'message'=>'Post category deleted successfully!'
        ]);
        }catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        }
        
     }
}
