// frontend/app/(dashboard)/dashboard/page.tsx
// ダッシュボードページ

import Link from "next/link";
import Icon from "@mdi/react";
import { mdiChevronRight, mdiWalletBifoldOutline, mdiCartOutline, mdiCalculator } from "@mdi/js";
import { getBudgets } from "@/app/_lib/api";
import type { Budget } from "@/app/_lib/types";
import RecentBudgetsTable from "@/app/_components/RecentBudgetsTable";
import SummaryCard from "@/app/_components/SummaryCard";

export default async function DashboardPage() {
  // APIから家計簿データを取得する
  const res = await getBudgets();
  const budgets: Budget[] = res.data;

  // budgets から収入・支出・残高をそれぞれ集計する
  const totalIncome = budgets.filter(b => b.type === "income").reduce((sum, b) => sum + b.amount, 0);
  const totalExpense = budgets.filter(b => b.type === "expense").reduce((sum, b) => sum + b.amount, 0);
  const balance = totalIncome - totalExpense;

  const fmt = (n: number) => n.toLocaleString("ja-JP");

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">ダッシュボード</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* 収入 */}
        <SummaryCard
          label="収入合計"
          value={`¥${fmt(totalIncome)}`}
          icon={mdiWalletBifoldOutline}
          color="text-emerald-600"
          bgColor="bg-emerald-100"
        />

        {/* 支出 */}
        <SummaryCard
          label="支出合計"
          value={`¥${fmt(totalExpense)}`}
          icon={mdiCartOutline}
          color="text-rose-600"
          bgColor="bg-rose-100"
        />

        {/* 残高 */}
        <SummaryCard
          label="残高"
          value={`¥${fmt(balance)}`}
          icon={mdiCalculator}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
      </div>

      {/* 最近の家計簿欄 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">最近の家計簿</h3>
        <Link
          href="/budgets"
          className="flex items-center gap-1 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
        >
          一覧を見る
          <Icon path={mdiChevronRight} size={0.8} />
        </Link>
      </div>

      {budgets.length === 0 ? (
        <p className="text-slate-500">データがありません。</p>
      ) : (
        <RecentBudgetsTable budgets={budgets.slice(0, 5)} />
      )}
    </div>
  );
}
