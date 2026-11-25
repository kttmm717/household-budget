<?php

namespace Tests\Feature;

use App\Models\Budget;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BudgetTest extends TestCase
{
    use RefreshDatabase;

    private Category $category;

    protected function setUp(): void
    {
        parent::setUp();

        $this->category = Category::create(['name' => '食費', 'type' => 'expense', 'sort_order' => 1]);
    }

    private function makeBudget(User $user, array $overrides = []): Budget
    {
        return $user->budgets()->create(array_merge([
            'title'       => 'スーパーで買い物',
            'amount'      => 3000,
            'type'        => 'expense',
            'category_id' => $this->category->id,
            'date'        => '2026-11-01',
        ], $overrides));
    }

    public function test_一覧には自分の家計簿だけが表示される(): void
    {
        $me    = User::factory()->create();
        $other = User::factory()->create();
        $this->makeBudget($me, ['title' => '自分の']);
        $this->makeBudget($other, ['title' => '他人の']);

        Sanctum::actingAs($me);

        $this->getJson('/api/budgets')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', '自分の');
    }

    public function test_登録した家計簿はログインユーザーに紐付く(): void
    {
        $me = User::factory()->create();
        Sanctum::actingAs($me);

        $this->postJson('/api/budgets', [
            'title'       => 'ランチ',
            'amount'      => 1000,
            'type'        => 'expense',
            'category_id' => $this->category->id,
            'date'        => '2026-11-02',
        ])->assertCreated();

        $this->assertDatabaseHas('budgets', ['title' => 'ランチ', 'user_id' => $me->id]);
    }

    public function test_他人の家計簿は参照_更新_削除できない(): void
    {
        $me          = User::factory()->create();
        $othersBudget = $this->makeBudget(User::factory()->create());

        Sanctum::actingAs($me);

        $this->getJson("/api/budgets/{$othersBudget->id}")->assertNotFound();

        $this->putJson("/api/budgets/{$othersBudget->id}", [
            'title'       => '書き換え',
            'amount'      => 1,
            'type'        => 'expense',
            'category_id' => $this->category->id,
            'date'        => '2026-11-01',
        ])->assertNotFound();

        $this->deleteJson("/api/budgets/{$othersBudget->id}")->assertNotFound();

        $this->assertDatabaseHas('budgets', ['id' => $othersBudget->id, 'title' => 'スーパーで買い物']);
    }

    public function test_自分の家計簿は更新_削除できる(): void
    {
        $me     = User::factory()->create();
        $budget = $this->makeBudget($me);

        Sanctum::actingAs($me);

        $this->putJson("/api/budgets/{$budget->id}", [
            'title'       => '更新後',
            'amount'      => 5000,
            'type'        => 'expense',
            'category_id' => $this->category->id,
            'date'        => '2026-11-01',
        ])->assertOk()->assertJsonPath('data.title', '更新後');

        $this->deleteJson("/api/budgets/{$budget->id}")->assertNoContent();
        $this->assertDatabaseMissing('budgets', ['id' => $budget->id]);
    }
}
