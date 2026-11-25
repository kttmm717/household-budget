<?php

namespace Database\Seeders;

use Database\Seeders\BudgetSeeder;
use Database\Seeders\CategorySeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            DemoUserSeeder::class,
            BudgetSeeder::class,
        ]);
    }
}
