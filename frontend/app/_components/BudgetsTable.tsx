// frontend/app/_components/BudgetsTable.tsx
// 家計簿テーブルコンポーネント

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@mdi/react";
import { mdiPencil, mdiTrashCan } from "@mdi/js";
import { updateBudgetAction, deleteBudgetAction } from "@/app/_lib/actions";
import CategoryPicker from "@/app/_components/CategoryPicker";
import { CATEGORY_ICONS } from "@/app/_lib/categoryIcons";
import type { Budget, BudgetFormData, Category } from "@/app/_lib/types";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500";

/* 家計簿テーブルコンポーネント */
export default function BudgetsTable({ budgets, categories }: { budgets: Budget[]; categories: Category[] }) {
  // Next.jsのルーター
  const router = useRouter();

  // 編集対象の家計簿データ
  const [editTarget, setEditTarget] = useState<Budget | null>(null);

  // ローディング状態
  const [loading, setLoading] = useState(false);

  // エラー状態
  const [error, setError] = useState<string | null>(null);

  // 削除処理
  async function handleDelete(id: number) {
    if (!confirm("この項目を削除しますか？")) return;

    // API送信
    await deleteBudgetAction(id);

    // 一覧を再取得するためにページをリフレッシュ
    router.refresh();
  }

  // 更新処理
  async function handleUpdate(e: React.SyntheticEvent<HTMLFormElement>) {
    // ブラウザのデフォルトのフォーム送信をキャンセルする
    e.preventDefault();

    // 編集対象がない場合は何もしない
    if (!editTarget) return;

    // ローディング状態をtrueにする
    setLoading(true);

    // エラー状態をnullにする
    setError(null);

    // フォームデータを取得する
    const fd = new FormData(e.currentTarget);

    // フォームデータを BudgetFormData 型に変換する
    const data: BudgetFormData = {
      title: fd.get("title") as string,
      amount: Number(fd.get("amount")),
      type: fd.get("type") as BudgetFormData["type"],
      category_id: Number(fd.get("category_id")),
      date: fd.get("date") as string,
      memo: (fd.get("memo") as string) || undefined,
    };

    // API送信（更新対象のIDとフォームデータを送信）
    try {
      await updateBudgetAction(editTarget.id, data);
      setEditTarget(null);
      router.refresh();
    } catch {
      setError("更新に失敗しました。");
    } finally {
      setLoading(false);
    }
  }

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
              <th className="px-4 py-3">操作</th>
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

                {/* 操作 */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    {/* 編集ボタン */}
                    <button
                      onClick={() => setEditTarget(b)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                      title="編集"
                    >
                      <Icon path={mdiPencil} size={0.75} />
                    </button>

                    {/* 削除ボタン */}
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      title="削除"
                    >
                      <Icon path={mdiTrashCan} size={0.75} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 編集ダイアログ */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 背景オーバーレイ */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setEditTarget(null)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              家計簿を編集
            </h3>

            {/* 編集フォーム */}
            <form onSubmit={handleUpdate} className="space-y-3">
              {/* タイトル */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">タイトル</label>
                <input name="title" type="text" required defaultValue={editTarget.title} className={inputClass} />
              </div>

              {/* 種別 */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">種別</label>
                <select name="type" required defaultValue={editTarget.type} className={inputClass}>
                  <option value="income">収入</option>
                  <option value="expense">支出</option>
                </select>
              </div>
              
              {/* 金額 */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">金額（円）</label>
                <input name="amount" type="number" min={1} required defaultValue={editTarget.amount} className={inputClass} />
              </div>

              {/* カテゴリ */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">カテゴリ</label>
                <CategoryPicker categories={categories} defaultValue={editTarget.category_id} />
              </div>

              {/* 日付 */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">日付</label>
                <input name="date" type="date" required defaultValue={editTarget.date} className={inputClass} />
              </div>

              {/* メモ */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">メモ</label>
                <textarea name="memo" rows={2} defaultValue={editTarget.memo ?? ""} className={inputClass} />
              </div>

              {/* エラーメッセージ */}
              {error && <p className="text-sm text-rose-600">{error}</p>}

              {/* ボタンセクション */}
              <div className="flex gap-3 pt-1">
                {/* 更新ボタン */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-slate-800 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? "更新中..." : "更新する"}
                </button>

                {/* キャンセルボタン */}
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}


