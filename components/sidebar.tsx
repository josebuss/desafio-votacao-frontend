"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Vote, Home, FilePlus2, PlayCircle, BarChart3 } from "lucide-react";

const menuItems = [
  {
    title: "Inicio",
    href: "/",
    icon: Home
  },
  {
    title: "Nova Pauta",
    href: "/pautas/nova",
    icon: FilePlus2
  },
  {
    title: "Sessoes de Votacao",
    href: "/sessoes",
    icon: PlayCircle
  },
  {
    title: "Votação",
    href: "/votacao",
    icon: FilePlus2
  },
  {
    title: "Resultados",
    href: "/resultados",
    icon: BarChart3
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-3 border-b border-sidebar-border px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
          <Vote className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-lg font-bold tracking-tight text-sidebar-foreground">
            CoopVota
          </h1>
          <p className="text-xs text-muted-foreground">Sistema de Votacao</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <item.icon
                className={`h-5 w-5 ${isActive ? "text-sidebar-primary" : ""}`}
              />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span className="text-xs font-medium text-sidebar-foreground">
            Sistema Ativo
          </span>
        </div>
      </div>
    </aside>
  );
}
