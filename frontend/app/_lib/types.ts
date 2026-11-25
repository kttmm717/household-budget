// frontend/app/_lib/types.ts
// TypeScriptの型定義ファイル

// 種別（収入 or 支出）
export type BudgetType = "income" | "expense";

// 家計簿アイテムデータの型
export type Budget = {
  id: number;
  title: string;
  amount: number;
  type: BudgetType;
  category_id: number;
  category: string;
  date: string;
  memo: string | null;
  created_at: string;
  updated_at: string;
};

// 家計簿アイテム作成・更新用のフォームデータの型
export type BudgetFormData = {
  title: string;
  amount: number;
  type: BudgetType;
  category_id: number;
  date: string;
  memo?: string;
};

// APIレスポンスの型
export type ApiResponse<T> = {
  data: T;
};

// ページネーション付きAPIレスポンスの型
export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

// カテゴリデータの型
export type Category = {
  id: number;
  name: string;
  type: "income" | "expense" | "both";
};

// ログインユーザーの型
export type User = {
  id: number;
  name: string;
  email: string;
};

// ログイン・登録APIのレスポンスの型
export type AuthResult = {
  token: string;
  user: User;
};

// ログインフォームの型
export type LoginFormData = {
  email: string;
  password: string;
};

// 新規登録フォームの型
export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

// 認証フォーム（useActionState）の状態の型
export type AuthFormState = {
  message?: string;                  // フォーム全体のエラー
  errors?: Record<string, string[]>; // フィールドごとのエラー
  values?: Record<string, string>;   // 入力値（エラー時に再表示するため。パスワードは含めない）
} | undefined;
