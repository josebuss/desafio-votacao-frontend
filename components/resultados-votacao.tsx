"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
  XCircle,
  MinusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { toastError, toastSuccess } from "@/lib/utils";

type ResultadoStatus = "APROVADO" | "REPROVADO" | "INCONCLUSIVO";

type Resultado = {
  id: string;
  sessaoVotacao: {
    id: string;
    pauta: {
      id: string;
      codigo: string;
      descricao: string;
    };
    inicio: Date;
    fim: Date;
  };
  totalSim: number;
  totalNao: number;
  totalVotos: number;
  resultado: ResultadoStatus;
};

function ResultadoBadge({ resultado }: { resultado: ResultadoStatus }) {
  const config = {
    APROVADO: {
      icon: CheckCircle2,
      className: "bg-emerald-500/10 text-emerald-600"
    },
    REPROVADO: {
      icon: XCircle,
      className: "bg-red-500/10 text-red-600"
    },
    INCONCLUSIVO: {
      icon: MinusCircle,
      className: "bg-amber-500/10 text-amber-600"
    }
  };
  console.log("resultado:", resultado);

  const { icon: Icon, className } = config[resultado];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {resultado}
    </span>
  );
}

function VotoBadge({ voto }: { voto: string }) {
  const className =
    voto === "Sim"
      ? "bg-emerald-500/10 text-emerald-600"
      : voto === "Nao"
        ? "bg-red-500/10 text-red-600"
        : "bg-muted text-muted-foreground";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {voto === "Nao" ? "Nao" : voto}
    </span>
  );
}

export function ResultadosVotacao() {
  const { toast } = useToast();
  const [resultado, setResultado] = useState<Resultado[]>([]);
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadResultados();
  }, []);

  async function loadResultados() {
    try {
      const res = await fetch("/api/resultados?size=50&offset=0", {
        signal: new AbortController().signal
      });
      const data = await res.json();
      if (!res.ok) {
        toastError(toast, "Erro ao carregar resultados: " + data.mensagem);
        return;
      }

      const items = Array.isArray(data) ? data : (data.content ?? []);

      const mapped: Resultado[] = items.map((it: any) => ({
        id: String(it.id ?? ""),
        sessaoVotacao: {
          id: String(it.sessaoVotacao?.id ?? ""),
          pauta: {
            id: String(it.sessaoVotacao?.pauta?.id ?? ""),
            codigo: String(it.sessaoVotacao?.pauta?.codigo ?? ""),
            descricao: String(it.sessaoVotacao?.pauta?.descricao ?? "")
          },
          inicio: new Date(it.sessaoVotacao?.inicio ?? ""),
          fim: new Date(it.sessaoVotacao?.fim ?? "")
        },
        totalSim: Number(it.totalSim ?? 0),
        totalNao: Number(it.totalNao ?? 0),
        totalVotos: Number(it.totalVotos ?? 0),
        resultado: (it.resultado ?? "INCONCLUSIVO") as ResultadoStatus
      }));
      setResultado(mapped);
    } catch (err: any) {
      if (err.name === "AbortError") return;

      toastError(toast, "Erro ao carregar resultados: " + err.mensagem);
    }
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
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
            Resultados
          </h2>
          <p className="mt-1 text-base leading-relaxed text-muted-foreground">
            Consulte os resultados das votacoes encerradas e os votos
            individuais.
          </p>
        </div>
      </div>

      <Card className="border border-border bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10" />
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Pauta código
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Pauta descrição
                </TableHead>
                <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">
                  Início
                </TableHead>
                <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
                  Fim
                </TableHead>
                <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Resultado
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resultado.map((dto) => {
                const isExpanded = expandedId === dto.id;
                return (
                  <React.Fragment key={dto.id}>
                    <TableRow
                      key={dto.id}
                      className="cursor-pointer transition-colors"
                      onClick={() => toggleExpand(dto.id)}
                    >
                      <TableCell className="w-10 py-4">
                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-medium text-muted-foreground">
                            {dto.sessaoVotacao.pauta.codigo}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-sm text-foreground">
                          {dto.sessaoVotacao.pauta.descricao}
                        </span>
                      </TableCell>
                      <TableCell className="hidden py-4 sm:table-cell">
                        <span className="text-sm text-foreground">
                          {format(dto.sessaoVotacao.inicio, "dd/MM/yyyy HH:mm")}
                        </span>
                      </TableCell>
                      <TableCell className="hidden py-4 md:table-cell">
                        <span className="text-sm text-foreground">
                          {format(dto.sessaoVotacao.fim, "dd/MM/yyyy HH:mm")}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <ResultadoBadge resultado={dto.resultado} />
                      </TableCell>
                    </TableRow>

                    {isExpanded && (
                      <TableRow key={`${dto.id}-detail`}>
                        <TableCell colSpan={6} className="p-0">
                          <div className="border-t border-border bg-muted/30 px-6 py-4">
                            <div className="overflow-x-auto rounded-lg border border-border bg-card">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                      Detalhes
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow className=" bg-green-100">
                                    <TableCell className="py-3">
                                      <span className="font-mono text-sm text-foreground">
                                        Sim
                                      </span>
                                    </TableCell>
                                    <TableCell className="py-3">
                                      <span className="font-mono text-sm text-foreground">
                                        {dto.totalSim}
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow className="bg-red-100">
                                    <TableCell className="py-3">
                                      <span className="font-mono text-sm text-foreground">
                                        Não
                                      </span>
                                    </TableCell>
                                    <TableCell className="py-3">
                                      <span className="font-mono text-sm text-foreground">
                                        {dto.totalNao}
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow className="bg-gray-100">
                                    <TableCell className="py-3">
                                      <span className="font-mono text-sm text-foreground">
                                        Total
                                      </span>
                                    </TableCell>
                                    <TableCell className="py-3">
                                      <span className="font-mono text-sm text-foreground">
                                        {dto.totalVotos}
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
