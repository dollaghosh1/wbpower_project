<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostCategory extends Model
{
    protected $fillable = [
        'category_name',
        'category_slug',
        'category_desc',
        'category_parent',
    ];

    public function posts()
    {
        return $this->hasMany(Post::class, 'post_category_id');
    }
     public function fields()
    {
        return $this->hasMany(CustomPostForm::class);
    }
}
