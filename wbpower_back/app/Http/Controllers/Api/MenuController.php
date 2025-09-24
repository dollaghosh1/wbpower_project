<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\Menu;
use App\Http\Resources\MenuResource;

class MenuController extends Controller
{
   
    public function menuCreate(Request $request)
    {
        // Validate incoming JSON data
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
                'title'     => 'required|string|max:255',
                'url'       => 'required|string|max:255',
                'parent_id' => 'nullable|exists:menus,id',
                'order'     => 'nullable|integer',
                'active'    => 'nullable|boolean',
              
                ]);
                //return $validated;
        // Create menu from validated data
        $menu = Menu::create([
            'title'     => $request->title,
            'url'       => $request->url,
            'parent_id' => $request->parent_id,
            'order'     => $request->order ?? 0,
            'active'    => $request->active ?? true,
        ]);

        return response()->json([
            'message' => 'Menu created successfully',
            'data' => $menu,
        ], 201);
    
    }catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        }
}
  public function menuList(Request $request)
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

        $menus = Menu::whereNull('parent_id')
            ->where('active', true)
            ->orderBy('order')
            ->with('childrenRecursive') // <-- recursive eager loading here
            ->get();

        return MenuResource::collection($menus);

    } catch (ValidationException $e) {
        return response()->json([
            'success' => false,
            'errors'  => $e->errors()
        ], 422);
    } 
}
 public function deleteMenu(Request $request, $menu_id)
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
           $Menu = Menu::find($menu_id);
           // return $Post; exit;
        if (!$Menu) {
            return response()->json(['message' => 'Post not found'], 404);
        }
       $Menu->delete();
        return response()->json([
              'success'=>true,
              'message'=>'Menu deleted successfully!'
        ]);
        }catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        }
        
     }
}
