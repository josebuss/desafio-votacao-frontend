import { AppShell } from "@/components/app-shell"
import { NovaPautaForm } from "@/components/nova-pauta-form"

export default function NovaPautaPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-8 py-10">
        <NovaPautaForm />
      </div>
    </AppShell>
  )
}
