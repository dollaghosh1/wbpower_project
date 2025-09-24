<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
   protected $fillable = [
        'slider_name',
        'slider_desc',
        'slider_image',
        'is_active',
    ];
   
}
