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
    // 一覧表示
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Budget::with('category')->orderByDesc('date')->orderByDesc('id');

        // ?month=YYYY-MM が渡された場合その月のみ絞り込む
        if ($month = $request->query('month')) {
            [$year, $m] = explode('-', $month);
            $query->whereYear('date', $year)->whereMonth('date', $m);
        }

        return BudgetResource::collection($query->get());
    }

    // 詳細表示
    public function show(Budget $budget): BudgetResource
    {
        return new BudgetResource($budget->load('category'));
    }

    // 登録
    public function store(StoreBudgetRequest $request): BudgetResource
    {
        $budget = Budget::create($request->validated());

        return new BudgetResource($budget);
    }

    // 更新
    public function update(UpdateBudgetRequest $request, Budget $budget): BudgetResource
    {
        $budget->update($request->validated());

        return new BudgetResource($budget);
    }

    // 削除
    public function destroy(Budget $budget): JsonResponse
    {
        $budget->delete();

        return response()->json(null, 204);
    }
}
