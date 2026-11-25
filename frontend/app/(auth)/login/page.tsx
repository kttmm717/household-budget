// frontend/app/(auth)/login/page.tsx
// ログインページ

import type { Metadata } from "next";
import LoginForm from "./_components/LoginForm";

export const metadata: Metadata = { title: "ログイン | 家計簿アプリ" };

export default function LoginPage() {
  return (
    <>
      <h2 className="mb-6 text-lg font-bold text-slate-800">ログイン</h2>
      <LoginForm />
    </>
  );
}
