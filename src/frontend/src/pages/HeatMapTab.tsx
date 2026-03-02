import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Bike,
  Laptop,
  MapPin,
  Smartphone,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface Neighborhood {
  name: string;
  count: number;
  phoneCount: number;
  bikeCount: number;
  notebookCount: number;
}

const neighborhoodData: Neighborhood[] = [
  {
    name: "Aldeota",
    count: 87,
    phoneCount: 62,
    bikeCount: 15,
    notebookCount: 10,
  },
  {
    name: "Centro",
    count: 74,
    phoneCount: 55,
    bikeCount: 12,
    notebookCount: 7,
  },
  {
    name: "Benfica",
    count: 65,
    phoneCount: 48,
    bikeCount: 11,
    notebookCount: 6,
  },
  {
    name: "Messejana",
    count: 58,
    phoneCount: 40,
    bikeCount: 14,
    notebookCount: 4,
  },
  {
    name: "Parangaba",
    count: 52,
    phoneCount: 38,
    bikeCount: 10,
    notebookCount: 4,
  },
  {
    name: "Barra do Ceará",
    count: 48,
    phoneCount: 35,
    bikeCount: 10,
    notebookCount: 3,
  },
  {
    name: "Jangurussu",
    count: 45,
    phoneCount: 32,
    bikeCount: 9,
    notebookCount: 4,
  },
  {
    name: "Mondubim",
    count: 42,
    phoneCount: 31,
    bikeCount: 8,
    notebookCount: 3,
  },
  {
    name: "Conjunto Ceará",
    count: 39,
    phoneCount: 28,
    bikeCount: 8,
    notebookCount: 3,
  },
  {
    name: "Castelão",
    count: 36,
    phoneCount: 26,
    bikeCount: 7,
    notebookCount: 3,
  },
  {
    name: "Maraponga",
    count: 33,
    phoneCount: 24,
    bikeCount: 6,
    notebookCount: 3,
  },
  {
    name: "Granja Lisboa",
    count: 30,
    phoneCount: 22,
    bikeCount: 6,
    notebookCount: 2,
  },
  {
    name: "Lagoa Redonda",
    count: 28,
    phoneCount: 20,
    bikeCount: 5,
    notebookCount: 3,
  },
  {
    name: "Praia de Iracema",
    count: 25,
    phoneCount: 19,
    bikeCount: 4,
    notebookCount: 2,
  },
  {
    name: "Meireles",
    count: 22,
    phoneCount: 17,
    bikeCount: 3,
    notebookCount: 2,
  },
  {
    name: "Cambeba",
    count: 20,
    phoneCount: 15,
    bikeCount: 3,
    notebookCount: 2,
  },
  {
    name: "Edson Queiroz",
    count: 18,
    phoneCount: 13,
    bikeCount: 3,
    notebookCount: 2,
  },
  { name: "Papicu", count: 16, phoneCount: 12, bikeCount: 2, notebookCount: 2 },
  { name: "Cocó", count: 14, phoneCount: 10, bikeCount: 3, notebookCount: 1 },
  { name: "Varjota", count: 12, phoneCount: 9, bikeCount: 2, notebookCount: 1 },
];

const maxCount = Math.max(...neighborhoodData.map((n) => n.count));
const top10 = [...neighborhoodData]
  .sort((a, b) => b.count - a.count)
  .slice(0, 10);

function getIntensityClass(count: number): string {
  if (count >= 70) return "bg-red-600";
  if (count >= 50) return "bg-orange-500";
  if (count >= 35) return "bg-yellow-500";
  if (count >= 20) return "bg-lime-500";
  return "bg-green-500";
}

function getTextClass(count: number): string {
  if (count >= 35) return "text-white";
  return "text-gray-900";
}

function getPredominantIcon(n: Neighborhood) {
  if (n.phoneCount >= n.bikeCount && n.phoneCount >= n.notebookCount) {
    return <Smartphone className="w-4 h-4" />;
  }
  if (n.bikeCount >= n.notebookCount) {
    return <Bike className="w-4 h-4" />;
  }
  return <Laptop className="w-4 h-4" />;
}

function getPredominantLabel(n: Neighborhood): string {
  if (n.phoneCount >= n.bikeCount && n.phoneCount >= n.notebookCount)
    return "Celulares";
  if (n.bikeCount >= n.notebookCount) return "Bikes";
  return "Notebooks";
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400 text-yellow-900 font-bold text-xs">
        1
      </span>
    );
  if (rank === 2)
    return (
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-300 text-gray-800 font-bold text-xs">
        2
      </span>
    );
  if (rank === 3)
    return (
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white font-bold text-xs">
        3
      </span>
    );
  return (
    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground font-semibold text-xs">
      {rank}
    </span>
  );
}

export function HeatMapTab() {
  const [expandedNeighborhood, setExpandedNeighborhood] = useState<
    string | null
  >(null);

  function handleCardClick(name: string) {
    setExpandedNeighborhood((prev) => (prev === name ? null : name));
  }

  return (
    <div className="min-h-full bg-background pb-6">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 pt-6 pb-5">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-5 h-5 text-accent" />
            <h1 className="font-display text-xl font-bold tracking-tight">
              Mapa de Ocorrências
            </h1>
          </div>
          <p className="text-primary-foreground/70 text-sm font-sans">
            Fortaleza — últimos 30 dias
          </p>
          <div className="mt-3">
            <Badge
              variant="outline"
              className="border-yellow-400 text-yellow-300 bg-yellow-400/10 text-[11px] font-semibold"
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              DEMO — Dados simulados para demonstração
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 mt-5 space-y-6">
        {/* Intensity Legend */}
        <div
          className="bg-card rounded-xl border border-border p-4 shadow-xs"
          data-ocid="heatmap.section"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Legenda de Intensidade
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: "Baixo (< 20)", cls: "bg-green-500" },
              { label: "Médio (20–34)", cls: "bg-lime-500" },
              { label: "Alto (35–49)", cls: "bg-yellow-500" },
              { label: "Muito alto (50–69)", cls: "bg-orange-500" },
              { label: "Crítico (70+)", cls: "bg-red-600" },
            ].map(({ label, cls }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={cn("w-3 h-3 rounded-sm flex-shrink-0", cls)} />
                <span className="text-[11px] text-foreground/70">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bairros Grid */}
        <section>
          <h2 className="font-display text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Mapa por Bairro
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {neighborhoodData.map((n, idx) => {
              const isExpanded = expandedNeighborhood === n.name;
              const barWidth = Math.round((n.count / maxCount) * 100);
              const intensityCls = getIntensityClass(n.count);
              const textCls = getTextClass(n.count);

              return (
                <motion.button
                  key={n.name}
                  data-ocid={`heatmap.item.${idx + 1}`}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.25 }}
                  onClick={() => handleCardClick(n.name)}
                  className={cn(
                    "relative rounded-xl overflow-hidden text-left shadow-xs border border-white/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all duration-200",
                    intensityCls,
                    isExpanded && "col-span-2 md:col-span-2 shadow-navy",
                  )}
                  aria-expanded={isExpanded}
                  type="button"
                >
                  <div className="p-3">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <p
                        className={cn(
                          "font-display font-bold text-[13px] leading-tight",
                          textCls,
                        )}
                      >
                        {n.name}
                      </p>
                      <span className={cn("opacity-70", textCls)}>
                        {getPredominantIcon(n)}
                      </span>
                    </div>

                    {/* Count */}
                    <p
                      className={cn(
                        "font-display text-2xl font-extrabold leading-none",
                        textCls,
                      )}
                    >
                      {n.count}
                    </p>
                    <p
                      className={cn(
                        "text-[10px] font-medium opacity-75 mt-0.5",
                        textCls,
                      )}
                    >
                      ocorrências
                    </p>

                    {/* Progress bar */}
                    <div
                      className={cn(
                        "mt-2.5 h-1.5 rounded-full",
                        n.count >= 35 ? "bg-white/20" : "bg-black/15",
                      )}
                    >
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          n.count >= 35 ? "bg-white/60" : "bg-black/35",
                        )}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        key="detail"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        className={cn(
                          "border-t overflow-hidden px-3 pb-3",
                          n.count >= 35 ? "border-white/20" : "border-black/10",
                        )}
                      >
                        <p
                          className={cn(
                            "text-[11px] font-semibold uppercase tracking-wide opacity-70 mt-2 mb-1.5",
                            textCls,
                          )}
                        >
                          Detalhes
                        </p>
                        <div className="space-y-1.5">
                          {[
                            {
                              icon: <Smartphone className="w-3.5 h-3.5" />,
                              label: "Celulares",
                              val: n.phoneCount,
                            },
                            {
                              icon: <Bike className="w-3.5 h-3.5" />,
                              label: "Bikes",
                              val: n.bikeCount,
                            },
                            {
                              icon: <Laptop className="w-3.5 h-3.5" />,
                              label: "Notebooks",
                              val: n.notebookCount,
                            },
                          ].map(({ icon, label, val }) => (
                            <div
                              key={label}
                              className={cn(
                                "flex items-center justify-between text-[12px]",
                                textCls,
                              )}
                            >
                              <span className="flex items-center gap-1.5 opacity-80">
                                {icon}
                                {label}
                              </span>
                              <span className="font-bold">{val}</span>
                            </div>
                          ))}
                        </div>
                        <p
                          className={cn("text-[10px] opacity-60 mt-2", textCls)}
                        >
                          Toque novamente para fechar
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Top 10 Ranking */}
        <section>
          <h2 className="font-display text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Top 10 Bairros com Mais Ocorrências
          </h2>

          <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
            {top10.map((n, idx) => {
              const barWidth = Math.round((n.count / maxCount) * 100);

              return (
                <motion.div
                  key={n.name}
                  data-ocid={`heatmap.ranking.item.${idx + 1}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.04, duration: 0.22 }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3",
                    idx < top10.length - 1 && "border-b border-border",
                  )}
                >
                  <RankBadge rank={idx + 1} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {n.name}
                      </p>
                      <span className="text-sm font-bold text-foreground ml-2 flex-shrink-0">
                        {n.count}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className={cn(
                          "h-full rounded-full",
                          getIntensityClass(n.count),
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ delay: 0.2 + idx * 0.04, duration: 0.4 }}
                      />
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-1 text-muted-foreground text-[11px]">
                    {getPredominantIcon(n)}
                    <span className="hidden sm:inline">
                      {getPredominantLabel(n)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Community banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="bg-primary/8 border border-primary/20 rounded-xl p-4 flex gap-3 items-start"
          data-ocid="heatmap.section"
        >
          <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-primary mb-0.5">
              Contribua com a segurança de Fortaleza
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dados baseados nos registros da comunidade CERC. Contribua
              reportando ocorrências no <strong>Meu Baú</strong> — quanto mais
              registros, mais preciso o mapa.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
