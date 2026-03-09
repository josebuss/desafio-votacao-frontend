import { AppShell } from "@/components/app-shell";
import { VotoCadastroForm } from "@/components/votacao-form";

export default function SessoesPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-8 py-10">
        <VotoCadastroForm />
      </div>
    </AppShell>
  );
}
