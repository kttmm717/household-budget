// frontend/app/_components/charts/MonthlyTrendChart.tsx
// 月別の収入・支出の推移（縦棒グラフ）

"use client";

import { useState } from "react";
import type { MonthlyTotal } from "@/app/_lib/types";
import { axisYen, monthLabel, niceTicks, yen } from "./format";

const SERIES = [
  { key: "income", label: "収入", className: "bg-income" },
  { key: "expense", label: "支出", className: "bg-expense" },
] as const;

export default function MonthlyTrendChart({ data, currentMonth }: { data: MonthlyTotal[]; currentMonth: string }) {
  // ホバー（またはキーボードフォーカス）中の月のインデックス
  const [active, setActive] = useState<number | null>(null);

  const max = Math.max(0, ...data.flatMap((d) => [d.income, d.expense]));
  const ticks = niceTicks(max);
  const top = ticks[ticks.length - 1] || 1;
  const pct = (v: number) => `${(v / top) * 100}%`;

  return (
    <figure>
      {/* 凡例（2系列なので色だけに頼らずラベルを併記） */}
      <div className="mb-4 flex gap-4 text-xs text-slate-600">
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span className={`inline-block h-2.5 w-2.5 rounded-sm ${s.className}`} aria-hidden />
            {s.label}
          </span>
        ))}
      </div>

      <div className="flex">
        {/* Y軸の目盛り */}
        <div className="relative h-52 w-10 shrink-0 text-right text-[11px] tabular-nums text-slate-400" aria-hidden>
          {ticks.map((t) => (
            <span key={t} className="absolute right-2 translate-y-1/2 leading-none" style={{ bottom: pct(t) }}>
              {axisYen(t)}
            </span>
          ))}
        </div>

        <div className="relative flex-1">
          {/* グリッド線（一番下は基準線） */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-52" aria-hidden>
            {ticks.map((t, i) => (
              <div
                key={t}
                className={`absolute inset-x-0 border-t ${i === 0 ? "border-chart-axis" : "border-chart-grid"}`}
                style={{ bottom: pct(t) }}
              />
            ))}
          </div>

          {/* 月ごとの棒 */}
          <div className="relative flex h-52">
            {data.map((d, i) => {
              const isActive = active === i;
              // 前半の月はツールチップを右側、後半は左側に出す（ホバー中の棒を隠さないため）
              const tooltipOnRight = i < data.length / 2;
              const diff = d.income - d.expense;
              return (
                <div
                  key={d.month}
                  tabIndex={0}
                  role="img"
                  aria-label={`${monthLabel(d.month)} 収入${yen(d.income)} 支出${yen(d.expense)}`}
                  onPointerEnter={() => setActive(i)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className={`relative flex flex-1 items-end justify-center gap-0.5 rounded-t-md outline-none transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 ${
                    isActive ? "bg-slate-100/70" : ""
                  }`}
                >
                  {SERIES.map((s) => (
                    <div
                      key={s.key}
                      className={`w-full max-w-6 rounded-t ${s.className}`}
                      style={{ height: pct(d[s.key]) }}
                    />
                  ))}

                  {/* ツールチップ */}
                  {isActive && (
                    <div
                      className={`pointer-events-none absolute top-1 z-10 w-max rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg ${
                        tooltipOnRight ? "left-full ml-1" : "right-full mr-1"
                      }`}
                    >
                      <p className="mb-1 font-medium text-slate-500">{monthLabel(d.month)}</p>
                      {SERIES.map((s) => (
                        <p key={s.key} className="flex items-center gap-2">
                          <span className={`inline-block h-0.5 w-3 rounded ${s.className}`} aria-hidden />
                          <span className="font-semibold tabular-nums text-slate-800">{yen(d[s.key])}</span>
                          <span className="text-slate-500">{s.label}</span>
                        </p>
                      ))}
                      <p className="mt-1 border-t border-slate-100 pt-1 text-slate-500">
                        収支{" "}
                        <span className="font-semibold tabular-nums text-slate-800">
                          {diff > 0 ? "+" : diff < 0 ? "−" : ""}
                          {yen(Math.abs(diff))}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* X軸（月） */}
          <div className="mt-2 flex text-[11px] text-slate-500" aria-hidden>
            {data.map((d) => (
              <span
                key={d.month}
                className={`flex-1 text-center ${d.month === currentMonth ? "font-semibold text-slate-800" : ""}`}
              >
                {Number(d.month.slice(5))}月
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 表で見る（色やホバーに頼らず数値を確認できるように） */}
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer select-none text-xs text-slate-500 hover:text-slate-700">表で見る</summary>
        <table className="mt-2 w-full text-xs tabular-nums">
          <thead className="text-slate-500">
            <tr>
              <th className="py-1 text-left font-medium">月</th>
              <th className="py-1 text-right font-medium">収入</th>
              <th className="py-1 text-right font-medium">支出</th>
              <th className="py-1 text-right font-medium">収支</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {data.map((d) => (
              <tr key={d.month}>
                <td className="py-1">{monthLabel(d.month)}</td>
                <td className="py-1 text-right">{yen(d.income)}</td>
                <td className="py-1 text-right">{yen(d.expense)}</td>
                <td className="py-1 text-right">{yen(d.income - d.expense)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
