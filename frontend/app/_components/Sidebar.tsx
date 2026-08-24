// frontend/app/_components/Sidebar.tsx
// サイドバーコンポーネント

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@mdi/react";
import { mdiHome, mdiNoteTextOutline, mdiPlus } from "@mdi/js";

const navItems = [
  { href: "/dashboard", label: "ダッシュボード", icon: mdiHome },
  { href: "/budgets", label: "家計簿一覧", icon: mdiNoteTextOutline },
  { href: "/budgets/new", label: "家計簿登録", icon: mdiPlus },
] as const;

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-slate-800 text-white flex flex-col">
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-lg font-bold tracking-wide">家計簿アプリ</h1>
      </div>
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map(({ href, label, icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                    ? "bg-slate-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                >
                  <Icon path={icon} size={0.85} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
