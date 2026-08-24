// frontend/app/(dashboard)/budgets/new/page.tsx
// 新規家計簿登録ページ

import { getCategories } from "@/app/_lib/api";
import BudgetForm from "./_components/BudgetForm";

export default async function BudgetNewPage() {
  // カテゴリ一覧を取得する
  const res = await getCategories();
  const categories = res.data;

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">家計簿登録</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 w-full max-w-lg mx-auto p-6">
        <BudgetForm categories={categories} />
      </div>
    </div>
  );
}
