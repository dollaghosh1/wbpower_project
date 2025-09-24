<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PostCategoryController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\SliderController;
use App\Http\Controllers\Api\CustomPostFormController;
use App\Http\Controllers\Api\CustomPostSubmissionController;
use App\Http\Controllers\Api\CustomPostFormTableController;


// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:api');
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::middleware('auth:api')->post('logout', [AuthController::class, 'logout']);
Route::get('alluserlist', [UserController::class, 'allUserList']);
Route::middleware('auth:api')->get('userdetails', [UserController::class, 'userDetails']);
Route::middleware('auth:api')->post('updateuserdetails', [UserController::class, 'updateUserDetails']);
Route::middleware('auth:api')->delete('deleteuserdetails', [UserController::class, 'deleteUserDetails']);

// Post Category
Route::middleware('auth:api')->post('addpostcategory', [PostCategoryController::class, 'addPostCategory']);
Route::middleware('auth:api')->get('allpostcategory', [PostCategoryController::class, 'allPostCategory']);
Route::middleware('auth:api')->get('postcategorydetails/{post_id}', [PostCategoryController::class, 'PostCategoryDetails']);
Route::middleware('auth:api')->put('updatepostcategory/{postcat_id}', [PostCategoryController::class, 'updatePostCategory']);
Route::middleware('auth:api')->delete('deletepostcategory/{postcat_id}', [PostCategoryController::class, 'deletePostCategory']);

// Post 
Route::middleware('auth:api')->post('addpost', [PostController::class, 'addPost']);
Route::middleware('auth:api')->get('allpost', [PostController::class, 'allPost']);
Route::middleware('auth:api')->get('postdetails/{post_id}', [PostController::class, 'PostDetails']);
Route::middleware('auth:api')->post('updatepost/{post_id}', [PostController::class, 'updatePost']);
Route::middleware('auth:api')->delete('deletepost/{post_id}', [PostController::class, 'deletePost']);
Route::middleware('auth:api')->get('category_wise_post/{postcat_id}', [PostController::class, 'CategoryWisePost']);
Route::middleware('auth:api')->put('updatepoststatus/{post_id}', [PostController::class, 'updatePostStatus']);

//Menu
Route::middleware('auth:api')->put('/menu', [MenuController::class, 'menuCreate']);
Route::middleware('auth:api')->get('/menu-list', [MenuController::class, 'menuList']);
Route::middleware('auth:api')->delete('deletemenu/{menu_id}', [MenuController::class, 'deleteMenu']);

// Slider 
Route::middleware('auth:api')->post('addslider', [SliderController::class, 'addSlider']);
Route::middleware('auth:api')->get('allslider', [SliderController::class, 'allSlider']);
Route::middleware('auth:api')->get('sliderdetails/{slider_id}', [SliderController::class, 'sliderDetails']);
Route::middleware('auth:api')->post('updateslider/{slider_id}', [SliderController::class, 'updateSlider']);
Route::middleware('auth:api')->delete('deleteslider/{slider_id}', [SliderController::class, 'deleteSlider']);
Route::middleware('auth:api')->put('updatesliderstatus/{post_id}', [SliderController::class, 'updateSliderStatus']);

//Custom Post Builder
Route::middleware('auth:api')->get('/postform-fields', [CustomPostFormController::class, 'index']);
Route::middleware('auth:api')->post('/postform-submissions', [CustomPostSubmissionController::class, 'store']);
Route::middleware('auth:api')->get('/postform-list', [CustomPostSubmissionController::class, 'getAllCustomPostList']);

//Create Custom Post Table
Route::middleware('auth:api')->post('/postformtable-fields', [CustomPostFormTableController::class, 'createCustomPostTable']);
Route::middleware('auth:api')->get('/postformtable-list', [CustomPostFormTableController::class, 'getCustomPostTables']);

Route::middleware('auth:api')->get('/custom-post-form-fields/{tableName}', [CustomPostFormTableController::class, 'getFormFields']);

    // Create a new custom post
Route::middleware('auth:api')->post('/custom-post/create/{tableName}', [CustomPostFormTableController::class, 'createCustomPost']);

    // List posts for a table
Route::middleware('auth:api')->get('/custom-post/list/{tableName}', [CustomPostFormTableController::class, 'listCustomPosts']);

