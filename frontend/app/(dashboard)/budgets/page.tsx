// frontend/app/(dashboard)/budgets/page.tsx
// 家計簿一覧ページ

import Link from "next/link";
import { getBudgets, getCategories } from "@/app/_lib/api";
import BudgetsTable from "@/app/_components/BudgetsTable";
import MonthNav from "@/app/_components/MonthNav";

export default async function BudgetsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  // month未指定なら今月をデフォルトにする
  const currentMonth = month ?? new Date().toISOString().slice(0, 7);

  const [budgetsRes, categoriesRes] = await Promise.all([
    getBudgets(currentMonth),
    getCategories(),
  ]);
  const budgets = budgetsRes.data;
  const categories = categoriesRes.data;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">家計簿一覧</h2>
        <Link
          href="/budgets/new"
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
        >
          ＋ 新規登録
        </Link>
      </div>

      <div className="mb-4">
        <MonthNav month={currentMonth} />
      </div>

      {budgets.length === 0 ? (
        <p className="text-slate-500">この月のデータがありません。</p>
      ) : (
        <BudgetsTable budgets={budgets} categories={categories} />
      )}
    </div>
  );
}

