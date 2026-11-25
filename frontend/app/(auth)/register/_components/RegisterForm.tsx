// frontend/app/(auth)/register/_components/RegisterForm.tsx
// 新規登録フォーム

"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/app/_lib/actions";
import AuthField from "../../_components/AuthField";

export default function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <AuthField
        label="名前"
        name="name"
        type="text"
        autoComplete="name"
        required
        maxLength={255}
        defaultValue={state?.values?.name}
        errors={state?.errors?.name}
      />
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
        label="パスワード（8文字以上）"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        errors={state?.errors?.password}
      />
      <AuthField
        label="パスワード（確認）"
        name="password_confirmation"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
      />

      {state?.message && <p className="text-sm text-rose-600">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-slate-800 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50 transition-colors"
      >
        {pending ? "登録中..." : "登録する"}
      </button>

      <p className="text-center text-sm text-slate-600">
        アカウントをお持ちの方は
        <Link href="/login" className="ml-1 font-medium text-slate-800 underline hover:text-slate-600">
          ログイン
        </Link>
      </p>
    </form>
  );
}
