// frontend/app/_components/SummaryCard.tsx
// サマリーカードコンポーネント
import Icon from "@mdi/react";
export default function SummaryCard({
  label,
  value,
  icon,
  color,
  bgColor,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl shadow-sm border border-slate-200 px-6 py-5">
      {/* アイコン */}
      <div className={`rounded-full flex items-center justify-center w-12 h-12 ${bgColor}`}>
        <Icon path={icon} size={1.5} className={`${color}`} />
      </div>

      <div>
        {/* ラベル */}
        <p className="text-sm text-slate-500 mb-1">{label}</p>
        {/* 金額 */}
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );
}