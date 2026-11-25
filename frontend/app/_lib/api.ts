// frontend/app/_lib/api.ts
// APIクライアント（サーバー専用）
// トークンを Cookie から読み出して Authorization ヘッダーに付与するため、
// クライアントコンポーネントからは直接呼ばず、actions.ts の Server Actions 経由で使う

import "server-only";
import { redirect } from "next/navigation";
import { getToken } from "./session";
import type {
  Budget,
  BudgetFormData,
  ApiResponse,
  PaginatedResponse,
  Category,
  User,
  AuthResult,
  LoginFormData,
  RegisterFormData,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

// APIエラー（422 のバリデーションエラーはフィールドごとのメッセージを持つ）
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors: Record<string, string[]> = {},
  ) {
    super(message);
  }
}

// 共通のfetchヘルパー（ヘッダー付与、認証、エラーハンドリング）
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getToken();

  const res = await fetch(API_BASE + path, {
    ...init, // 呼び出し元から渡された method や body
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store", // ユーザーごとにデータが違うのでキャッシュしない
  });

  // トークン切れ・未ログインはログイン画面へ
  if (res.status === 401) {
    redirect("/login");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message ?? `${res.status} ${res.statusText}`, body.errors);
  }

  // 204 No Content など空ボディのレスポンスは JSON パースしない
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

// ===== 認証 =====

// ログイン
export async function login(data: LoginFormData): Promise<ApiResponse<AuthResult>> {
  return apiFetch<ApiResponse<AuthResult>>("/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 新規登録
export async function register(data: RegisterFormData): Promise<ApiResponse<AuthResult>> {
  return apiFetch<ApiResponse<AuthResult>>("/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ログアウト（サーバー側のトークンを失効させる）
export async function logout(): Promise<void> {
  await apiFetch<void>("/logout", { method: "POST" });
}

// ログイン中のユーザー情報
export async function getMe(): Promise<ApiResponse<User>> {
  return apiFetch<ApiResponse<User>>("/user");
}

// ===== 家計簿 =====

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
