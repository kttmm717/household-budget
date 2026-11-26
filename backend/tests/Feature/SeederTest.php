<?php

namespace Tests\Feature;

use App\Models\Budget;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_シーダーは何度実行してもデータが重複しない(): void
    {
        $this->seed(DatabaseSeeder::class);
        $count = Budget::count();

        $this->seed(DatabaseSeeder::class);

        $this->assertGreaterThan(0, $count);
        $this->assertSame($count, Budget::count());
    }

    public function test_今月のデモデータがあり未来の日付は含まない(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertTrue(Budget::where('date', '>=', now()->startOfMonth()->toDateString())->exists());
        $this->assertFalse(Budget::where('date', '>', now()->toDateString())->exists());
    }
}
