<?php

namespace App\Http\Controllers;

use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// ダッシュボード用の集計API
class SummaryController extends Controller
{
    // 推移グラフに表示する月数
    private const TREND_MONTHS = 6;

    public function show(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'month' => ['nullable', 'date_format:Y-m'],
        ]);

        $month = CarbonImmutable::createFromFormat('Y-m-d', ($validated['month'] ?? now()->format('Y-m')) . '-01')->startOfDay();
        $user = $request->user();

        // ① 月別の収入・支出（指定月を含む直近6か月）
        $trendStart = $month->subMonths(self::TREND_MONTHS - 1);
        $rows = $user->budgets()
            ->whereBetween('date', [$trendStart->toDateString(), $month->endOfMonth()->toDateString()])
            ->get(['date', 'type', 'amount']);

        $monthly = [];
        for ($i = 0; $i < self::TREND_MONTHS; $i++) {
            $key = $trendStart->addMonths($i)->format('Y-m');
            $monthly[$key] = ['month' => $key, 'income' => 0, 'expense' => 0];
        }
        foreach ($rows as $row) {
            $monthly[$row->date->format('Y-m')][$row->type] += $row->amount;
        }

        // ② 指定月のカテゴリ別支出（金額の大きい順）
        $byCategory = $user->budgets()
            ->join('categories', 'categories.id', '=', 'budgets.category_id')
            ->where('budgets.type', 'expense')
            ->whereBetween('budgets.date', [$month->toDateString(), $month->endOfMonth()->toDateString()])
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('amount')
            ->selectRaw('categories.id as category_id, categories.name as category, SUM(budgets.amount) as amount')
            ->get()
            ->map(fn ($r) => [
                'category_id' => (int) $r->category_id,
                'category'    => $r->category,
                'amount'      => (int) $r->amount,
            ]);

        $current = $monthly[$month->format('Y-m')];

        return response()->json([
            'data' => [
                'month'               => $month->format('Y-m'),
                'income'              => $current['income'],
                'expense'             => $current['expense'],
                'balance'             => $current['income'] - $current['expense'],
                'monthly'             => array_values($monthly),
                'expense_by_category' => $byCategory,
            ],
        ]);
    }
}
