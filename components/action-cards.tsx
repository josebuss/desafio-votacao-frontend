import Link from "next/link"
import { FilePlus2, PlayCircle, BarChart3, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const actions = [
  {
    title: "Nova Pauta",
    description:
      "Cadastre uma nova pauta para ser discutida e votada pelos cooperados na assembleia.",
    icon: FilePlus2,
    href: "/pautas/nova",
    accent: "bg-primary",
    accentLight: "bg-primary/10",
    iconColor: "text-primary-foreground",
    stat: "Criar pauta",
  },
  {
    title: "Sessões de Votação",
    description:
      "Abra e gerencie sessões de votação para pautas que estão em andamento.",
    icon: PlayCircle,
    href: "/sessoes",
    accent: "bg-accent",
    accentLight: "bg-accent/10",
    iconColor: "text-accent-foreground",
    stat: "Gerenciar sessões",
  },
  {
    title: "Resultados",
    description:
      "Consulte os resultados das votações já encerradas e gere relatórios detalhados.",
    icon: BarChart3,
    href: "/resultados",
    accent: "bg-foreground",
    accentLight: "bg-foreground/5",
    iconColor: "text-background",
    stat: "Ver resultados",
  },
]

export function ActionCards() {
  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {actions.map((action) => (
        <Link key={action.title} href={action.href}>
          <Card className="group h-full cursor-pointer border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
            <CardContent className="flex h-full flex-col gap-6 p-6">
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.accent} transition-transform duration-300 group-hover:scale-110`}
                >
                  <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-card-foreground">
                  {action.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {action.description}
                </p>
              </div>

              <div
                className={`inline-flex items-center gap-2 self-start rounded-full ${action.accentLight} px-3 py-1.5`}
              >
                <span className="text-xs font-semibold text-foreground">
                  {action.stat}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </section>
  )
}
