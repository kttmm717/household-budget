<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => '食費',   'type' => 'expense', 'sort_order' => 1],
            ['name' => '交通費', 'type' => 'expense', 'sort_order' => 2],
            ['name' => '光熱費', 'type' => 'expense', 'sort_order' => 3],
            ['name' => '娯楽',   'type' => 'expense', 'sort_order' => 4],
            ['name' => '医療',   'type' => 'expense', 'sort_order' => 5],
            ['name' => '日用品', 'type' => 'expense', 'sort_order' => 6],
            ['name' => '給与',   'type' => 'income',  'sort_order' => 7],
            ['name' => '副収入', 'type' => 'income',  'sort_order' => 8],
            ['name' => 'その他', 'type' => 'both',    'sort_order' => 9],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(['name' => $category['name']], $category);
        }
    }
}
