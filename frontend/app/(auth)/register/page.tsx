// frontend/app/(auth)/register/page.tsx
// 新規登録ページ

import type { Metadata } from "next";
import RegisterForm from "./_components/RegisterForm";

export const metadata: Metadata = { title: "新規登録 | 家計簿アプリ" };

export default function RegisterPage() {
  return (
    <>
      <h2 className="mb-6 text-lg font-bold text-slate-800">新規登録</h2>
      <RegisterForm />
    </>
  );
}
