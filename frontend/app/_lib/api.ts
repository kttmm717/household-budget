// frontend/app/_lib/api.ts
// APIクライアント

import type { Budget, BudgetFormData, ApiResponse, PaginatedResponse, Category } from "./types";

// TODO: Laravel APIのベースURLを環境変数から読み込む
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

// 共通のfetchヘルパー（Content-Type, Accept ヘッダー付与、エラーハンドリング）
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(API_BASE + path, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    ...init,  // 呼び出し元から渡された method や body を上書きマージ
  });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  // 204 No Content など空ボディのレスポンスは JSON パースしない
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

// 一覧取得（month: "YYYY-MM" 形式で渡すとその月のみ取得）
export async function getBudgets(month?: string): Promise<PaginatedResponse<Budget>> {
  const query = month ? `?month=${encodeURIComponent(month)}` : "";
  return apiFetch<PaginatedResponse<Budget>>(`/budgets${query}`);
}

// 詳細取得
export async function getBudget(id: number): Promise<ApiResponse<Budget>> {
  return apiFetch<ApiResponse<Budget>>(`/budgets/${id}`);
}

// 作成
export async function createBudget(data: BudgetFormData): Promise<ApiResponse<Budget>> {
  return apiFetch<ApiResponse<Budget>>("/budgets", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 更新
export async function updateBudget(id: number, data: BudgetFormData): Promise<ApiResponse<Budget>> {
  return apiFetch<ApiResponse<Budget>>(`/budgets/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// 削除
export async function deleteBudget(id: number): Promise<void> {
  await apiFetch<void>(`/budgets/${id}`, { method: "DELETE" });
}

// カテゴリ一覧取得
export async function getCategories(): Promise<ApiResponse<Category[]>> {
  return apiFetch<ApiResponse<Category[]>>("/categories");
}
