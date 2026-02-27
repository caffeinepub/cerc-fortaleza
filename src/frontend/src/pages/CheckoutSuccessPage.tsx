import { SubscriptionPlan } from "@/backend.d";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useActivateMyPremium } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Crown,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type PlanKey = "monthly" | "annual";

const PLAN_MAPPING: Record<PlanKey, SubscriptionPlan> = {
  monthly: SubscriptionPlan.premiumMonthly,
  annual: SubscriptionPlan.premiumAnnual,
};

type PageState = "processing" | "success" | "error";

function getSearchParams(): { sessionId: string; planKey: string } {
  const params = new URLSearchParams(window.location.search);
  return {
    sessionId: params.get("session_id") ?? "",
    planKey: params.get("plan") ?? "",
  };
}

export function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>("processing");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [sessionIdDisplay, setSessionIdDisplay] = useState<string>("");
  const [isRetrying, setIsRetrying] = useState(false);
  const hasProcessed = useRef(false);
  const autoRetryDone = useRef(false);

  const { mutateAsync: activateMyPremium } = useActivateMyPremium();

  const processPayment = useCallback(async () => {
    // Guard: only process once per call
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const { sessionId, planKey } = getSearchParams();

    console.log("[CheckoutSuccess] Processing payment", {
      sessionId: sessionId.substring(0, 20),
      planKey,
    });

    // Store truncated session ID for display
    if (sessionId) {
      setSessionIdDisplay(
        sessionId.length > 20 ? `${sessionId.substring(0, 20)}...` : sessionId,
      );
    }

    // Validate session_id
    if (
      !sessionId ||
      sessionId.trim() === "" ||
      sessionId === "{CHECKOUT_SESSION_ID}"
    ) {
      const msg =
        "ID de sessão inválido ou não encontrado. Verifique o link de retorno do pagamento.";
      console.error("[CheckoutSuccess] Invalid session_id:", sessionId);
      setErrorMessage(msg);
      setPageState("error");
      return;
    }

    // Validate plan
    if (planKey !== "monthly" && planKey !== "annual") {
      const msg =
        "Plano de assinatura não reconhecido. Entre em contato com o suporte.";
      console.error("[CheckoutSuccess] Invalid plan:", planKey);
      setErrorMessage(msg);
      setPageState("error");
      return;
    }

    const subscriptionPlan = PLAN_MAPPING[planKey as PlanKey];

    // Timeout: 60 seconds
    const timeoutId = setTimeout(() => {
      setErrorMessage(
        "O processamento excedeu o tempo limite (60 segundos). Entre em contato com o suporte.",
      );
      setPageState("error");
    }, 60000);

    try {
      await activateMyPremium({ sessionId, plan: subscriptionPlan });
      clearTimeout(timeoutId);
      console.log("[CheckoutSuccess] Premium activated successfully");
      setPageState("success");
      toast.success("Assinatura Premium ativada com sucesso!", {
        duration: 5000,
      });
    } catch (error) {
      clearTimeout(timeoutId);
      const msg =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao ativar assinatura";
      console.error("[CheckoutSuccess] Activation error:", msg);

      // Auto-retry once after 5 seconds before showing error UI
      if (!autoRetryDone.current) {
        autoRetryDone.current = true;
        console.log("[CheckoutSuccess] Scheduling auto-retry in 5 seconds...");
        setTimeout(() => {
          hasProcessed.current = false;
          void processPayment();
        }, 5000);
        return;
      }

      setErrorMessage(msg);
      setPageState("error");
      toast.error(`Erro ao ativar assinatura: ${msg}`, { duration: 6000 });
    }
  }, [activateMyPremium]);

  useEffect(() => {
    void processPayment();
  }, [processPayment]);

  const handleManualRetry = useCallback(async () => {
    setIsRetrying(true);
    setPageState("processing");
    hasProcessed.current = false;
    try {
      await processPayment();
    } finally {
      setIsRetrying(false);
    }
  }, [processPayment]);

  // Loading state
  if (pageState === "processing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-2 border-accent/30 shadow-2xl">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <Loader2 className="w-20 h-20 text-accent animate-spin" />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">
                  {isRetrying
                    ? "Tentando Novamente..."
                    : "Ativando sua Assinatura..."}
                </h2>
                <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  {isRetrying
                    ? "Reconectando com o Stripe para ativar seu plano Premium."
                    : "Confirmando seu pagamento com o Stripe e ativando o plano Premium. Aguarde alguns instantes."}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div
                  className="w-2 h-2 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (pageState === "error") {
    const { sessionId } = getSearchParams();
    const displayId =
      sessionId.length > 20
        ? `${sessionId.substring(0, 20)}...`
        : sessionIdDisplay || "N/A";

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-2 border-red-500/30 shadow-2xl">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-red-600">
                  Erro ao Ativar Assinatura
                </h2>
                <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  Seu pagamento foi processado pelo Stripe, mas houve um erro ao
                  ativar sua assinatura. Clique em &quot;Tentar Ativar
                  Novamente&quot; ou entre em contato com o suporte informando o
                  ID da sessão.
                </p>
              </div>

              {/* Session ID reference */}
              <div className="bg-muted/50 border border-border rounded-lg p-3 text-sm text-foreground/70">
                <p className="font-semibold mb-1">ID da Sessão:</p>
                <code className="font-mono text-xs break-all text-foreground/90">
                  {displayId}
                </code>
              </div>

              {/* Error detail */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 text-left">
                <p className="font-semibold mb-1">Detalhe do erro:</p>
                <p className="break-words">{errorMessage}</p>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4 text-sm text-foreground/70 text-left">
                <p className="font-semibold mb-1">Não se preocupe:</p>
                <p>
                  Se o pagamento foi confirmado pelo Stripe, entre em contato
                  com o suporte informando o ID da sessão acima. Você não será
                  cobrado novamente.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  type="button"
                  onClick={() => void handleManualRetry()}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Ativar Novamente
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate({ to: "/" })}
                  variant="outline"
                >
                  Voltar ao Início
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-2 border-accent/30 shadow-2xl">
        <CardHeader className="text-center space-y-6 pt-12">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center shadow-xl animate-pulse">
                <Crown className="w-12 h-12 text-accent-foreground" />
              </div>
              <div className="absolute -bottom-2 -right-2">
                <CheckCircle2 className="w-10 h-10 text-green-500 bg-background rounded-full" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <CardTitle className="text-3xl md:text-4xl font-display font-extrabold text-primary tracking-tight">
              Pagamento Confirmado!
            </CardTitle>
            <CardDescription className="text-lg md:text-xl leading-relaxed">
              Sua assinatura <strong className="text-accent">Premium</strong>{" "}
              está ativa agora
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 pb-12">
          {/* Benefits */}
          <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-display font-bold text-primary text-center">
              Seus Benefícios Premium Ativados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {[
                "Até 10 objetos cadastrados",
                "Certificado digital jurídico",
                "Alertas de proximidade (50km)",
                "Transferência de posse segura",
                "Suporte prioritário",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  <span className="text-foreground/90">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold text-primary text-center">
              Próximos Passos
            </h3>
            <div className="space-y-3 text-sm text-foreground/80">
              <div className="flex gap-3">
                <span className="font-bold text-accent w-5 shrink-0">1.</span>
                <p>
                  Acesse seu <strong>Meu Baú</strong> e cadastre até 10 objetos
                </p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-accent w-5 shrink-0">2.</span>
                <p>
                  Configure alertas para receber notificações de segurança em
                  tempo real
                </p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-accent w-5 shrink-0">3.</span>
                <p>
                  Aproveite todos os recursos Premium disponíveis no seu painel
                </p>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => navigate({ to: "/app/vault" })}
            className="w-full h-14 text-base md:text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
          >
            Ir para Meu Baú
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Dúvidas? Entre em contato com nosso suporte prioritário
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
