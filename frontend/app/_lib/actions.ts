// frontend/app/_lib/actions.ts
// Server Actions（クライアントコンポーネントから呼ばれ、サーバー上で実行される）

"use server";

import { redirect } from "next/navigation";
import * as api from "./api";
import { ApiError } from "./api";
import { setToken, deleteToken } from "./session";
import type { AuthFormState, BudgetFormData } from "./types";

// ===== 認証 =====

// API のエラーをフォーム表示用の状態に変換する
function toFormState(e: unknown, values: Record<string, string>): AuthFormState {
  if (e instanceof ApiError && e.status === 422) {
    return { errors: e.errors, values };
  }
  if (e instanceof ApiError && e.status === 429) {
    return { message: "試行回数が多すぎます。しばらく待ってから再度お試しください。", values };
  }
  return { message: "サーバーに接続できませんでした。時間をおいて再度お試しください。", values };
}

export async function loginAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    const res = await api.login({ email, password });
    await setToken(res.data.token);
  } catch (e) {
    return toFormState(e, { email });
  }
  // redirect は内部で例外を投げるため try の外で呼ぶ
  redirect("/dashboard");
}

export async function registerAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");

  try {
    const res = await api.register({
      name,
      email,
      password: String(formData.get("password") ?? ""),
      password_confirmation: String(formData.get("password_confirmation") ?? ""),
    });
    await setToken(res.data.token);
  } catch (e) {
    return toFormState(e, { name, email });
  }
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  try {
    await api.logout();
  } catch {
    // サーバー側の失効に失敗しても、手元の Cookie は必ず消す
  }
  await deleteToken();
  redirect("/login");
}

// ===== 家計簿 =====

export async function createBudgetAction(data: BudgetFormData): Promise<void> {
  await api.createBudget(data);
}

export async function updateBudgetAction(id: number, data: BudgetFormData): Promise<void> {
  await api.updateBudget(id, data);
}

export async function deleteBudgetAction(id: number): Promise<void> {
  await api.deleteBudget(id);
}
