// frontend/app/_components/MonthNav.tsx
// 月ナビゲーションコンポーネント

"use client";

import Link from "next/link";
import Icon from "@mdi/react";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";

function addMonth(month: string, delta: number): string {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(year, m - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

// basePath: 月を切り替えたときの遷移先（一覧ページ / ダッシュボード）
export default function MonthNav({ month, basePath = "/budgets" }: { month: string; basePath?: string }) {
  const [year, m] = month.split("-").map(Number);

  return (
    <div className="flex items-center gap-3">
      {/* 前月へ */}
      <Link
        href={`${basePath}?month=${addMonth(month, -1)}`}
        aria-label="前の月"
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <Icon path={mdiChevronLeft} size={0.8} />
      </Link>

      {/* 現在の月 */}
      <span className="text-base font-semibold text-slate-700 w-28 text-center whitespace-nowrap">
        {year}年{m}月
      </span>

      {/* 次月へ */}
      <Link
        href={`${basePath}?month=${addMonth(month, +1)}`}
        aria-label="次の月"
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <Icon path={mdiChevronRight} size={0.8} />
      </Link>
    </div>
  );
}
