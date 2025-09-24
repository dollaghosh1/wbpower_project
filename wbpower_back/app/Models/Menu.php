<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
   protected $fillable = ['title', 'url', 'parent_id', 'order', 'active'];

    // Relationship for nested menus
    // public function children()
    // {
    //     return $this->hasMany(Menu::class, 'parent_id', 'id')->where('active', true)->orderBy('order');
    // }
                public function children()
            {
                return $this->hasMany(Menu::class, 'parent_id')->where('active', true)->orderBy('order');
            }

            public function childrenRecursive()
            {
                return $this->children()->with('childrenRecursive');
            }
}
