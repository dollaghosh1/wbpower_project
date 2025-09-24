<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomPostForm extends Model
{
 protected $fillable = ['label', 'type', 'options', 'required'];

    protected $casts = [
        'options' => 'array',
        'required' => 'boolean',
    ];
}
