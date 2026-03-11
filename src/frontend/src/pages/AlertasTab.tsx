import { SubscriptionPlan } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useMarkAlertsRead,
  useMyAlerts,
  useMySubscription,
} from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  BellRing,
  Bike,
  Crown,
  Info,
  Laptop,
  Loader2,
  Smartphone,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  const date = new Date(ms);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

function getObjectTypeLabel(type: string): string {
  const map: Record<string, string> = {
    phone: "Celular",
    bike: "Bicicleta",
    notebook: "Notebook",
  };
  return map[type] ?? type;
}

function ObjectTypeIcon({ type }: { type: string }) {
  if (type === "phone") return <Smartphone className="w-5 h-5" />;
  if (type === "bike") return <Bike className="w-5 h-5" />;
  if (type === "notebook") return <Laptop className="w-5 h-5" />;
  return <Bell className="w-5 h-5" />;
}

export function AlertasTab() {
  const { data: alerts, isLoading } = useMyAlerts();
  const { data: subscription } = useMySubscription();
  const { mutate: markRead } = useMarkAlertsRead();
  const navigate = useNavigate();

  const isPremium =
    subscription?.plan !== SubscriptionPlan.free && !subscription?.isExpired;

  const unreadAlerts = alerts?.filter((a) => !a.isRead) ?? [];
  const hasUnread = unreadAlerts.length > 0;

  // Mark as read when tab mounts
  useEffect(() => {
    if (isPremium && alerts && alerts.length > 0 && hasUnread) {
      markRead();
    }
  }, [isPremium, alerts, hasUnread, markRead]);

  return (
    <div className="min-h-full bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-secondary text-white shadow-navy">
        <div className="container mx-auto px-4 py-5">
          <div className="flex justify-center mb-3">
            <div className="bg-white rounded-lg px-3 py-1.5">
              <img
                src="/assets/uploads/LOGO-COM-NOME-1-1.png"
                alt="CERC FORTALEZA"
                className="h-9 w-auto"
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <BellRing className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-display font-bold text-center tracking-tight">
              Alertas de Proximidade
            </h1>
          </div>
          <p className="text-center text-white/70 text-sm mt-1">
            Fique sabendo quando alguém consulta um objeto similar ao seu
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Premium gate */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            data-ocid="alertas.section"
          >
            <Card className="border-2 border-accent/40 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl mb-4">
              <CardContent className="pt-8 pb-8">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                    <Crown className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-primary mb-1">
                      Recurso Exclusivo Premium
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Alertas de proximidade são exclusivos para assinantes
                      Premium. Receba notificações quando alguém consultar um
                      objeto com características semelhantes ao seu na mesma
                      região.
                    </p>
                  </div>
                  <Button
                    type="button"
                    className="bg-accent hover:bg-accent/90 text-white font-bold px-8"
                    onClick={() => navigate({ to: "/planos" })}
                    data-ocid="alertas.primary_button"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Assinar Premium
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Feature explanation for free users */}
            <Card className="border border-border/50 rounded-2xl">
              <CardContent className="pt-5 pb-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Como funciona
                </p>
                <div className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "Quando alguém consulta um celular roubado na sua região, você é notificado",
                    "Alertas incluem o tipo de objeto e o bairro da consulta",
                    "Útil para identificar padrões de roubo próximos a você",
                  ].map((item) => (
                    <p key={item} className="flex items-start gap-2">
                      <span className="text-accent font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Premium content */}
        {isPremium && (
          <>
            {/* Mark all read button */}
            <AnimatePresence>
              {hasUnread && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-2 border-accent/30 text-accent hover:bg-accent/10 font-semibold"
                    onClick={() => markRead()}
                    data-ocid="alertas.secondary_button"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Marcar tudo como lido
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading state */}
            {isLoading && (
              <div
                className="flex items-center justify-center py-16"
                data-ocid="alertas.loading_state"
              >
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}

            {/* Empty state */}
            {!isLoading && (!alerts || alerts.length === 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                data-ocid="alertas.empty_state"
              >
                <Card className="border-dashed border-2 border-border rounded-2xl">
                  <CardContent className="pt-12 pb-12">
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                        <Bell className="w-7 h-7 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-foreground mb-1">
                          Nenhum alerta ainda
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Os alertas aparecerão aqui quando alguém consultar um
                          objeto do mesmo tipo que o seu na sua região.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Alerts list */}
            {!isLoading && alerts && alerts.length > 0 && (
              <div className="space-y-3" data-ocid="alertas.list">
                <AnimatePresence>
                  {alerts.map((alert, index) => (
                    <motion.div
                      key={String(alert.id)}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      data-ocid={`alertas.item.${index + 1}`}
                    >
                      <Card
                        className={`border rounded-2xl transition-all ${
                          !alert.isRead
                            ? "border-accent/40 bg-accent/5 shadow-sm"
                            : "border-border"
                        }`}
                      >
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                !alert.isRead
                                  ? "bg-accent/20 text-accent"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              <ObjectTypeIcon type={alert.objectType} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="font-semibold text-foreground text-sm">
                                  {getObjectTypeLabel(alert.objectType)}
                                </span>
                                {!alert.isRead && (
                                  <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0 h-4">
                                    Novo
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Consulta em:{" "}
                                <span className="font-medium text-foreground">
                                  {alert.searcherRegion}
                                </span>
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {formatTimestamp(alert.timestamp)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Info banner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <Card className="border border-primary/15 bg-primary/5 rounded-2xl">
                <CardContent className="pt-4 pb-4">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Os alertas são gerados automaticamente quando alguém
                      consulta um objeto do mesmo tipo que o seu na mesma
                      região. Isso ajuda a identificar possíveis tentativas de
                      venda de objetos roubados próximos a você.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
