<?php

namespace Database\Seeders;

use App\Models\Budget;
use App\Models\User;
use Illuminate\Database\Seeder;

// 動作確認用のデモユーザー（demo@example.com / password）
class DemoUserSeeder extends Seeder
{
    public const EMAIL = 'demo@example.com';

    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => self::EMAIL],
            ['name' => 'デモユーザー', 'password' => 'password'],
        );

        // ログイン機能追加前に登録された（持ち主のいない）家計簿をデモユーザーに引き継ぐ
        Budget::whereNull('user_id')->update(['user_id' => $user->id]);
    }
}
