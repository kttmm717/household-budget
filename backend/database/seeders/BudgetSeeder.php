<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;

// デモユーザー用のサンプル家計簿（今月を含む直近6か月分）
// 公開環境ではサーバー起動のたびに実行されるため、既にデータがあれば何もしない
class BudgetSeeder extends Seeder
{
    private const MONTHS = 6;

    // [タイトル, 種別, カテゴリ, 日, 基準金額, メモ, 何か月おきか]
    private const TEMPLATES = [
        ['給与',             'income',  '給与',   25, 280000, null,            1],
        ['副業収入',         'income',  '副収入', 10, 30000,  'フリーランス',  2],
        ['日用品購入',       'expense', '日用品', 1,  3200,   null,            1],
        ['医療費',           'expense', '医療',   3,  2500,   null,            2],
        ['映画鑑賞',         'expense', '娯楽',   5,  1800,   null,            1],
        ['スーパーで買い物', 'expense', '食費',   6,  5200,   '週の食材',      1],
        ['ランチ',           'expense', '食費',   14, 1200,   null,            1],
        ['電気代',           'expense', '光熱費', 15, 8500,   ':month月分',    1],
        ['電車代',           'expense', '交通費', 18, 1200,   null,            1],
        ['スーパーで買い物', 'expense', '食費',   20, 4800,   '週の食材',      1],
    ];

    public function run(): void
    {
        $user = User::where('email', DemoUserSeeder::EMAIL)->firstOrFail();

        if ($user->budgets()->exists()) {
            return;
        }

        $categoryIds = Category::pluck('id', 'name');
        $today = CarbonImmutable::today();

        for ($m = 0; $m < self::MONTHS; $m++) {
            $month = $today->startOfMonth()->subMonths($m);

            foreach (self::TEMPLATES as $i => [$title, $type, $category, $day, $base, $memo, $every]) {
                if ($m % $every !== 0) {
                    continue;
                }

                $date = $month->setDay(min($day, $month->daysInMonth));
                if ($date->greaterThan($today)) {
                    continue; // 今月の未来の日付は作らない
                }

                $user->budgets()->create([
                    'title'       => $title,
                    'type'        => $type,
                    'amount'      => $this->vary($base, $m, $i, $type),
                    'category_id' => $categoryIds[$category],
                    'date'        => $date->toDateString(),
                    'memo'        => $memo ? str_replace(':month', (string) $date->month, $memo) : null,
                ]);
            }
        }
    }

    // 月ごとに金額を少し揺らす（毎回同じ結果になるよう乱数は使わない）
    private function vary(int $base, int $m, int $i, string $type): int
    {
        $rate = 1 + ((($m * 7 + $i * 3) % 5) - 2) * 0.06; // 0.88〜1.12倍
        $unit = $type === 'income' ? 1000 : 100;

        return (int) (round($base * $rate / $unit) * $unit);
    }
}
