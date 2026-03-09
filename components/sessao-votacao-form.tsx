"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
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

type Pauta = {
  id: string;
  codigo: string;
  descricao: string;
};

type Sessao = {
  id: string;
  inicio: Date;
  fim: Date;
  dataGeracao: Date;
  dataAlteracao: Date;
  pauta: {
    id: string;
    codigo: string;
    descricao: string;
  };
};

export function SessaoVotacaoForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [pautaId, setPautaId] = useState<string>("");
  const [duracao, setDuracao] = useState("");

  const [pautas, setPautas] = useState<Pauta[]>([]);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);

  const pautaInvalida = submitted && pautaId === null;
  const duracaoInvalida = submitted && duracao.trim() === "";

  async function loadPautas() {
    try {
      const res = await fetch("/api/pautas?size=10&offset=0", {
        signal: new AbortController().signal
      });
      const data = await res.json();
      if (!res.ok) {
        toastError(toast, "Erro ao carregar pautas: " + data.mensagem);
        return;
      }

      const items = Array.isArray(data) ? data : (data.content ?? []);
      const mapped: Pauta[] = items.map((it: any) => ({
        id: String(it.id ?? it.codigo ?? ""),
        codigo: String(it.codigo ?? ""),
        descricao: String(it.descricao ?? "")
      }));
      setPautas(mapped);
    } catch (err: any) {
      if (err.name === "AbortError") return;
      toastError(toast, "Erro ao carregar pautas: " + err.mensagem);
    }
  }

  async function loadSessoes() {
    try {
      const res = await fetch("/api/sessoes?size=10&offset=0", {
        signal: new AbortController().signal
      });
      const data = await res.json();
      if (!res.ok) {
        toastError(toast, "Erro ao carregar sessoes: " + data.mensagem);
        return;
      }

      const items = Array.isArray(data) ? data : (data.content ?? []);
      const mapped: Sessao[] = items.map((it: any) => ({
        id: String(it.id ?? it.codigo ?? ""),
        inicio: new Date(it.inicio ?? ""),
        fim: new Date(it.fim ?? ""),
        dataGeracao: new Date(it.datger ?? ""),
        dataAlteracao: new Date(it.datalt ?? ""),
        pauta: {
          id: String(it.pauta.id ?? ""),
          codigo: String(it.pauta.codigo ?? ""),
          descricao: String(it.pauta.descricao ?? "")
        }
      }));
      setSessoes(mapped);
    } catch (err: any) {
      if (err.name === "AbortError") return;

      toastError(toast, "Erro ao carregar sessoes: " + err.mensagem);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    loadSessoes();

    return () => controller.abort();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (pautaId === null || duracao.trim() === "") {
      toastError(toast, "Por favor, preencha todos os campos obrigatorios.");
      return;
    }

    try {
      const res = await fetch("/api/sessoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pautaId: pautaId,
          duracao: duracao.trim()
        })
      });

      if (!res.ok) {
        const data = await res.json();
        toastError(toast, "Erro ao criar sessão: " + data.mensagem);
        return;
      }

      toastSuccess(toast, "Sessão criada com sucesso!");
      setPautaId("");
      setDuracao("");
      setSubmitted(false);

      loadSessoes();
    } catch (err: any) {
      if (err.name === "AbortError") return;

      toastError(toast, "Erro ao criar sessão: " + err.mensagem);
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
            Sessao de Votacao
          </h2>
          <p className="mt-1 text-base leading-relaxed text-muted-foreground">
            Selecione uma pauta e defina a duracao para abrir uma nova sessao de
            votacao.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <Card className="border border-border bg-card">
          <CardContent className="flex flex-col gap-6 p-6">
            <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-card-foreground">
              Configurar Sessao
            </h3>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="pauta"
                className="text-sm font-medium text-foreground"
              >
                Pauta <span className="text-destructive">*</span>
              </Label>

              <Select
                value={pautaId}
                onValueChange={setPautaId}
                onOpenChange={(open: any) =>
                  open && pautas.length === 0 && loadPautas()
                }
              > 
                <SelectTrigger
                  id="pauta"
                  className={`w-full bg-background ${pautaInvalida ? "border-destructive" : ""}`}
                  aria-invalid={pautaInvalida}
                >
                  <SelectValue placeholder="Selecione a pauta de votação" />
                </SelectTrigger>
                <SelectContent
                  className="relative max-w-full"
                  position="popper"
                >
                  {pautas.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      <span className="font-medium">{p.codigo}</span>
                      <span className="ml-2 text-muted-foreground">
                        &mdash; {p.descricao}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {pautaInvalida ? (
                <span className="text-xs text-destructive">
                  Campo obrigatorio.
                </span>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Apenas pautas previamente cadastradas e que ainda nao foram
                  votadas sao exibidas.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="duracao"
                className="text-sm font-medium text-foreground"
              >
                Duracao da Sessao (em minutos){" "}
                <span className="text-destructive">*</span>
              </Label>
              <div className="relative max-w-full">
                <Input
                  id="duracao"
                  type="number"
                  min={1}
                  max={72}
                  placeholder="Ex: 2"
                  value={duracao}
                  onChange={(e) => setDuracao(e.target.value)}
                  className={`w-full bg-background pr-12 ${duracaoInvalida ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  aria-invalid={duracaoInvalida}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              {duracaoInvalida ? (
                <span className="text-xs text-destructive">
                  Campo obrigatorio.
                </span>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Informe a duracao. Apos esse periodo a sessao sera encerrada
                  automaticamente.
                </p>
              )}
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
            Abrir Sessao
          </Button>
        </div>
      </form>
      {/* Grid abaixo do form para listar pautas */}
      <div className="overflow-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Código da pauta</th>
              <th className="px-4 py-2">Descrição da pauta</th>
              <th className="px-4 py-2">Inicio da votação</th>
              <th className="px-4 py-2">Fim da votação</th>
              <th className="px-4 py-2">Data de geração</th>
              <th className="px-4 py-2">Data de alteração</th>
            </tr>
          </thead>
          <tbody>
            {sessoes.map((p, idx) => (
              <tr key={`${p.id}-${idx}`} className="border-t">
                <td className="px-4 py-3 align-top">{p.pauta.codigo}</td>
                <td className="px-4 py-3">{p.pauta.descricao}</td>
                <td className="px-4 py-3">
                  {format(p.inicio, "dd/MM/yyyy HH:mm:ss")}
                </td>
                <td className="px-4 py-3">
                  {format(p.fim, "dd/MM/yyyy HH:mm:ss")}
                </td>
                <td className="px-4 py-3">
                  {format(p.dataGeracao, "dd/MM/yyyy HH:mm:ss")}
                </td>
                <td className="px-4 py-3">
                  {format(p.dataAlteracao, "dd/MM/yyyy HH:mm:ss")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
