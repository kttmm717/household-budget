// frontend/app/_components/charts/CategoryExpenseChart.tsx
// カテゴリ別の支出（金額順の横棒グラフ）
// 1系列なので凡例は置かず、見出しで何のグラフかを示す

import Icon from "@mdi/react";
import { CATEGORY_ICONS } from "@/app/_lib/categoryIcons";
import type { CategoryTotal } from "@/app/_lib/types";
import { yen } from "./format";

export default function CategoryExpenseChart({ data }: { data: CategoryTotal[] }) {
  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-500">この月の支出はありません。</p>;
  }

  const total = data.reduce((sum, d) => sum + d.amount, 0);
  const max = data[0].amount; // API が金額の多い順で返す

  return (
    <ul className="space-y-3">
      {data.map((d) => {
        const share = Math.round((d.amount / total) * 100);
        return (
          <li
            key={d.category_id}
            className="group grid grid-cols-[5.5rem_1fr_auto] items-center gap-3 text-sm"
            aria-label={`${d.category} ${yen(d.amount)}（${share}%）`}
          >
            {/* カテゴリ名 */}
            <span className="flex items-center gap-1.5 truncate text-slate-600">
              {CATEGORY_ICONS[d.category] && <Icon path={CATEGORY_ICONS[d.category]} size={0.7} className="shrink-0" />}
              {d.category}
            </span>

            {/* 棒（左端は基準線なので角丸なし、先端だけ 4px 丸める） */}
            <div className="h-4">
              <div
                className="h-full rounded-r bg-expense transition-opacity group-hover:opacity-80"
                style={{ width: `${(d.amount / max) * 100}%` }}
              />
            </div>

            {/* 金額と割合 */}
            <span className="text-right tabular-nums">
              <span className="font-medium text-slate-800">{yen(d.amount)}</span>
              <span className="ml-1.5 inline-block w-9 text-xs text-slate-400">{share}%</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
