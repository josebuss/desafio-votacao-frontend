import { AppShell } from "@/components/app-shell";
import { StatsBar } from "@/components/stats-bar";

export default function HomePage() {
  return (
    <AppShell>
      <div className="px-8 py-10">
        <div className="mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-center">
            Painel de Votacoes
          </h2>
          <p className="mt-2 max-w-xl text-base leading-relaxed text-muted-foreground justify-center mx-auto text-center">
            Gerencie pautas, conduza sessoes de votacao e acompanhe os
            resultados da sua cooperativa de credito.
          </p>
        </div>

        <StatsBar />
      </div>
    </AppShell>
  );
}
