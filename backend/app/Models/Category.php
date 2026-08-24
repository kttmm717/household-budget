<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'name',      // カテゴリ名
        'type',      // 種類（収入, 支出, 両方）
        'sort_order' // 表示順
    ];
}
