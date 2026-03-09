import { AppShell } from "@/components/app-shell"
import { ResultadosVotacao } from "@/components/resultados-votacao"

export default function ResultadosPage() {
  return (
    <AppShell>
      <div className="px-8 py-10">
        <ResultadosVotacao />
      </div>
    </AppShell>
  )
}
