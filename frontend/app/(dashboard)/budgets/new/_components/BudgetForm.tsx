// frontend/app/(dashboard)/budgets/new/_components/BudgetForm.tsx
// 家計簿登録フォーム

"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";
import { createBudget } from "@/app/_lib/api";
import CategoryPicker from "@/app/_components/CategoryPicker";
import type { BudgetFormData, Category } from "@/app/_lib/types";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500";

// Field が errors を参照するための Context
const ErrorContext = createContext<Record<string, string>>({});

export default function BudgetForm({ categories }: { categories: Category[] }) {
  // Next.jsのルーター
  const router = useRouter();
  // フォーム全体のエラー状態
  const [error, setError] = useState<string | null>(null);
  // ローディング状態
  const [loading, setLoading] = useState(false);
  // フォームのバリデーションエラー
  const [errors, setErrors] = useState<Record<string, string>>({});
  // 必須フィールドが全て入力されているか追跡する
  const [filled, setFilled] = useState<Record<string, boolean>>({});

  // name -> label のマッピング（必須チェック時のメッセージ生成に使う）
  const requiredFields: Record<string, string> = {
    title: "タイトル",
    type: "種別",
    amount: "金額",
    category_id: "カテゴリ",
    date: "日付",
  };

  // 全ての必須フィールドが入力されているか
  const isAllFilled = Object.keys(requiredFields).every((k) => filled[k]);

  // フォームのバリデーション
  function validate(fd: FormData): boolean {
    const newErrors: Record<string, string> = {};

    for (const [name, label] of Object.entries(requiredFields)) {
      const value = fd.get(name);
      if (!value || value === "0") newErrors[name] = `${label}は必須です`;
    }

    // エラー状態を更新する
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // フォーム内のinput/selectが変わるたびに充足状態を更新する
  function handleFormChange(e: React.ChangeEvent<HTMLFormElement>) {
    const fd = new FormData(e.currentTarget);
    setFilled((prev) => {
      const next = { ...prev };
      for (const name of Object.keys(requiredFields)) {
        const val = fd.get(name);
        next[name] = !!(val && val !== "0");
      }
      return next;
    });
  }

  // フォーム送信処理
  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    // ブラウザのデフォルトのフォーム送信をキャンセルする
    e.preventDefault();
    // エラー状態をリセットする
    setError(null);
    // ローディング状態をtrueにする
    setLoading(true);

    // フォームデータを取得する
    const fd = new FormData(e.currentTarget);

    if (!validate(fd)) {
      setLoading(false);
      return;
    }

    // フォームデータを BudgetFormData 型に変換する
    const data: BudgetFormData = {
      title: fd.get("title") as string,
      amount: Number(fd.get("amount")),
      type: fd.get("type") as BudgetFormData["type"],
      category_id: Number(fd.get("category_id")),
      date: fd.get("date") as string,
      memo: (fd.get("memo") as string) || undefined,
    };

    // API送信
    try {
      await createBudget(data);
      router.push("/budgets");
    } catch {
      setError("登録に失敗しました。入力内容を確認してください。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ErrorContext value={errors}>
      <form onChange={handleFormChange} onSubmit={handleSubmit} className="space-y-4">
        {/* タイトル */}
        <Field name="title" label="タイトル" required>
          <input name="title" type="text" placeholder="例：スーパーで買い物" className={inputClass} />
        </Field>

        {/* 種別 */}
        <Field name="type" label="種別" required>
          <select name="type" className={inputClass} defaultValue="">
            <option value="" disabled>選択してください</option>
            <option value="income">収入</option>
            <option value="expense">支出</option>
          </select>
        </Field>

        {/* 金額 */}
        <Field name="amount" label="金額（円）" required>
          <input name="amount" type="number" min={1} placeholder="例：3000" className={inputClass} />
        </Field>

        {/* カテゴリ */}
        <Field name="category_id" label="カテゴリ" required>
          <CategoryPicker
            categories={categories}
            onSelect={(id) => setFilled((prev) => ({ ...prev, category_id: id > 0 }))}
          />
        </Field>

        {/* 日付 */}
        <Field name="date" label="日付" required>
          <input name="date" type="date" className={inputClass} />
        </Field>

        {/* メモ */}
        <Field name="memo" label="メモ">
          <textarea name="memo" rows={3} placeholder="任意" className={inputClass} />
        </Field>

        {/* エラーメッセージ */}
        {error && <p className="text-sm text-rose-600">{error}</p>}

        {/* ボタンセクション */}
        <div className="flex gap-3 pt-2">
          {/* 登録ボタン */}
          <button
            type="submit"
            disabled={loading || !isAllFilled}
            className="flex-1 rounded-lg bg-slate-800 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "登録中..." : "登録する"}
          </button>

          {/* キャンセルボタン */}
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            キャンセル
          </button>
        </div>
      </form>
    </ErrorContext>
  );
}

// name で ErrorContext からエラーを自動取得する
function Field({ name, label, required, children }: { name: string; label: string; required?: boolean; children: React.ReactNode }) {
  const errors = useContext(ErrorContext);
  return (
    <div>
      {/* ラベル */}
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>

      {/* フィールド本体 */}
      {children}

      {/* エラーメッセージ */}
      {errors[name] && <p className="mt-1 text-xs text-rose-600">{errors[name]}</p>}
    </div>
  );
}
