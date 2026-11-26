<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // ログイン・登録の試行回数制限（ブルートフォース対策）
        // API へのリクエストは Next.js サーバー経由で届くため IP だけだと全員が同じ枠を共有してしまう。
        // メールアドレス + IP をキーにして、アカウントごとに 1分あたり10回までに制限する
        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(10)->by(mb_strtolower((string) $request->input('email')) . '|' . $request->ip());
        });
    }
}
