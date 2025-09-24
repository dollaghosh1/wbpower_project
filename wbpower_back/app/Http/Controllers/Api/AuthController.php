<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;

class AuthController extends Controller
{
     public function register(Request $request)
            {
              
                try {
                    $request->validate([
                        'name' => 'required|string|max:255',
                        'email' => 'required|string|email|max:255|unique:users',
                        'phone' => 'nullable|string|max:20',
                        'password' => 'required|string|min:8|confirmed',
                    ]);

                    $user = User::create([
                        'name' => $request->name,
                        'email' => $request->email,
                        'phone' => $request->phone,
                        'password' => Hash::make($request->password),
                    ]);
                     $user_role = $request->user_role;
                     $role = Role::where('name', $user_role)->where('guard_name', 'api')->first();

                    if (!$role) {
                        return response()->json(['error' => 'Role not found or invalid guard.'], 422);
                    }

                      // Assign the role model to the user
                     $user->assignRole($role);
                    
                    $token = $user->createToken('authToken')->accessToken;

                    return response()->json(['user' => $user, 'access_token' => $token]);
                }
                catch (ValidationException $e) {
                        return response()->json([
                            'errors' => $e->errors()
                        ], 422);
                    }
            }
                

    public function login(Request $request)
        {
                try {
                    $credentials = $request->validate([
                        'email' => 'required|string|email',
                        'password' => 'required|string',
                    ]);

                    if (!Auth::attempt($credentials)) {
                        return response()->json(['message' => 'Unauthorized'], 401);
                    }

                    $user = $request->user();
                    $token = $user->createToken('authToken')->accessToken;

                    return response()->json(['user' => $user, 'access_token' => $token]);
                }
                catch (ValidationException $e) {
                        return response()->json([
                            'errors' => $e->errors()
                        ], 422);
                    }
        }
     public function logout(Request $request)
        {
            $user = Auth::user();
            
            $user->token()->revoke(); // Revoke the current access token

            return response()->json([
                'success' => true,
                'message' => 'Successfully logged out'
            ], 200);
            
        }
     
}
