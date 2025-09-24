<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAdditionalDetails extends Model
{
    protected $fillable = [
        'user_id',
        'user_address',
        'user_image',
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
