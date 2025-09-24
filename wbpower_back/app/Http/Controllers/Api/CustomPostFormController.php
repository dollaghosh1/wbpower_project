<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\CustomPostForm;


class CustomPostFormController extends Controller
{
   
          
    //         public function index()
    //         {
    //               try
    //         {
    //                 $user = Auth::user();

    //                         if (!$user) {
    //                             return response()->json([
    //                                 'success' => false,
    //                                 'message' => 'Unauthorized'
    //                             ], 401);
    //                         }
    //             // return $user;
    //                 return response()->json(CustomPostForm::all());
            
    //         }catch (ValidationException $e) {
    //             return response()->json([
    //                 'success' => false,
    //                 'errors'  => $e->errors()
    //             ], 422);
    //         } 
    // }
    
}
