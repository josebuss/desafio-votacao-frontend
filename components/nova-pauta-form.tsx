"use client";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { toastError, toastSuccess } from "@/lib/utils";
import { ca } from "date-fns/locale";

type Pauta = {
  id: string;
  codigo: string;
  descricao: string;
  dataGeracao: Date;
  dataAlteracao: Date;
};

export function NovaPautaForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [pautas, setPautas] = useState<Pauta[]>([]);
  const [descricaoLength, setDescricaoLength] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [descricao, setDescricao] = useState("");

  const codigoInvalido = submitted && codigo.trim() === "";
  const descricaoInvalida = submitted && descricao.trim() === "";

  async function loadPautas(controller: AbortController) {
    try {
      const res = await fetch("/api/pautas?size=10&offset=0", {
        signal: controller.signal
      });
      const data = await res.json();
      if (!res.ok) {
        toastError(toast, "Erro ao carregar pautas: " + data.mensagem);
      }

      const items = Array.isArray(data) ? data : [];
      const mapped = items.map((item: any) => ({
        id: item.id,
        codigo: String(item.codigo ?? ""),
        descricao: item.descricao ?? "",
        dataGeracao: new Date(item.datger ?? ""),
        dataAlteracao: new Date(item.datalt ?? "")
      }));

      setPautas(mapped);
    } catch (err: any) {
      if (err.name === "AbortError") return;

      toastError(toast, "Erro ao carregar pautas: " + err.mensagem);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    loadPautas(controller);

    return () => controller.abort();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);

    if (codigo.trim() === "" || descricao.trim() === "") {
      toastError(toast, "Por favor, preencha todos os campos obrigatorios.");
      return;
    }

    try {
      const res = await fetch("/api/pautas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo: codigo.trim(),
          descricao: descricao.trim()
        })
      });
      if (!res.ok) {
        const data = await res.json();
        toastError(toast, "Erro ao registrar pauta: " + data.mensagem);
      }

      toastSuccess(toast, "Pauta registrada com sucesso!");
      setCodigo("");
      setDescricao("");
      setDescricaoLength(0);
      setSubmitted(false);

      loadPautas(new AbortController());
    } catch (err: any) {
      if (err.name === "AbortError") return;

      toastError(toast, "Erro ao registrar pauta: " + err.mensagem);
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
            Nova Pauta
          </h2>
          <p className="mt-1 text-base leading-relaxed text-muted-foreground">
            Preencha as informacoes para cadastrar uma nova pauta de votacao.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <Card className="border border-border bg-card">
          <CardContent className="flex flex-col gap-6 p-6">
            <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-card-foreground">
              Informacoes da Pauta
            </h3>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="codigo"
                className="text-sm font-medium text-foreground"
              >
                Codigo da Pauta <span className="text-destructive">*</span>
              </Label>
              <Input
                id="codigo"
                placeholder="Ex: 123456789"
                maxLength={9}
                inputMode="numeric"
                value={codigo}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/\D/g, "");
                  setCodigo(target.value);
                }}
                className={`bg-background ${codigoInvalido ? "border-destructive focus-visible:ring-destructive" : ""}`}
                aria-invalid={codigoInvalido}
              />
              {codigoInvalido ? (
                <span className="text-xs text-destructive">
                  Campo obrigatorio.
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Somente numeros. Maximo de 9 caracteres.
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="descricao"
                className="text-sm font-medium text-foreground"
              >
                Descricao da Pauta <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="descricao"
                placeholder="Descreva o assunto da pauta com detalhes."
                rows={5}
                maxLength={100}
                value={descricao}
                onChange={(e) => {
                  setDescricao(e.target.value);
                  setDescricaoLength(e.target.value.length);
                }}
                className={`resize-none bg-background ${descricaoInvalida ? "border-destructive focus-visible:ring-destructive" : ""}`}
                aria-invalid={descricaoInvalida}
              />
              {descricaoInvalida ? (
                <span className="text-xs text-destructive">
                  Campo obrigatorio.
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  {descricaoLength}/100 caracteres
                </span>
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
          <Button type="submit">Cadastrar Pauta</Button>
        </div>
      </form>
      {/* Grid abaixo do form para listar pautas */}
      <div className="overflow-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Código</th>
              <th className="px-4 py-2">Descrição</th>
              <th className="px-4 py-2">Data de Geração</th>
              <th className="px-4 py-2">Data Limite</th>
            </tr>
          </thead>
          <tbody>
            {pautas.map((p, idx) => (
              <tr key={`${p.codigo}-${idx}`} className="border-t">
                <td className="px-4 py-3 align-top">{p.codigo}</td>
                <td className="px-4 py-3">{p.descricao}</td>
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
