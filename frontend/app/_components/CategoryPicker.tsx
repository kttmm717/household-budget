// frontend/app/_components/CategoryPicker.tsx
// カテゴリ選択コンポーネント

"use client";

import { useState } from "react";
import Icon from "@mdi/react";
import { CATEGORY_ICONS } from "@/app/_lib/categoryIcons";
import type { Category } from "@/app/_lib/types";

export default function CategoryPicker({
  categories,
  defaultValue = 0,
  onSelect,
}: {
  categories: Category[];
  defaultValue?: number;
  onSelect?: (id: number) => void;
}) {
  const [selectedId, setSelectedId] = useState(defaultValue);

  // カテゴリを選択したときの処理
  function handleSelect(id: number) {
    // 選択状態を更新する
    setSelectedId(id);
    // 親コンポーネントに、選択されたカテゴリIDを通知する
    onSelect?.(id);
  }

  return (
    <div>
      <input type="hidden" name="category_id" value={selectedId} />
      <div className="grid grid-cols-3 gap-2">
        {categories.map((c) => {
          const icon = CATEGORY_ICONS[c.name];
          const isActive = selectedId === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleSelect(c.id)}
              className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors ${
                isActive
                  ? "border-slate-800 bg-slate-800 text-white"
                  : "border-slate-300 text-slate-600 hover:border-slate-500 hover:bg-slate-50"
              }`}
            >
              {icon && <Icon path={icon} size={0.85} />}
              {c.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
