import Link from "next/link"
import { Vote } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Vote className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-lg font-bold tracking-tight text-foreground">
              CoopVota
            </h1>
            <p className="text-xs text-muted-foreground">
              Sistema de Votação
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full bg-secondary px-3 py-1.5 sm:flex">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-xs font-medium text-secondary-foreground">
              Sistema Ativo
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
