<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomPostFormSubmission extends Model
{
    protected $fillable = ['category_id', 'data'];

    protected $casts = [
        'data' => 'array',
    ];
     public function category()
    {
        return $this->belongsTo(PostCategory::class, 'category_id');
    }
}
