// frontend/app/(auth)/login/_components/LoginForm.tsx
// ログインフォーム

"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/app/_lib/actions";
import AuthField from "../../_components/AuthField";

export default function LoginForm() {
  // state: サーバーから返ったエラー / pending: 送信中かどうか
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <AuthField
        label="メールアドレス"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state?.values?.email}
        errors={state?.errors?.email}
      />
      <AuthField
        label="パスワード"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        errors={state?.errors?.password}
      />

      {state?.message && <p className="text-sm text-rose-600">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-slate-800 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50 transition-colors"
      >
        {pending ? "ログイン中..." : "ログイン"}
      </button>

      <p className="text-center text-sm text-slate-600">
        アカウントをお持ちでない方は
        <Link href="/register" className="ml-1 font-medium text-slate-800 underline hover:text-slate-600">
          新規登録
        </Link>
      </p>
    </form>
  );
}
