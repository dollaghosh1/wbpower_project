<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Schema\Blueprint;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;


class CustomPostFormTableController extends Controller
{
    // API for creating a dynamic table
  public function createCustomPostTable(Request $request)
{
    try {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $tableName = $request->input('table_name');  
        $fields = $request->input('fields');        

        // Validate
        if (empty($tableName) || empty($fields) || !is_array($fields)) {
            return response()->json(['error' => 'Invalid input'], 400);
        }

        // Add prefix to table name and convert to lowercase
        $tableName = 'custompost_' . Str::snake(strtolower($tableName));

        // Check if table already exists
        if (Schema::hasTable($tableName)) {
            return response()->json(['error' => 'Table already exists'], 400);
        }

        // Create table
        Schema::create($tableName, function (Blueprint $table) use ($fields) {
            $table->id(); // primary key

            foreach ($fields as $fieldName => $fieldType) {
                // Convert column name to lowercase snake_case
                $fieldName = Str::snake(strtolower($fieldName));

                switch ($fieldType) {
                    case 'string':
                        $table->string($fieldName)->nullable();
                        break;
                    case 'integer':
                        $table->integer($fieldName)->nullable();
                        break;
                    case 'text':
                    case 'textarea':
                        $table->text($fieldName)->nullable();
                        break;
                    case 'ckeditor':
                    case 'richtext':
                        $table->longText($fieldName)->nullable();
                        break;
                    case 'boolean':
                        $table->boolean($fieldName)->default(false);
                        break;
                    case 'date':
                        $table->date($fieldName)->nullable();
                        break;
                    case 'file':
                        $table->string($fieldName)->nullable(); // path to file
                        break;
                    default:
                        $table->string($fieldName)->nullable(); // fallback
                }
            }

            // Add the is_active column with a default value of 1
            $table->boolean('is_active')->default(1); // 1 means true

            $table->timestamps();
        });

        return response()->json(['success' => "Table '$tableName' created successfully"]);
    } catch (ValidationException $e) {
        return response()->json([
            'success' => false,
            'errors'  => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}
public function getCustomPostTables()
{
     try {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }
     $prefix = 'custompost_';

     $tables = DB::select("
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
    ");

    // Filter the objects where table_name starts with prefix
    $customTables = array_filter($tables, function($table) use ($prefix) {
        return str_starts_with($table->table_name, $prefix);
    });

    // Reindex array keys from 0
    $customTables = array_values($customTables);

     return response()->json([
                'success' => true,
                'data' => $customTables,
                'message' => 'All Post List!'
            ]);
     } catch (ValidationException $e) {
        return response()->json([
            'success' => false,
            'errors'  => $e->errors()
        ], 422);
    }
}
public function getFormFields($tableName)
{
    try{
    $user = Auth::user();

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized'
        ], 401);
    }

    if (!Schema::hasTable($tableName)) {
        return response()->json(['error' => 'Table not found'], 404);
    }

    $columns = Schema::getColumnListing($tableName);
    $fields = [];

    // Columns to detect as files/images
    $fileColumns = ['image', 'photo', 'avatar', 'thumbnail', 'document', 'file'];
    // Columns to exclude from form
    $excludeColumns = ['id', 'created_at', 'updated_at', 'is_active'];

    foreach ($columns as $column) {
        if (in_array($column, $excludeColumns)) continue;

        $type = Schema::getColumnType($tableName, $column);
        $fieldType = 'text'; // default

        // Map DB type to form field type
        switch ($type) {
            case 'text':
                $fieldType = 'textarea';
                break;
            case 'integer':
            case 'bigint':
            case 'smallint':
            case 'tinyint':
                $fieldType = 'number';
                break;
            case 'boolean':
                $fieldType = 'checkbox'; // can be checkbox
                break;
            case 'string':
            default:
                $fieldType = 'text';
        }

        // Override for richtext columns
        if (Str::contains(Str::lower($column), ['content', 'description', 'body'])) {
            $fieldType = 'richtext';
        }

        // Override for file/image columns
        foreach ($fileColumns as $fileColumn) {
            if (Str::endsWith(Str::lower($column), Str::lower($fileColumn)) || Str::contains(Str::lower($column), Str::lower($fileColumn))) {
                $fieldType = 'file';
                break;
            }
        }

        $fields[] = [
            'name' => $column,
            'label' => Str::title(str_replace('_', ' ', $column)),
            'type' => $fieldType,
            'required' => true,
            'placeholder' => 'Enter ' . Str::title(str_replace('_', ' ', $column)),
        ];
    }

    return response()->json(['fields' => $fields]);
     } catch (ValidationException $e) {
        return response()->json([
            'success' => false,
            'errors'  => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}
public function createCustomPost(Request $request, $tableName)
{
    try {
        // 🔐 Auth check
        $user = Auth::user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        // ✅ Check if table exists
        if (!Schema::hasTable($tableName)) {
            return response()->json(['success' => false, 'message' => 'Table not found'], 404);
        }

        // 📋 Get all columns from table
        $columns = Schema::getColumnListing($tableName);
        $data = [];

        // 🛠 Prepare insert data
        foreach ($columns as $column) {
            // Skip auto/controlled fields
            if (in_array($column, ['id', 'created_at', 'updated_at'])) {
                continue;
            }

            // 📁 Handle file uploads
            if ($request->hasFile($column)) {
                $file = $request->file($column);
                $folder = 'uploads/' . strtolower($tableName) . '/' . strtolower($column);
                $fileName = time() . '_' . $file->getClientOriginalName();

                // Move file to public directory
                $file->move(public_path($folder), $fileName);

                $data[$column] = $folder . '/' . $fileName;
            }
            // 📝 Handle regular input
            elseif ($request->has($column)) {
                $data[$column] = $request->input($column);
            }
        }

        if (in_array('is_active', $columns) && !isset($data['is_active'])) {
            $data['is_active'] = 1;
        }

      
        if (in_array('created_at', $columns)) {
            $data['created_at'] = now();
        }
        if (in_array('updated_at', $columns)) {
            $data['updated_at'] = now();
        }
        DB::table($tableName)->insert($data);

        return response()->json([
            'success' => true,
            'message' => 'Post created successfully!',
        ], 200);

    } catch (ValidationException $e) {
        return response()->json([
            'success' => false,
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        // 🧯 Catch all other errors
        return response()->json([
            'success' => false,
            'message' => 'An error occurred.',
            'error' => $e->getMessage()
        ], 500);
    }
}
public function listCustomPosts($tableName)
{
    try {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        if (!Schema::hasTable($tableName)) {
            return response()->json(['error' => 'Table not found'], 404);
        }

        // Fetch all posts
        $customPosts = DB::table($tableName)
            ->orderBy('id', 'desc')
            ->get();

        // Columns to exclude from the response
        $excludeColumns = ['updated_at'];

        // Map each post to exclude the unwanted columns
        $filteredPosts = $customPosts->map(function ($post) use ($excludeColumns) {
            return collect($post)->except($excludeColumns)->toArray();
        });

        return response()->json([
            'success' => true,
            'data' => $filteredPosts,
            'message' => 'Post list successfully!'
        ]);

    } catch (ValidationException $e) {
        return response()->json([
            'success' => false,
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}
public function getCustomPostDetails($tableName, $id)
{
    try {
        if (!Schema::hasTable($tableName)) {
            return response()->json(['success' => false, 'message' => 'Table not found'], 404);
        }

        $post = DB::table($tableName)->where('id', $id)->first();

        if (!$post) {
            return response()->json(['success' => false, 'message' => 'Post not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $post
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'An error occurred.',
            'error' => $e->getMessage()
        ], 500);
    }
}
public function updateCustomPost(Request $request, $tableName, $id)
{
    try {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        if (!Schema::hasTable($tableName)) {
            return response()->json(['success' => false, 'message' => 'Table not found'], 404);
        }

        $columns = Schema::getColumnListing($tableName);
        $existing = DB::table($tableName)->where('id', $id)->first();

        if (!$existing) {
            return response()->json(['success' => false, 'message' => 'Post not found'], 404);
        }

        $data = [];

        foreach ($columns as $column) {
            if (in_array($column, ['id', 'created_at', 'updated_at'])) {
                continue;
            }

            if ($request->hasFile($column)) {
                $file = $request->file($column);
                $folder = 'uploads/' . strtolower($tableName) . '/' . strtolower($column);
                $fileName = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path($folder), $fileName);

                $data[$column] = $folder . '/' . $fileName;
            } elseif ($request->has($column)) {
                $data[$column] = $request->input($column);
            }
        }

        // Update timestamp if column exists
        if (in_array('updated_at', $columns)) {
            $data['updated_at'] = now();
        }

        DB::table($tableName)->where('id', $id)->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Post updated successfully!',
        ], 200);

    } catch (ValidationException $e) {
        return response()->json([
            'success' => false,
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'An error occurred.',
            'error' => $e->getMessage()
        ], 500);
    }
}

}