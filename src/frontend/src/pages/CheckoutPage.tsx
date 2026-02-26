import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Crown, Check, Loader2, ArrowLeft, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCreateCheckoutSession } from "@/hooks/useQueries";
import type { ShoppingItem } from "@/backend.d";

type PlanType = "monthly" | "annual";

const PLAN_CONFIG = {
  monthly: {
    name: "Premium Mensal",
    priceInCents: 990,
    priceDisplay: "R$ 9,90",
    period: "/mês",
    description: "Proteção ativa com renovação mensal",
    productName: "CERC Fortaleza - Plano Premium Mensal",
    productDescription: "Assinatura mensal do plano Premium CERC Fortaleza com proteção ativa de bens",
  },
  annual: {
    name: "Premium Anual",
    priceInCents: 8900,
    priceDisplay: "R$ 89,00",
    period: "/ano",
    description: "Economize ~25% com o plano anual",
    productName: "CERC Fortaleza - Plano Premium Anual",
    productDescription: "Assinatura anual do plano Premium CERC Fortaleza com proteção ativa de bens",
    savings: "Economia de R$ 29,80",
  },
};

const PREMIUM_FEATURES = [
  "Cadastro de até 10 objetos (família toda)",
  "Histórico de Propriedade com certificado digital jurídico",
  "Notificação de Proximidade em raio de 50km",
  "Transferência de Posse para venda segura",
  "Suporte Prioritário",
];

function getPlanFromUrl(): PlanType {
  const params = new URLSearchParams(window.location.search);
  const plan = params.get("plan");
  if (plan === "annual") return "annual";
  return "monthly";
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<PlanType>(getPlanFromUrl);
  const [isProcessing, setIsProcessing] = useState(false);

  const { mutateAsync: createCheckoutSession } = useCreateCheckoutSession();

  // Sync plan from URL when it changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlPlan = params.get("plan");
    if (urlPlan === "annual") setPlan("annual");
    else if (urlPlan === "monthly") setPlan("monthly");
  }, []);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const planConfig = PLAN_CONFIG[plan];

      const shoppingItems: ShoppingItem[] = [
        {
          productName: planConfig.productName,
          productDescription: planConfig.productDescription,
          priceInCents: BigInt(planConfig.priceInCents),
          currency: "BRL",
          quantity: BigInt(1),
        },
      ];

      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      // Stripe replaces {CHECKOUT_SESSION_ID} with the real session ID on redirect
      const successUrl = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`;
      const cancelUrl = `${baseUrl}/checkout?plan=${plan}`;

      console.log("[Checkout] Creating Stripe session...", { plan, baseUrl, successUrl });

      const session = await createCheckoutSession({ items: shoppingItems, successUrl, cancelUrl });

      console.log("[Checkout] Session created:", { sessionId: session.id, hasUrl: !!session.url });

      if (!session.url) {
        throw new Error("URL da sessão Stripe não foi retornada. Tente novamente.");
      }

      // Redirect to Stripe hosted checkout
      console.log("[Checkout] Redirecting to Stripe:", session.url);
      window.location.href = session.url;
    } catch (error) {
      console.error("[Checkout] Error:", error);
      const msg = error instanceof Error ? error.message : "Erro desconhecido ao processar pagamento";
      toast.error(msg, { duration: 6000 });
      setIsProcessing(false);
    }
  };

  const currentPlan = PLAN_CONFIG[plan];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/" })}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex-1 text-center">
              <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight">
                Finalizar Assinatura
              </h1>
            </div>
            {/* Spacer */}
            <div className="w-20" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Plan Selector */}
        <div className="mb-8">
          <h2 className="text-lg font-display font-semibold text-center text-foreground/70 mb-4">
            Selecione seu plano
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Card
              role="button"
              tabIndex={0}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg select-none ${
                plan === "monthly"
                  ? "border-4 border-accent shadow-md ring-2 ring-accent/30"
                  : "border-2 border-border hover:border-accent/50"
              }`}
              onClick={() => setPlan("monthly")}
              onKeyDown={(e) => e.key === "Enter" && setPlan("monthly")}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base md:text-lg font-display text-primary">
                    Mensal
                  </CardTitle>
                  {plan === "monthly" && (
                    <Badge className="bg-accent text-accent-foreground text-xs">✓ Selecionado</Badge>
                  )}
                </div>
                <div className="text-3xl font-display font-extrabold text-accent mt-2">
                  R$ 9,90
                  <span className="text-base text-foreground/50 font-normal">/mês</span>
                </div>
              </CardHeader>
            </Card>

            <Card
              role="button"
              tabIndex={0}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg select-none relative ${
                plan === "annual"
                  ? "border-4 border-accent shadow-md ring-2 ring-accent/30"
                  : "border-2 border-border hover:border-accent/50"
              }`}
              onClick={() => setPlan("annual")}
              onKeyDown={(e) => e.key === "Enter" && setPlan("annual")}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <Badge className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 shadow">
                  <Star className="w-3 h-3 mr-1 inline" />
                  -25%
                </Badge>
              </div>
              <CardHeader className="pb-3 pt-5">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base md:text-lg font-display text-primary">
                    Anual
                  </CardTitle>
                  {plan === "annual" && (
                    <Badge className="bg-accent text-accent-foreground text-xs">✓ Selecionado</Badge>
                  )}
                </div>
                <div className="text-3xl font-display font-extrabold text-accent mt-2">
                  R$ 89,00
                  <span className="text-base text-foreground/50 font-normal">/ano</span>
                </div>
                <p className="text-xs text-green-600 font-semibold mt-1">Economia de R$ 29,80</p>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Main Checkout Card */}
        <Card className="border-2 border-primary/20 shadow-2xl">
          <CardHeader className="text-center space-y-3 border-b pb-6">
            <div className="w-16 h-16 mx-auto bg-accent rounded-full flex items-center justify-center shadow-lg">
              <Crown className="w-8 h-8 text-accent-foreground" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-display font-bold text-primary tracking-tight">
              {currentPlan.name}
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              {currentPlan.description}
            </CardDescription>
            <div className="pt-2">
              <div className="text-5xl md:text-6xl font-display font-extrabold text-accent tracking-tight">
                {currentPlan.priceDisplay}
                <span className="text-2xl text-foreground/50 font-normal">{currentPlan.period}</span>
              </div>
              {plan === "annual" && (
                <p className="text-sm text-green-600 font-semibold mt-2">
                  💰 {PLAN_CONFIG.annual.savings}
                </p>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-8 pb-8">
            {/* Features list */}
            <div className="space-y-4">
              <h3 className="text-lg font-display font-bold text-primary">
                O que você ganha:
              </h3>
              <ul className="space-y-3">
                {PREMIUM_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-foreground/90 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Security badge */}
            <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4 flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <p className="text-sm text-foreground/80">
                <strong>Pagamento 100% seguro</strong> processado pelo Stripe
              </p>
            </div>

            {/* CTA Button */}
            <Button
              type="button"
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full h-14 text-base md:text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Redirecionando para pagamento...
                </>
              ) : (
                <>
                  <Crown className="mr-2 h-5 w-5" />
                  Assinar Agora — {currentPlan.priceDisplay}{currentPlan.period}
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
              Você será redirecionado para o checkout seguro do Stripe.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
