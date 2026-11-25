// frontend/app/_components/charts/format.ts
// グラフ用の数値フォーマット

export const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

// "2026-08" → "2026年8月"
export function monthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return `${y}年${m}月`;
}

// 軸の目盛り用。1万以上は「万」でまとめる（例: 300000 → "30万"）
export function axisYen(n: number): string {
  if (n === 0) return "0";
  if (n >= 10000) return `${(n / 10000).toLocaleString("ja-JP", { maximumFractionDigits: 1 })}万`;
  return n.toLocaleString("ja-JP");
}

// 最大値を区切りのいい目盛り（約4分割）にする。例: 300000 → [0, 100000, 200000, 300000]
export function niceTicks(max: number, target = 4): number[] {
  if (max <= 0) return [0];
  const rough = max / target;
  const pow = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].map((k) => k * pow).find((s) => s >= rough)!;
  const top = Math.ceil(max / step) * step;
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
}
