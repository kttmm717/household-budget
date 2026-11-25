import Sidebar from "@/app/_components/Sidebar";
import { getMe } from "@/app/_lib/api";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ログインユーザーを取得（トークンが無効なら api.ts がログイン画面へリダイレクトする）
  const { data: user } = await getMe();

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="flex flex-col flex-1 bg-slate-50">
        <div className="flex flex-col flex-1 p-8">{children}</div>
      </main>
    </div>
  );
}
