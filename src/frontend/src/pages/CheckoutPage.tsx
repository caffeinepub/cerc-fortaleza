import { useState, useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Crown, Check, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCreateCheckoutSession } from "@/hooks/useQueries";
import type { ShoppingItem } from "@/backend.d";

type PlanType = "monthly" | "annual";

const PLAN_CONFIG = {
  monthly: {
    name: "Premium Mensal",
    price: 990, // R$ 9,90 em centavos
    priceDisplay: "R$ 9,90",
    period: "/mês",
    description: "Proteção ativa com renovação mensal",
    productName: "CERC Fortaleza - Plano Premium Mensal",
  },
  annual: {
    name: "Premium Anual",
    price: 8900, // R$ 89,00 em centavos
    priceDisplay: "R$ 89,00",
    period: "/ano",
    description: "Economize ~25% com o plano anual",
    productName: "CERC Fortaleza - Plano Premium Anual",
    savings: "Economia de R$ 29,80",
  },
};

const PREMIUM_FEATURES = [
  "Cadastro de até 10 objetos (família toda)",
  "Histórico de Propriedade com certificado digital",
  "Notificação de Proximidade (raio de 50km)",
  "Transferência de Posse para venda segura",
  "Suporte Prioritário",
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/checkout" });
  const [plan, setPlan] = useState<PlanType>("monthly");
  const [isProcessing, setIsProcessing] = useState(false);

  const { mutateAsync: createCheckoutSession } = useCreateCheckoutSession();

  useEffect(() => {
    // Read plan from query params
    const urlPlan = (search as { plan?: string })?.plan;
    if (urlPlan === "monthly" || urlPlan === "annual") {
      setPlan(urlPlan);
    }
  }, [search]);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const planConfig = PLAN_CONFIG[plan];
      const shoppingItems: ShoppingItem[] = [
        {
          productName: planConfig.productName,
          productDescription: planConfig.description,
          priceInCents: BigInt(planConfig.price),
          currency: "BRL",
          quantity: BigInt(1),
        },
      ];

      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`;
      const cancelUrl = `${baseUrl}/checkout?plan=${plan}`;

      const session = await createCheckoutSession({ items: shoppingItems, successUrl, cancelUrl });

      if (!session?.url) {
        throw new Error("Stripe session missing url");
      }

      // Redirect to Stripe checkout
      window.location.href = session.url;
    } catch (error) {
      console.error("Checkout error:", error);
      
      // Check if error is related to Stripe configuration
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("not configured") || errorMessage.includes("Stripe")) {
        toast.error("Sistema de pagamento não configurado. Entre em contato com o suporte.");
      } else {
        toast.error("Erro ao processar pagamento. Tente novamente.");
      }
      setIsProcessing(false);
    }
  };

  const currentPlan = PLAN_CONFIG[plan];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/" })}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-center tracking-tight">
                Finalizar Assinatura
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Plan Selection */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${
              plan === "monthly" ? "border-4 border-accent" : "border-2 border-border"
            }`}
            onClick={() => setPlan("monthly")}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl font-display text-primary">
                    Plano Mensal
                  </CardTitle>
                  <CardDescription>Renovação automática</CardDescription>
                </div>
                {plan === "monthly" && (
                  <Badge className="bg-accent text-accent-foreground">
                    Selecionado
                  </Badge>
                )}
              </div>
              <div className="mt-4">
                <div className="text-4xl font-display font-extrabold text-accent">
                  R$ 9,90
                  <span className="text-xl text-foreground/60 font-normal">/mês</span>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${
              plan === "annual" ? "border-4 border-accent" : "border-2 border-border"
            }`}
            onClick={() => setPlan("annual")}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl font-display text-primary">
                    Plano Anual
                  </CardTitle>
                  <CardDescription>Economize ~25%</CardDescription>
                </div>
                {plan === "annual" && (
                  <Badge className="bg-accent text-accent-foreground">
                    Selecionado
                  </Badge>
                )}
              </div>
              <div className="mt-4">
                <div className="text-4xl font-display font-extrabold text-accent">
                  R$ 89,00
                  <span className="text-xl text-foreground/60 font-normal">/ano</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 font-semibold mt-1">
                  💰 Economia de R$ 29,80
                </p>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Checkout Card */}
        <Card className="border-2 border-primary/20 shadow-2xl">
          <CardHeader className="text-center space-y-3 border-b">
            <div className="w-16 h-16 mx-auto bg-accent rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-accent-foreground" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-display font-bold text-primary tracking-tight">
              {currentPlan.name}
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              {currentPlan.description}
            </CardDescription>
            <div className="pt-4">
              <div className="text-5xl md:text-6xl font-display font-extrabold text-accent tracking-tight">
                {currentPlan.priceDisplay}
                <span className="text-2xl text-foreground/60 font-normal">{currentPlan.period}</span>
              </div>
              {plan === "annual" && (
                <p className="text-sm text-green-600 dark:text-green-400 font-semibold mt-2">
                  {PLAN_CONFIG.annual.savings}
                </p>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-8 pb-8">
            {/* Features */}
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

            {/* Payment Info */}
            <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4">
              <p className="text-sm text-foreground/80 text-center">
                🔒 <strong>Pagamento 100% seguro</strong> processado pela Stripe
              </p>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full h-14 text-base md:text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Crown className="mr-2 h-5 w-5" />
                  Assinar Agora
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
