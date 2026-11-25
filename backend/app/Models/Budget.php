<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Budget extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',       // タイトル
        'amount',      // 金額
        'type',        // 種類（収入 or 支出）
        'category_id', // カテゴリID
        'date',        // 日付
        'memo',        // メモ
    ];

    protected $casts = [
        'amount'      => 'integer',
        'category_id' => 'integer',
        'user_id'     => 'integer',
        'date'        => 'date:Y-m-d',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
