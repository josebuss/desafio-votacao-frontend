"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { toastError, toastSuccess } from "@/lib/utils";

type Sessao = {
  id: string;
  pautaCodigo: string;
  pautaDescricao: string;
  inicio: Date;
  fim: Date;
};

export function VotoCadastroForm() {
  const { toast } = useToast();
  const router = useRouter();

  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [sessaoId, setSessaoId] = useState<string>("");
  const [cpf, setCpf] = useState("");
  const [aprova, setAprova] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const sessaoInvalida = submitted && sessaoId === "";
  const cpfInvalido = submitted && cpf.replace(/\D/g, "").length !== 11;
  const aprovaInvalido = submitted && aprova === null;

  async function loadSessoes() {
    try {
      const res = await fetch("/api/sessoes?size=50&offset=0", {
        signal: new AbortController().signal
      });
      const data = await res.json();
      if (!res.ok) {
        toastError(toast, "Erro ao carregar sessoes: " + data.mensagem);
        return;
      }

      const items = Array.isArray(data) ? data : (data.content ?? []);
      const mapped: Sessao[] = items
        .map((it: any) => ({
          id: String(it.id ?? ""),
          pautaCodigo: String(it.pauta?.codigo ?? ""),
          pautaDescricao: String(it.pauta?.descricao ?? ""),
          inicio: new Date(it.inicio ?? ""),
          fim: new Date(it.fim ?? "")
        }))
        .filter((it: Sessao) => it.fim.getTime() >= Date.now());
      setSessoes(mapped);
    } catch (err: any) {
      if (err.name === "AbortError") return;

      toastError(toast, "Erro ao carregar sessoes: " + err.mensagem);
    }
  }

  useEffect(() => {
    loadSessoes();
  }, []);

  function handleCpfInput(e: React.ChangeEvent<HTMLInputElement>) {
    // allow only digits, format lightly if desired
    const onlyDigits = e.target.value.replace(/\D/g, "");
    setCpf(onlyDigits);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);

    if (
      sessaoId === "" ||
      cpf.replace(/\D/g, "").length !== 11 ||
      aprova === null
    ) {
      toastError(toast, "Por favor, preencha todos os campos corretamente.");
      return;
    }

    try {
      const payload = {
        sessaoId,
        cpf: cpf.replace(/\D/g, ""),
        aprova
      };
      const res = await fetch("/api/votacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        toastError(toast, "Erro ao registrar voto: " + data.mensagem);
        return;
      }

      toastSuccess(toast, "Sucesso ao registrar voto!");
      // sucesso: limpa formulário e informa usuário
      setSessaoId("");
      setCpf("");
      setAprova(null);
      setSubmitted(false);
    } catch (err: any) {
      if (err.name === "AbortError") return;
      toastError(toast, "Erro ao registrar voto: " + err.mensagem);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
          className="shrink-0"
          aria-label="Voltar para a home"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Registro de Voto
          </h2>
          <p className="mt-1 text-base leading-relaxed text-muted-foreground">
            Selecione a sessão, informe o CPF do eleitor e marque a opção de
            aprovação.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <Card className="border border-border bg-card">
          <CardContent className="flex flex-col gap-6 p-6">
            <h3 className="text-lg font-semibold text-card-foreground">
              Informações do Voto
            </h3>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="sessao"
                className="text-sm font-medium text-foreground"
              >
                Sessão <span className="text-destructive">*</span>
              </Label>

              <Select
                value={sessaoId}
                onValueChange={setSessaoId}
                onOpenChange={(open: any) =>
                  open && sessoes.length === 0 && loadSessoes()
                }
              >
                <SelectTrigger
                  id="sessao"
                  className={`w-full bg-background ${sessaoInvalida ? "border-destructive" : ""}`}
                  aria-invalid={sessaoInvalida}
                >
                  <SelectValue placeholder="Selecione a sessão de votação" />
                </SelectTrigger>
                <SelectContent className="w-full max-w-full" position="popper">
                  {sessoes.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium">{s.pautaCodigo}</span>
                        <span className="ml-2 text-muted-foreground">
                          — {s.pautaDescricao}
                        </span>
                        <span className="ml-2 text-muted-foreground">
                          — {"Início: " + format(s.inicio, "dd/MM/yyyy HH:mm")}
                        </span>
                        <span className="ml-2 text-muted-foreground">
                          — {"Fim: " + format(s.fim, "dd/MM/yyyy HH:mm")}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {sessaoInvalida ? (
                <span className="text-xs text-destructive">
                  Campo obrigatório.
                </span>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Selecione a sessão para a qual será registrado o voto.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="cpf"
                className="text-sm font-medium text-foreground"
              >
                CPF <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cpf"
                placeholder="Apenas números (11 dígitos)"
                value={cpf}
                onChange={handleCpfInput}
                className={`w-full bg-background ${cpfInvalido ? "border-destructive" : ""}`}
                inputMode="numeric"
                aria-invalid={cpfInvalido}
              />
              {cpfInvalido ? (
                <span className="text-xs text-destructive">
                  CPF inválido. Informe 11 dígitos.
                </span>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Informe o CPF do eleitor sem pontos ou traços.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-foreground">
                Voto <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="aprova"
                    checked={aprova === true}
                    onChange={() => setAprova(true)}
                    className="accent-primary"
                  />
                  <span>Aprovar</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="aprova"
                    checked={aprova === false}
                    onChange={() => setAprova(false)}
                    className="accent-primary"
                  />
                  <span>Rejeitar</span>
                </label>
              </div>
              {aprovaInvalido ? (
                <span className="text-xs text-destructive">
                  Selecione aprovar ou rejeitar.
                </span>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/")}
          >
            Cancelar
          </Button>
          <Button type="submit" className="gap-2">
            Registrar Voto
          </Button>
        </div>
      </form>
    </div>
  );
}
