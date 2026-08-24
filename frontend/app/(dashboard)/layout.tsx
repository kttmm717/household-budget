import Sidebar from "@/app/_components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex flex-col flex-1 bg-slate-50">
        <div className="flex flex-col flex-1 p-8">{children}</div>
      </main>
    </div>
  );
}
