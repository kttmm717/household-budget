// frontend/app/_components/RecentBudgetsTable.tsx
// 最近の家計簿テーブルコンポーネント

"use client";

import Icon from "@mdi/react";
import { CATEGORY_ICONS } from "@/app/_lib/categoryIcons";
import type { Budget } from "@/app/_lib/types";

/* 家計簿テーブルコンポーネント */
export default function RecentBudgetsTable({ budgets }: { budgets: Budget[] }) {
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          {/* テーブルヘッダー */}
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3">日付</th>
              <th className="text-left px-4 py-3">タイトル</th>
              <th className="text-left px-4 py-3">カテゴリ</th>
              <th className="text-left px-4 py-3">メモ</th>
              <th className="text-left px-4 py-3">種別</th>
              <th className="text-right px-4 py-3">金額</th>
            </tr>
          </thead>

          {/* テーブルボディ */}
          <tbody className="divide-y divide-slate-100">
            {budgets.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50">
                {/* 日付 */}
                <td className="px-4 py-3 text-slate-600">
                  {b.date}
                </td>

                {/* タイトル */}
                <td className="px-4 py-3 text-slate-800 font-medium">
                  {b.title}
                </td>

                {/* カテゴリ */}
                <td className="px-4 py-3 text-slate-600">
                  <span className="flex items-center gap-1.5">
                    {CATEGORY_ICONS[b.category] && (
                      <Icon path={CATEGORY_ICONS[b.category]} size={0.75} />
                    )}
                    {b.category}
                  </span>
                </td>

                {/* メモ */}
                <td className="px-4 py-3 text-slate-600">
                  {b.memo || "-"}
                </td>

                {/* 種別（収入 or 支出） */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${b.type === "income"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                      }`}
                  >
                    {b.type === "income" ? "収入" : "支出"}
                  </span>
                </td>

                {/* 金額 */}
                <td
                  className={`px-4 py-3 text-right font-medium ${b.type === "income" ? "text-emerald-600" : "text-rose-600"
                    }`}
                >
                  ¥{b.amount.toLocaleString("ja-JP")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
