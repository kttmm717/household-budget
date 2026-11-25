<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBudgetRequest;
use App\Http\Requests\UpdateBudgetRequest;
use App\Http\Resources\BudgetResource;
use App\Models\Budget;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BudgetController extends Controller
{
    // 一覧表示（ログインユーザーの家計簿のみ）
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = $request->user()->budgets()
            ->with('category')
            ->orderByDesc('date')
            ->orderByDesc('id');

        // ?month=YYYY-MM が渡された場合その月のみ絞り込む
        if ($month = $request->query('month')) {
            [$year, $m] = explode('-', $month);
            $query->whereYear('date', $year)->whereMonth('date', $m);
        }

        return BudgetResource::collection($query->get());
    }

    // 詳細表示
    public function show(Request $request, Budget $budget): BudgetResource
    {
        $this->ensureOwner($request, $budget);

        return new BudgetResource($budget->load('category'));
    }

    // 登録（ログインユーザーに紐付けて作成）
    public function store(StoreBudgetRequest $request): BudgetResource
    {
        $budget = $request->user()->budgets()->create($request->validated());

        return new BudgetResource($budget);
    }

    // 更新
    public function update(UpdateBudgetRequest $request, Budget $budget): BudgetResource
    {
        $this->ensureOwner($request, $budget);

        $budget->update($request->validated());

        return new BudgetResource($budget);
    }

    // 削除
    public function destroy(Request $request, Budget $budget): JsonResponse
    {
        $this->ensureOwner($request, $budget);

        $budget->delete();

        return response()->json(null, 204);
    }

    // 他人の家計簿は「存在しない」扱いにする（403 だと存在が分かってしまうため 404）
    private function ensureOwner(Request $request, Budget $budget): void
    {
        abort_if($budget->user_id !== $request->user()->id, 404);
    }
}
