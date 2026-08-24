<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('budgets', function (Blueprint $table) {
            $table->id();
            $table->string('title')->comment('タイトル');
            $table->unsignedInteger('amount')->comment('金額');
            $table->enum('type', ['income', 'expense'])->comment('種類（収入 or 支出）');
            $table->foreignId('category_id')->constrained()->cascadeOnUpdate()->comment('カテゴリ');
            $table->date('date')->comment('日付');
            $table->text('memo')->nullable()->comment('メモ');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('budgets');
    }
};
