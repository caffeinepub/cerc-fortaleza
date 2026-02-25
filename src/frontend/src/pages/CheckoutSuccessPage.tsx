import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Crown, CheckCircle2, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useGetStripeSessionStatus, useUpgradeToPremium } from "@/hooks/useQueries";
import { SubscriptionPlan } from "@/backend.d";

type PlanType = "monthly" | "annual";

const PLAN_MAPPING: Record<PlanType, SubscriptionPlan> = {
  monthly: SubscriptionPlan.premiumMonthly,
  annual: SubscriptionPlan.premiumAnnual,
};

const PLAN_DURATION_MS = {
  monthly: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
  annual: 365 * 24 * 60 * 60 * 1000, // 365 days in ms
};

export function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/checkout/success" });
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [processingTimeout, setProcessingTimeout] = useState(false);

  const { mutateAsync: getSessionStatus } = useGetStripeSessionStatus();
  const { mutateAsync: upgradeToPremium } = useUpgradeToPremium();

  const processPayment = useCallback(async () => {
    console.log("🔵 [CheckoutSuccess] Iniciando processamento de pagamento...");
    
    try {
      // Extract session_id and plan from URL
      const sessionId = (search as { session_id?: string })?.session_id;
      const planParam = (search as { plan?: string })?.plan as PlanType | undefined;

      console.log("🔵 [CheckoutSuccess] Parâmetros da URL:", { sessionId, planParam });

      // Validar session_id
      if (!sessionId || sessionId.trim() === "" || sessionId === "{CHECKOUT_SESSION_ID}") {
        console.error("🔴 [CheckoutSuccess] Session ID inválido ou faltando");
        setProcessingError("ID da sessão de pagamento não encontrado. Verifique o link recebido.");
        setIsProcessing(false);
        return;
      }

      // Validar planParam
      if (!planParam || (planParam !== "monthly" && planParam !== "annual")) {
        console.error("🔴 [CheckoutSuccess] Plano inválido:", planParam);
        setProcessingError("Plano de assinatura inválido. Entre em contato com o suporte.");
        setIsProcessing(false);
        return;
      }

      // Get session status from Stripe
      console.log("🔵 [CheckoutSuccess] Consultando status da sessão Stripe...");
      const sessionStatus = await getSessionStatus(sessionId);
      console.log("🔵 [CheckoutSuccess] Status retornado:", sessionStatus);

      if (sessionStatus.__kind__ === "failed") {
        const errorMsg = "error" in sessionStatus.failed 
          ? sessionStatus.failed.error 
          : "Pagamento falhou - status desconhecido";
        console.error("🔴 [CheckoutSuccess] Pagamento falhou:", errorMsg);
        setProcessingError(errorMsg);
        setIsProcessing(false);
        toast.error("Falha no pagamento: " + errorMsg, { duration: 6000 });
        return;
      }

      // Payment completed successfully
      if (sessionStatus.__kind__ === "completed") {
        const customerIdFromResponse = sessionStatus.completed.response;
        console.log("🟢 [CheckoutSuccess] Pagamento confirmado! Customer ID:", customerIdFromResponse);
        
        // Calculate expiration date
        const now = Date.now();
        const durationMs = PLAN_DURATION_MS[planParam];
        const expirationMs = now + durationMs;
        const expirationNs = BigInt(expirationMs * 1_000_000); // Convert to nanoseconds
        
        console.log("🔵 [CheckoutSuccess] Calculando expiração:", {
          now: new Date(now).toISOString(),
          durationMs,
          expiration: new Date(expirationMs).toISOString(),
        });
        
        // Upgrade to premium
        console.log("🔵 [CheckoutSuccess] Ativando assinatura Premium...");
        const subscriptionPlan = PLAN_MAPPING[planParam];
        await upgradeToPremium({
          plan: subscriptionPlan,
          stripeCustomerId: customerIdFromResponse,
          expirationDate: expirationNs,
        });

        console.log("🟢 [CheckoutSuccess] Assinatura Premium ativada com sucesso!");

        // Set expiration date for display
        setExpirationDate(new Date(expirationMs));
        setIsProcessing(false);
        toast.success("🎉 Assinatura Premium ativada com sucesso!", { duration: 5000 });
      } else {
        console.error("🔴 [CheckoutSuccess] Status desconhecido:", sessionStatus);
        setProcessingError("Status de pagamento não reconhecido. Entre em contato com o suporte.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("🔴 [CheckoutSuccess] Erro no processamento:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao processar pagamento";
      setProcessingError(errorMessage);
      setIsProcessing(false);
      toast.error("Erro ao processar pagamento: " + errorMessage, { duration: 6000 });
    }
  }, [search, getSessionStatus, upgradeToPremium]);

  useEffect(() => {
    // Timeout de segurança: 30 segundos
    const timeoutId = setTimeout(() => {
      setProcessingTimeout(true);
      setProcessingError("Tempo limite excedido. Entre em contato com o suporte.");
      setIsProcessing(false);
    }, 30000); // 30 segundos

    processPayment();

    return () => clearTimeout(timeoutId);
  }, [processPayment]);

  const formatExpirationDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Loading state
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-2 border-accent/30 shadow-2xl">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <Loader2 className="w-16 h-16 text-accent animate-spin" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">
                  Processando Pagamento...
                </h2>
                <p className="text-muted-foreground">
                  Aguarde enquanto confirmamos sua assinatura
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (processingError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-2 border-red-500/30 shadow-2xl">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-red-600">
                  {processingTimeout ? "Timeout no Processamento" : "Erro no Pagamento"}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {processingError}
                </p>
                {processingTimeout && (
                  <p className="text-sm text-muted-foreground">
                    O processamento demorou mais de 30 segundos. Verifique seu painel de assinaturas 
                    ou entre em contato com o suporte.
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => navigate({ to: "/checkout" })}
                  variant="default"
                  className="bg-accent hover:bg-accent/90"
                >
                  Tentar Novamente
                </Button>
                <Button
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
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center animate-pulse">
                <Crown className="w-12 h-12 text-accent-foreground" />
              </div>
              <div className="absolute -bottom-2 -right-2">
                <CheckCircle2 className="w-10 h-10 text-green-500 bg-background rounded-full" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <CardTitle className="text-3xl md:text-4xl font-display font-extrabold text-primary tracking-tight">
              Pagamento Confirmado! 🎉
            </CardTitle>
            <CardDescription className="text-lg md:text-xl leading-relaxed">
              Sua assinatura <strong className="text-accent">Premium</strong> está ativa
            </CardDescription>
            {expirationDate && (
              <p className="text-sm text-muted-foreground font-semibold">
                Válida até: {formatExpirationDate(expirationDate)}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-8 pb-12">
          {/* Benefits Summary */}
          <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-display font-bold text-primary text-center">
              Seus Novos Benefícios Premium
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                <span className="text-foreground/90">Até 10 objetos cadastrados</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                <span className="text-foreground/90">Certificado digital jurídico</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                <span className="text-foreground/90">Alertas de proximidade</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                <span className="text-foreground/90">Transferência de posse</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold text-primary text-center">
              Próximos Passos
            </h3>
            <div className="space-y-3 text-sm text-foreground/80">
              <div className="flex gap-3">
                <span className="font-bold text-accent">1.</span>
                <p>Acesse seu <strong>Meu Baú</strong> e cadastre até 10 objetos</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-accent">2.</span>
                <p>Configure notificações para receber alertas de segurança</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-accent">3.</span>
                <p>Aproveite todos os recursos Premium disponíveis</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => navigate({ to: "/app/vault" })}
            className="w-full h-14 text-base md:text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
          >
            Ir para Meu Baú
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          {/* Support Info */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Dúvidas? Entre em contato com nosso suporte prioritário
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
