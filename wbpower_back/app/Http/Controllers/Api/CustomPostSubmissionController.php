<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CustomPostFormSubmission;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\CustomPostForm;

class CustomPostSubmissionController extends Controller
{
public function store(Request $request)
{
    try {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $request->validate([
            'category_id' => 'required|exists:post_categories,id',
            'data' => 'required|array',
        ]);

        $data = $request->data;

        // Handle files inside nested data
        foreach ($data as $key => $value) {
            if ($request->hasFile("data.$key")) {
                $fileField = $request->file("data.$key");

                if (is_array($fileField)) {
                    $paths = [];
                    foreach ($fileField as $singleFile) {
                        $imageName = time() . '_' . uniqid() . '.' . $singleFile->getClientOriginalExtension();
                        $singleFile->move(public_path('images/custom_posts'), $imageName);
                        $paths[] = 'images/custom_posts/' . $imageName;
                    }
                    $data[$key] = $paths;
                } else {
                    $imageName = time() . '_' . uniqid() . '.' . $fileField->getClientOriginalExtension();
                    $fileField->move(public_path('images/custom_posts'), $imageName);
                    $data[$key] = 'images/custom_posts/' . $imageName;
                }
            }
        }

        $submission = CustomPostFormSubmission::create([
            'data' => $data,
            'category_id' => $request->category_id,
        ]);

        return response()->json([
            'message' => 'Form submitted successfully!',
            'submission' => $submission,
        ], 201);

    } catch (ValidationException $e) {
        return response()->json([
            'success' => false,
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        \Log::error('Form submission error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Server error: ' . $e->getMessage()
        ], 500);
    }
}
  public function getAllCustomPostList(Request $request)
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
            $AllCustomPost = CustomPostFormSubmission::with(['category:id,category_name']) // eager load category
                ->orderBy('id', 'desc')
                ->get();
            return response()->json([
               'success'=>true,
                'data'=>$AllCustomPost,
                'message'=>'Custom Post listed successfully'
            ], 200);
        }catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        } 

     }

}
