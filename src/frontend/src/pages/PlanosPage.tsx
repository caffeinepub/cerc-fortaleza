import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Sparkles,
  Shield,
  FileText,
  Bell,
  ArrowLeftRight,
  Headphones,
  Search,
  Users,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type BillingPeriod = "monthly" | "annual";

const FREE_FEATURES = [
  { icon: Shield, label: "Cadastro de até 2 objetos", detail: "1 celular e 1 bike" },
  { icon: Search, label: "Consultas ilimitadas", detail: "Evite comprar objetos roubados" },
  { icon: Bell, label: "Alerta de Roubo básico", detail: "Ativação no sistema" },
  { icon: Users, label: "Suporte via FAQ", detail: "e comunidade" },
];

const PREMIUM_FEATURES = [
  { icon: Users, label: "Cadastro de até 10 objetos", detail: "Proteja a família toda" },
  { icon: FileText, label: "Histórico de Propriedade", detail: "Certificado digital com validade jurídica" },
  { icon: Bell, label: "Notificação de Proximidade", detail: "Alerta em raio de 50km" },
  { icon: ArrowLeftRight, label: "Transferência de Posse", detail: "Venda segura sem golpes" },
  { icon: Headphones, label: "Suporte Prioritário", detail: "Atendimento preferencial" },
];

export function PlanosPage() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState<BillingPeriod>("monthly");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/" })}
              className="text-primary-foreground hover:bg-primary-foreground/10 gap-2 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
            <div className="flex-1 flex justify-center">
              <img
                src="/assets/uploads/LOGO-BRANCO-1.png"
                alt="CERC FORTALEZA"
                className="h-10 md:h-12 w-auto object-contain"
              />
            </div>
            {/* Spacer for centering logo */}
            <div className="w-16 sm:w-20 shrink-0" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground pb-12 md:pb-20 pt-8 md:pt-12">
          <div className="container mx-auto px-4 text-center space-y-4">
            <div className="flex justify-center">
              <Badge className="bg-accent text-accent-foreground text-sm px-4 py-1.5 font-bold gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Escolha sua proteção
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold leading-tight tracking-tight">
              Proteja seus bens com o plano ideal
            </h1>
            <p className="text-primary-foreground/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Do essencial ao avançado — tenha controle total sobre o que é seu.
              Fortaleza mais segura começa com uma decisão.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center pt-4">
              <div className="inline-flex bg-primary-foreground/10 rounded-full p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setBilling("monthly")}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                    billing === "monthly"
                      ? "bg-primary-foreground text-primary shadow-md"
                      : "text-primary-foreground/70 hover:text-primary-foreground"
                  }`}
                >
                  Mensal
                </button>
                <button
                  type="button"
                  onClick={() => setBilling("annual")}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                    billing === "annual"
                      ? "bg-primary-foreground text-primary shadow-md"
                      : "text-primary-foreground/70 hover:text-primary-foreground"
                  }`}
                >
                  Anual
                  {billing !== "annual" && (
                    <span className="text-xs bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full font-bold">
                      -25%
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section className="container mx-auto px-4 -mt-6 pb-16 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">

            {/* Free Plan Card */}
            <div className="relative bg-card border-2 border-border rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:border-primary/40 hover:shadow-xl">
              <div className="p-6 md:p-8 flex flex-col flex-1">
                {/* Plan label */}
                <div className="mb-6">
                  <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">
                    Plano
                  </span>
                  <h2 className="text-2xl md:text-3xl font-display font-extrabold text-primary tracking-tight">
                    Gratuito
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    O Essencial — para começar com segurança
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-display font-extrabold text-foreground tracking-tight">
                      R$ 0
                    </span>
                    <span className="text-muted-foreground mb-2 text-base">
                      /{billing === "monthly" ? "mês" : "ano"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sempre gratuito, sem cartão de crédito
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 flex-1">
                  {FREE_FEATURES.map(({ icon: Icon, label, detail }) => (
                    <li key={label} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div>
                        <span className="text-foreground font-semibold text-sm">{label}</span>
                        {detail && (
                          <span className="text-muted-foreground text-sm"> — {detail}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 text-base font-bold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    onClick={() => navigate({ to: "/login" })}
                  >
                    Começar Grátis
                  </Button>
                </div>
              </div>
            </div>

            {/* Premium Plan Card */}
            <div className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 border-4 border-accent rounded-2xl overflow-hidden flex flex-col shadow-2xl transition-all duration-300 hover:shadow-accent/20 hover:scale-[1.01]">
              {/* Most Popular Badge */}
              <div className="absolute top-0 left-0 right-0 flex justify-center">
                <div className="bg-accent text-accent-foreground text-xs font-bold px-6 py-1.5 rounded-b-xl shadow-lg flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  Mais Popular
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col flex-1 pt-10 md:pt-10">
                {/* Plan label */}
                <div className="mb-6">
                  <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent/80 mb-2">
                    Plano
                  </span>
                  <h2 className="text-2xl md:text-3xl font-display font-extrabold text-primary-foreground tracking-tight">
                    Premium
                  </h2>
                  <p className="text-primary-foreground/70 text-sm mt-1">
                    Proteção Ativa — para quem leva segurança a sério
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  {billing === "monthly" ? (
                    <div>
                      <div className="flex items-end gap-1">
                        <span className="text-5xl font-display font-extrabold text-accent tracking-tight">
                          R$ 9,90
                        </span>
                        <span className="text-primary-foreground/70 mb-2 text-base">/mês</span>
                      </div>
                      <p className="text-xs text-primary-foreground/60 mt-1">
                        ou R$ 89,00/ano economizando ~25%
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-end gap-2">
                        <span className="text-5xl font-display font-extrabold text-accent tracking-tight">
                          R$ 89,00
                        </span>
                        <span className="text-primary-foreground/70 mb-2 text-base">/ano</span>
                        <Badge className="bg-accent text-accent-foreground text-xs font-bold mb-2">
                          -25%
                        </Badge>
                      </div>
                      <p className="text-xs text-primary-foreground/60 mt-1">
                        Equivale a R$ 7,42/mês — Economia de R$ 29,80
                      </p>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 flex-1">
                  {PREMIUM_FEATURES.map(({ icon: Icon, label, detail }) => (
                    <li key={label} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-accent" />
                      </div>
                      <div>
                        <span className="text-primary-foreground font-semibold text-sm">{label}</span>
                        {detail && (
                          <span className="text-primary-foreground/60 text-sm"> — {detail}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-8">
                  {billing === "monthly" ? (
                    <a
                      href="https://buy.stripe.com/aFa3cngTd6a12K8bTY4Ni01"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button
                        type="button"
                        className="w-full h-14 text-base font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        Assinar Mensal — R$ 9,90/mês
                      </Button>
                    </a>
                  ) : (
                    <a
                      href="https://buy.stripe.com/7sY3cn6ezaqhacAbTY4Ni00"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button
                        type="button"
                        className="w-full h-14 text-base font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        Assinar Anual — R$ 89,00/ano
                      </Button>
                    </a>
                  )}
                  <p className="text-xs text-center text-primary-foreground/50 mt-3">
                    Pagamento seguro via Stripe · Cancele a qualquer momento
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee section */}
          <div className="max-w-4xl mx-auto mt-10 md:mt-12">
            <div className="bg-card border-2 border-border rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-primary mb-1">
                  Proteção garantida para Fortaleza
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  O CERC FORTALEZA usa tecnologia blockchain para garantir que seus dados sejam imutáveis e seguros.
                  Cada registro é verificado e protegido contra adulterações.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 CERC FORTALEZA - Cadastro de Eletrônicos e Registros Ceará. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Built with love using{" "}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
