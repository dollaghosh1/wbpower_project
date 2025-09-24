<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserAdditionalDetails;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
     public function allUserList(Request $request)
        {
           
            $user = User::all();
            return response()->json([
                'success'=>true,
                'data'=>$user,
                'message'=>'User List successfully'
            ],200);
    
        }
    public function userDetails(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'data'    => $user->load('additionalDetail'),
            'message' => 'User details fetched successfully'
        ], 200);
    }
    public function UpdateUserDetails(Request $request)
{
    try {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated.'
            ], 401);
        }

        // ✅ Validate User table data
        $validatedData = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
        ]);

        // ✅ Validate Additional table data (rules only)
        $validatedAdditional = $request->validate([
            'user_address' => 'nullable|string|max:255',
            'user_image'   => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
            'user_role_id' => 'nullable|integer|exists:user_roles,id', // role must exist in roles table
        ]);

        // ✅ If user_role_id is missing, set default = 1
        if (!$request->has('user_role_id')) {
        $validatedAdditional['user_role_id'] = 1; // default role
        }

        // ✅ Update User
        $user->update($validatedData);

        // ✅ Handle Image Upload for additional details
        if ($request->hasFile('user_image')) {
            $imageName = time().'.'.$request->file('user_image')->extension();
            $request->file('user_image')->move(public_path('images/user'), $imageName);

            $validatedAdditional['user_image'] = 'images/user/' . $imageName;

            // Delete old image if exists
            if ($user->additionalDetail && $user->additionalDetail->user_image && file_exists(public_path($user->additionalDetail->user_image))) {
                unlink(public_path($user->additionalDetail->user_image));
            }
        }

        //✅ Update or Create additional details
        UserAdditionalDetails::updateOrCreate(
        ['user_id' => $user->id],
        $validatedAdditional
    );

        return response()->json([
            'success' => true,
            'data'    => $user->load('additionalDetail'),
            'message' => 'User details updated successfully'
        ], 200);

    } catch (ValidationException $e) {
        return response()->json([
            'success' => false,
            'errors'  => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Something went wrong: ' . $e->getMessage()
        ], 500);
    }
}
    public function deleteUserDetails(Request $request)
    {
       // echo 'test';exit;
         try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated.'
                ], 401);
            }
            $user->delete(); 
             return response()->json([
            'success' => true,
            'message' => 'User details delete successfully'
        ], 200);

         }
         catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        }

    }
}
