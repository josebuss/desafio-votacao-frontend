import { Sidebar } from "@/components/sidebar"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64">
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-border bg-card">
          <div className="flex items-center justify-between px-8 py-6">
            <p className="text-xs text-muted-foreground">
              CoopVota &mdash; Sistema de Votacao para Cooperativas
            </p>
            <p className="text-xs text-muted-foreground">2026</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
