<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\Slider;

class SliderController extends Controller
{
    public function addSlider(Request $request)
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
                'slider_name' => 'required|string|max:255',
                'slider_desc' => 'nullable|string',
                'slider_image'   => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
              
                ]);
             $imagePath = null;

            if ($request->hasFile('slider_image')) 
            {
        
                 $imageName = time() . '.' . $request->slider_image->extension();
                 $request->slider_image->move(public_path('image/Slider'), $imageName);
                 $imagePath = 'image/Slider/' . $imageName;
               
            }

            $Slider = Slider::create([
                'slider_name'   => $request->slider_name,
                'slider_desc' => $request->slider_desc,
                'slider_image'   => $imagePath,

            ]);

            return response()->json([
                'success'=>true,
                'data'=>$Slider,
                'message'=>'Slider created successfully!'
            ], 200);
        }catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        }
        
     }
     public function allSlider(Request $request)
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
         $AllSlider = Slider::orderBy('id', 'desc')->get();
            return response()->json([
               'success'=>true,
                'data'=>$AllSlider,
                'message'=>'Slider listed successfully'
            ], 200);
        }catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        } 

     }
      public function Sliderdetails(Request $request, $Slider_id)
    {
        //return $Slider_id;
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            $Slider_details = Slider::find($Slider_id);

            if (!$Slider_details) {
                return response()->json(['message' => 'Slider not found'], 404);
            }


            return response()->json([
                'success' => true,
                'data' => $Slider_details,
                'message' => 'Slider updated successfully!'
            ]);
           

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        }
    }
     public function updateSlider(Request $request, $Slider_id)
{
    try {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $Slider = Slider::find($Slider_id);

        if (!$Slider) {
            return response()->json(['message' => 'Slider not found'], 404);
        }

        $validated = $request->validate([
            'slider_name' => 'required|string|max:255',
            'slider_desc' => 'nullable|string',
            'slider_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->filled('slider_name')) {
            $Slider->slider_name = $request->slider_name;  // lowercase property name
        }

        if ($request->filled('slider_desc')) {
            $Slider->slider_desc = $request->slider_desc;  // lowercase property name
        }

        if ($request->hasFile('slider_image')) {
            // Delete old image if exists
            if ($Slider->slider_image && file_exists(public_path($Slider->slider_image))) {
                unlink(public_path($Slider->slider_image));
            }

            $imageName = time().'.'.$request->file('slider_image')->extension();
            $request->file('slider_image')->move(public_path('image/Slider'), $imageName);

            $Slider->slider_image = 'image/Slider/' . $imageName;  // lowercase property name
        }

        $Slider->save();

        return response()->json([
            'success' => true,
            'data' => $Slider,
            'message' => 'Slider updated successfully!'
        ]);

    } catch (ValidationException $e) {
        return response()->json([
            'success' => false,
            'errors' => $e->errors()
        ], 422);
    }
}
     public function updateSliderStatus(Request $request, $Slider_id)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            $Slider = Slider::find($Slider_id);
          //  return $Slider;
            if (!$Slider) {
                return response()->json(['message' => 'Slider not found'], 404);
            }
              $request->validate([
                'is_active' => 'required|boolean',
            ]);

            //return $request->is_active;
            $Slider->is_active = $request->is_active;
             $Slider->save();

            return response()->json([
                'success' => true,
                'message' => 'Slider status updated successfully!'
            ]);
           

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        }
    }
     public function deleteSlider(Request $request, $Slider_id)
    {
        try
        {
           // echo $Slidercat_id;exit;
            $user = Auth::user();

                if (!$user) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Unauthorized'
                    ], 401);
                }
           $Slider = Slider::find($Slider_id);
           // return $Slider; exit;
        if (!$Slider) {
            return response()->json(['message' => 'Slider not found'], 404);
        }
       $Slider->delete();
        return response()->json([
              'success'=>true,
              'message'=>'Slider deleted successfully!'
        ]);
        }catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors()
            ], 422);
        }
        
     }

}
