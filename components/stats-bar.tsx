"use client";

import { FileText, CheckCircle2, Clock, icons } from "lucide-react";
import { toast } from "./ui/use-toast";
import { useToast } from "@/hooks/use-toast";
import { toastError } from "@/lib/utils";
import { useEffect, useState } from "react";

type Card = {
  label: string;
  value: number;
  icon: React.ElementType;
};

export function StatsBar() {
  const { toast } = useToast();
  const [cards, setCards] = useState<Card[]>([]);
  async function loadStats(controller: AbortController) {
    try {
      const [pautasRes, sessoesRes] = await Promise.all([
        fetch("/api/pautas", { signal: controller.signal }),
        fetch("/api/sessoes", { signal: controller.signal })
      ]);

      const pautasData = await pautasRes.json();
      const sessoesData = await sessoesRes.json();

      if (!pautasRes.ok) {
        toastError(toast, "Erro ao carregar pautas: " + pautasData.mensagem);
        return;
      }

      if (!sessoesRes.ok) {
        toastError(toast, "Erro ao carregar sessões: " + sessoesData.mensagem);
        return;
      }

      const pautas = Array.isArray(pautasData)
        ? pautasData
        : (pautasData.content ?? []);

      const sessoes = Array.isArray(sessoesData)
        ? sessoesData
        : (sessoesData.content ?? []);

      const concluidas = sessoes.filter(
        (s: any) => new Date(s.fim) <= new Date()
      ).length;
      
      const emAndamento = sessoes.filter(
        (s: any) => new Date(s.fim) > new Date()
      ).length;

      const novosCards: Card[] = [
        {
          label: "Pautas",
          value: pautas.length,
          icon: FileText
        },
        {
          label: "Votações Concluídas",
          value: concluidas,
          icon: CheckCircle2
        },
        {
          label: "Votações em Andamento",
          value: emAndamento,
          icon: Clock
        }
      ];

      setCards(novosCards);
    } catch (err: any) {
      if (err.name === "AbortError") return;

      toastError(toast, "Erro ao carregar estatísticas: " + err.message);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    loadStats(controller);

    return () => controller.abort();
  }, []);

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
            <card.icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-heading)] text-2xl font-bold text-foreground">
              {card.value}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {card.label}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
