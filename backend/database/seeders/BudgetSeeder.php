<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;

class BudgetSeeder extends Seeder
{
    public function run(): void
    {
        $categoryIds = Category::pluck("id", "name");
        $user = User::where("email", DemoUserSeeder::EMAIL)->firstOrFail();

        $budgets = [
            ["title" => "給与",            "amount" => 300000, "type" => "income",  "category_id" => $categoryIds["給与"],   "date" => "2026-08-25", "memo" => null],
            ["title" => "スーパーで買い物", "amount" => 4500,   "type" => "expense", "category_id" => $categoryIds["食費"],   "date" => "2026-08-20", "memo" => "週の食材"],
            ["title" => "電車代",           "amount" => 1200,   "type" => "expense", "category_id" => $categoryIds["交通費"], "date" => "2026-08-19", "memo" => null],
            ["title" => "電気代",           "amount" => 8500,   "type" => "expense", "category_id" => $categoryIds["光熱費"], "date" => "2026-08-15", "memo" => "8月分"],
            ["title" => "副業収入",         "amount" => 30000,  "type" => "income",  "category_id" => $categoryIds["副収入"], "date" => "2026-08-10", "memo" => "フリーランス"],
            ["title" => "映画鑑賞",       "amount" => 1800,   "type" => "expense", "category_id" => $categoryIds["娯楽"],   "date" => "2026-08-05", "memo" => null],
            ["title" => "医療費",          "amount" => 2500,   "type" => "expense", "category_id" => $categoryIds["医療"],   "date" => "2026-08-03", "memo" => null],
            ["title" => "日用品購入",      "amount" => 3200,   "type" => "expense", "category_id" => $categoryIds["日用品"], "date" => "2026-08-01", "memo" => null],
            ["title" => "給与",            "amount" => 250000, "type" => "income",  "category_id" => $categoryIds["給与"],   "date" => "2026-07-25", "memo" => null],
            ["title" => "スーパーで買い物", "amount" => 6500,   "type" => "expense", "category_id" => $categoryIds["食費"],   "date" => "2026-07-20", "memo" => "週の食材"],
            ["title" => "電車代",           "amount" => 1200,   "type" => "expense", "category_id" => $categoryIds["交通費"], "date" => "2026-07-19", "memo" => null],
            ["title" => "電気代",           "amount" => 8500,   "type" => "expense", "category_id" => $categoryIds["光熱費"], "date" => "2026-07-15", "memo" => "7月分"],
            ["title" => "副業収入",         "amount" => 30000,  "type" => "income",  "category_id" => $categoryIds["副収入"], "date" => "2026-07-10", "memo" => "フリーランス"],
            ["title" => "映画鑑賞",       "amount" => 1800,   "type" => "expense", "category_id" => $categoryIds["娯楽"],   "date" => "2026-07-05", "memo" => null],
            ["title" => "医療費",          "amount" => 2500,   "type" => "expense", "category_id" => $categoryIds["医療"],   "date" => "2026-07-03", "memo" => null],
            ["title" => "日用品購入",      "amount" => 3200,   "type" => "expense", "category_id" => $categoryIds["日用品"], "date" => "2026-07-01", "memo" => null],
        ];

        foreach ($budgets as $budget) {
            $user->budgets()->create($budget);
        }
    }
}
