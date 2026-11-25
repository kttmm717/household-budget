<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SummaryTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Category $food;
    private Category $transport;
    private Category $salary;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user      = User::factory()->create();
        $this->food      = Category::create(['name' => '食費', 'type' => 'expense', 'sort_order' => 1]);
        $this->transport = Category::create(['name' => '交通費', 'type' => 'expense', 'sort_order' => 2]);
        $this->salary    = Category::create(['name' => '給与', 'type' => 'income', 'sort_order' => 3]);
    }

    private function add(User $user, string $type, int $amount, Category $category, string $date): void
    {
        $user->budgets()->create([
            'title' => 'x', 'type' => $type, 'amount' => $amount,
            'category_id' => $category->id, 'date' => $date,
        ]);
    }

    public function test_指定月の合計_月別推移_カテゴリ別支出を返す(): void
    {
        $this->add($this->user, 'income', 300000, $this->salary, '2026-08-25');
        $this->add($this->user, 'expense', 4000, $this->food, '2026-08-01');
        $this->add($this->user, 'expense', 2000, $this->food, '2026-08-31');
        $this->add($this->user, 'expense', 1000, $this->transport, '2026-08-10');
        $this->add($this->user, 'expense', 9999, $this->food, '2026-07-15');   // 前月
        $this->add($this->user, 'expense', 5555, $this->food, '2026-09-01');   // 翌月（範囲外）
        $this->add($this->user, 'expense', 7777, $this->food, '2026-02-28');   // 6か月より前（範囲外）

        Sanctum::actingAs($this->user);

        $res = $this->getJson('/api/summary?month=2026-08')->assertOk();

        $res->assertJsonPath('data.month', '2026-08')
            ->assertJsonPath('data.income', 300000)
            ->assertJsonPath('data.expense', 7000)
            ->assertJsonPath('data.balance', 293000);

        // 3月〜8月の6か月分、データのない月も 0 で埋める
        $this->assertSame(
            ['2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08'],
            array_column($res->json('data.monthly'), 'month'),
        );
        $res->assertJsonPath('data.monthly.0', ['month' => '2026-03', 'income' => 0, 'expense' => 0])
            ->assertJsonPath('data.monthly.4.expense', 9999)
            ->assertJsonPath('data.monthly.5', ['month' => '2026-08', 'income' => 300000, 'expense' => 7000]);

        // 金額の大きい順、収入は含めない
        $res->assertJsonPath('data.expense_by_category', [
            ['category_id' => $this->food->id, 'category' => '食費', 'amount' => 6000],
            ['category_id' => $this->transport->id, 'category' => '交通費', 'amount' => 1000],
        ]);
    }

    public function test_他人の家計簿は集計に含めない(): void
    {
        $this->add($this->user, 'expense', 1000, $this->food, '2026-08-01');
        $this->add(User::factory()->create(), 'expense', 50000, $this->food, '2026-08-01');

        Sanctum::actingAs($this->user);

        $this->getJson('/api/summary?month=2026-08')
            ->assertOk()
            ->assertJsonPath('data.expense', 1000);
    }

    public function test_年をまたぐ6か月も正しく並ぶ(): void
    {
        Sanctum::actingAs($this->user);

        $months = array_column($this->getJson('/api/summary?month=2026-02')->json('data.monthly'), 'month');

        $this->assertSame(['2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02'], $months);
    }

    public function test_month未指定なら今月を集計する(): void
    {
        Sanctum::actingAs($this->user);

        $this->getJson('/api/summary')->assertOk()->assertJsonPath('data.month', now()->format('Y-m'));
    }

    public function test_monthの形式が不正なら422(): void
    {
        Sanctum::actingAs($this->user);

        $this->getJson('/api/summary?month=2026-13')->assertUnprocessable();
        $this->getJson('/api/summary?month=abc')->assertUnprocessable();
    }

    public function test_未ログインでは取得できない(): void
    {
        $this->getJson('/api/summary')->assertUnauthorized();
    }
}
