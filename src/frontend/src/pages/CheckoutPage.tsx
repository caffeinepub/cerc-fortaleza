import type { ShoppingItem } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCreateCheckoutSession } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Crown,
  Loader2,
  Shield,
  Sparkles,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type PlanType = "monthly" | "annual";

const STRIPE_LINKS: Record<PlanType, string> = {
  monthly: "https://buy.stripe.com/aFa3cngTd6a12K8bTY4Ni01",
  annual: "https://buy.stripe.com/7sY3cn6ezaqhacAbTY4Ni00",
};

const PLAN_CONFIG = {
  monthly: {
    name: "Premium Mensal",
    priceInCents: 990,
    priceDisplay: "R$ 9,90",
    period: "/mês",
    description: "Proteção ativa com renovação mensal",
    productName: "CERC Fortaleza — Plano Premium Mensal",
    productDescription: "Assinatura mensal Premium CERC Fortaleza",
  },
  annual: {
    name: "Premium Anual",
    priceInCents: 8900,
    priceDisplay: "R$ 89,00",
    period: "/ano",
    description: "Economize ~25% com o plano anual",
    productName: "CERC Fortaleza — Plano Premium Anual",
    productDescription: "Assinatura anual Premium CERC Fortaleza",
    savings: "Economia de R$ 29,80",
  },
};

const PREMIUM_FEATURES = [
  "Cadastro de até 10 objetos (família toda)",
  "Histórico de propriedade com certificado digital jurídico",
  "Notificação de proximidade em raio de 50km",
  "Transferência de posse para venda segura",
  "Suporte prioritário",
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlPlan = params.get("plan");
    if (urlPlan === "annual") setPlan("annual");
    else if (urlPlan === "monthly") setPlan("monthly");
  }, []);

  const handleCheckoutWithSession = async () => {
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
      const successUrl = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`;
      const cancelUrl = `${baseUrl}/checkout?plan=${plan}`;

      const session = await createCheckoutSession({
        items: shoppingItems,
        successUrl,
        cancelUrl,
      });

      if (!session.url) {
        throw new Error("URL da sessão Stripe não retornada.");
      }

      window.location.href = session.url;
    } catch (error) {
      console.error("[Checkout] Error:", error);
      const msg =
        error instanceof Error ? error.message : "Erro ao processar pagamento";
      toast.error(msg, { duration: 6000 });
      setIsProcessing(false);
    }
  };

  const currentPlan = PLAN_CONFIG[plan];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="bg-secondary text-white shadow-navy">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/planos" })}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex-1 text-center">
              <h1 className="text-xl font-display font-bold tracking-tight">
                Finalizar Assinatura
              </h1>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Plan selector */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-center text-muted-foreground mb-4">
            Selecione seu plano
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {(["monthly", "annual"] as PlanType[]).map((planKey) => (
              <button
                key={planKey}
                type="button"
                className={`cursor-pointer text-left transition-all duration-200 hover:shadow-navy select-none relative rounded-2xl bg-card w-full ${
                  plan === planKey
                    ? "border-4 border-accent shadow-md ring-2 ring-accent/30"
                    : "border-2 border-border hover:border-accent/50"
                }`}
                onClick={() => setPlan(planKey)}
              >
                {planKey === "annual" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 shadow border-0">
                      <Star className="w-3 h-3 mr-1 inline fill-current" />
                      −25%
                    </Badge>
                  </div>
                )}
                <div className={`p-4 ${planKey === "annual" ? "pt-6" : ""}`}>
                  <div className="flex items-start justify-between">
                    <span className="text-base font-display font-semibold text-primary">
                      {planKey === "monthly" ? "Mensal" : "Anual"}
                    </span>
                    {plan === planKey && (
                      <Badge className="bg-accent text-white text-xs border-0">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <div className="text-2xl font-display font-extrabold text-accent mt-1">
                    {planKey === "monthly" ? "R$ 9,90" : "R$ 89,00"}
                    <span className="text-sm text-muted-foreground font-normal">
                      {planKey === "monthly" ? "/mês" : "/ano"}
                    </span>
                  </div>
                  {planKey === "annual" && (
                    <p className="text-xs text-green-600 font-semibold">
                      Economia de R$ 29,80
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Checkout card */}
        <Card className="border-2 border-primary/15 shadow-navy-lg rounded-2xl">
          <CardHeader className="text-center space-y-3 border-b pb-6">
            <div className="w-14 h-14 mx-auto bg-accent rounded-2xl flex items-center justify-center shadow-lg">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-2xl font-display font-bold text-primary tracking-tight">
              {currentPlan.name}
            </CardTitle>
            <CardDescription className="text-base">
              {currentPlan.description}
            </CardDescription>
            <div className="pt-1">
              <div className="text-5xl font-display font-extrabold text-accent tracking-tight">
                {currentPlan.priceDisplay}
                <span className="text-xl text-muted-foreground font-normal">
                  {currentPlan.period}
                </span>
              </div>
              {"savings" in currentPlan && (
                <p className="text-sm text-green-600 font-semibold mt-1">
                  💰 {PLAN_CONFIG.annual.savings}
                </p>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-7 pb-8">
            <div>
              <h3 className="text-base font-display font-bold text-primary mb-3">
                O que você ganha:
              </h3>
              <ul className="space-y-2.5">
                {PREMIUM_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-primary/5 border-2 border-primary/15 rounded-xl p-4 flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm text-foreground/70">
                <strong>Pagamento 100% seguro</strong> processado pelo Stripe
              </p>
            </div>

            {/* Primary CTA — direct Stripe link */}
            <a
              href={STRIPE_LINKS[plan]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                type="button"
                className="w-full h-14 text-base font-bold bg-accent hover:bg-accent/90 text-white shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Assinar Agora — {currentPlan.priceDisplay}
                {currentPlan.period}
              </Button>
            </a>

            {/* Secondary CTA — session-based checkout */}
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground uppercase tracking-widest">
                  ou pague por checkout
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => void handleCheckoutWithSession()}
              disabled={isProcessing}
              className="w-full h-12 font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecionando para pagamento...
                </>
              ) : (
                <>
                  <Crown className="mr-2 h-4 w-4" />
                  Checkout via Stripe Session
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Ao continuar, você concorda com nossos Termos de Uso. Você será
              redirecionado para o checkout seguro do Stripe.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
