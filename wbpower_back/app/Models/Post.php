<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'post_name',
        'post_desc',
        'post_image',
        'post_category_id',
        'is_active',
    ];
    public function category()
    {
        return $this->belongsTo(PostCategory::class, 'post_category_id');
    }
}
