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

export default function MonthNav({ month }: { month: string }) {
  const [year, m] = month.split("-").map(Number);

  return (
    <div className="flex items-center gap-3">
      {/* 前月へ */}
      <Link
        href={`/budgets?month=${addMonth(month, -1)}`}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <Icon path={mdiChevronLeft} size={0.8} />
      </Link>

      {/* 現在の月 */}
      <span className="text-base font-semibold text-slate-700 w-24 text-center">
        {year}年{m}月
      </span>

      {/* 次月へ */}
      <Link
        href={`/budgets?month=${addMonth(month, +1)}`}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <Icon path={mdiChevronRight} size={0.8} />
      </Link>
    </div>
  );
}
