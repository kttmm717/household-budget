// frontend/app/(dashboard)/dashboard/page.tsx
// ダッシュボードページ

import Link from "next/link";
import Icon from "@mdi/react";
import { mdiChevronRight, mdiWalletBifoldOutline, mdiCartOutline, mdiCalculator } from "@mdi/js";
import { getBudgets, getSummary } from "@/app/_lib/api";
import RecentBudgetsTable from "@/app/_components/RecentBudgetsTable";
import SummaryCard from "@/app/_components/SummaryCard";
import MonthNav from "@/app/_components/MonthNav";
import MonthlyTrendChart from "@/app/_components/charts/MonthlyTrendChart";
import CategoryExpenseChart from "@/app/_components/charts/CategoryExpenseChart";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  // month未指定なら今月をデフォルトにする
  const currentMonth = month ?? new Date().toISOString().slice(0, 7);

  // 集計（サマリー・グラフ用）と最近の家計簿を並行して取得する
  const [summaryRes, budgetsRes] = await Promise.all([getSummary(currentMonth), getBudgets()]);
  const summary = summaryRes.data;
  const recentBudgets = budgetsRes.data.slice(0, 5);

  const fmt = (n: number) => n.toLocaleString("ja-JP");

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">ダッシュボード</h2>
        <MonthNav month={summary.month} basePath="/dashboard" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* 収入 */}
        <SummaryCard
          label="収入"
          value={`¥${fmt(summary.income)}`}
          icon={mdiWalletBifoldOutline}
          color="text-emerald-600"
          bgColor="bg-emerald-100"
        />

        {/* 支出 */}
        <SummaryCard
          label="支出"
          value={`¥${fmt(summary.expense)}`}
          icon={mdiCartOutline}
          color="text-rose-600"
          bgColor="bg-rose-100"
        />

        {/* 収支 */}
        <SummaryCard
          label="収支"
          value={`${summary.balance < 0 ? "−" : ""}¥${fmt(Math.abs(summary.balance))}`}
          icon={mdiCalculator}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
      </div>

      {/* グラフ */}
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
          <h3 className="mb-1 text-base font-bold text-slate-800">収入・支出の推移</h3>
          <p className="mb-4 text-xs text-slate-500">直近6か月</p>
          <MonthlyTrendChart data={summary.monthly} currentMonth={summary.month} />
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="mb-1 text-base font-bold text-slate-800">カテゴリ別の支出</h3>
          <p className="mb-4 text-xs text-slate-500">
            {Number(summary.month.slice(5))}月・合計 ¥{fmt(summary.expense)}
          </p>
          <CategoryExpenseChart data={summary.expense_by_category} />
        </section>
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

      {recentBudgets.length === 0 ? (
        <p className="text-slate-500">データがありません。</p>
      ) : (
        <RecentBudgetsTable budgets={recentBudgets} />
      )}
    </div>
  );
}
