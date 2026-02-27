import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowLeftRight,
  Bell,
  Check,
  CheckCircle,
  Copy,
  FileText,
  Headphones,
  Search,
  Shield,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PIX_KEY = "proj.defdriver+pagbank@gmail.com";
const STRIPE_MONTHLY = "https://buy.stripe.com/aFa3cngTd6a12K8bTY4Ni01";
const STRIPE_ANNUAL = "https://buy.stripe.com/7sY3cn6ezaqhacAbTY4Ni00";

function PixPaymentBlock({ price }: { price: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(PIX_KEY).then(() => {
      setCopied(true);
      toast.success("Chave PIX copiada!");
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="mt-6">
      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-white/20" />
        <span className="text-white/50 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
          ou pague via Pix
        </span>
        <div className="flex-1 h-px bg-white/20" />
      </div>

      {/* Pix block */}
      <div className="bg-white rounded-2xl p-5 flex flex-col items-center gap-3">
        <p className="text-slate-800 font-bold text-sm uppercase tracking-wide">
          Pagar via PIX
        </p>
        <img
          src="/assets/uploads/pix-QR-CODE-1.jpeg"
          alt="QR Code Pix CERC Fortaleza"
          width={180}
          height={180}
          className="rounded-xl object-contain border border-slate-100"
          style={{ width: 180, height: 180 }}
        />
        <p className="text-slate-600 font-semibold text-sm">{price}</p>
        <div className="w-full">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1.5 text-center">
            Chave Pix (e-mail)
          </p>
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200">
            <span className="flex-1 font-mono text-xs text-slate-700 truncate select-all">
              {PIX_KEY}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copiar chave Pix"
              className="shrink-0 p-1.5 rounded-lg transition-colors hover:bg-slate-200 active:scale-95"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-400 text-center leading-relaxed">
          Escaneie o QR code ou copie a chave e envie o comprovante para
          ativação.
        </p>
      </div>
    </div>
  );
}

type BillingPeriod = "monthly" | "annual";

const FREE_FEATURES = [
  {
    icon: Shield,
    label: "Cadastro de até 2 objetos",
    detail: "1 celular e 1 bike",
  },
  {
    icon: Search,
    label: "Consultas ilimitadas",
    detail: "Evite comprar objetos roubados",
  },
  {
    icon: Bell,
    label: "Alerta de roubo básico",
    detail: "Ativação no sistema",
  },
  { icon: Users, label: "Suporte via FAQ", detail: "e comunidade" },
];

const PREMIUM_FEATURES = [
  {
    icon: Users,
    label: "Cadastro de até 10 objetos",
    detail: "Proteja a família toda",
  },
  {
    icon: FileText,
    label: "Histórico de propriedade",
    detail: "Certificado digital com validade jurídica",
  },
  {
    icon: Bell,
    label: "Notificação de proximidade",
    detail: "Alerta em raio de 50km",
  },
  {
    icon: ArrowLeftRight,
    label: "Transferência de posse",
    detail: "Venda segura sem golpes",
  },
  {
    icon: Headphones,
    label: "Suporte prioritário",
    detail: "Atendimento preferencial",
  },
];

export function PlanosPage() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState<BillingPeriod>("monthly");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-secondary text-white sticky top-0 z-50 shadow-navy">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/" })}
              className="text-white hover:bg-white/10 gap-2 shrink-0"
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
            <div className="w-16 sm:w-20 shrink-0" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero section */}
        <section className="bg-gradient-to-b from-slate-50 to-background pb-10 md:pb-16 pt-8 md:pt-12 border-b border-border">
          <div className="container mx-auto px-4 text-center space-y-5">
            <Badge className="bg-accent/10 text-accent border-0 text-sm font-bold px-4 py-1.5 gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Escolha seu nível de proteção
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold leading-tight tracking-tight text-foreground">
              Proteja seus bens com o plano ideal
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Do essencial ao avançado — tenha controle total sobre o que é seu.
              Fortaleza mais segura começa com uma decisão.
            </p>

            {/* Billing toggle */}
            <div className="flex items-center justify-center pt-3">
              <div className="inline-flex bg-muted rounded-full p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setBilling("monthly")}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                    billing === "monthly"
                      ? "bg-white text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Mensal
                </button>
                <button
                  type="button"
                  onClick={() => setBilling("annual")}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                    billing === "annual"
                      ? "bg-white text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Anual
                  {billing !== "annual" && (
                    <span className="text-xs bg-accent text-white px-1.5 py-0.5 rounded-full font-bold">
                      −25%
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Free plan */}
            <div className="relative bg-card border-2 border-border rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:border-primary/30 hover:shadow-navy">
              <div className="p-7 md:p-8 flex flex-col flex-1">
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                    Plano
                  </span>
                  <h2 className="text-2xl md:text-3xl font-display font-extrabold text-primary tracking-tight">
                    Gratuito
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    O Essencial — para começar com segurança
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-display font-extrabold text-foreground tracking-tight">
                      R$ 0
                    </span>
                    <span className="text-muted-foreground mb-2">
                      /{billing === "monthly" ? "mês" : "ano"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sempre gratuito, sem cartão de crédito
                  </p>
                </div>

                <ul className="space-y-3 flex-1">
                  {FREE_FEATURES.map(({ icon: Icon, label, detail }) => (
                    <li key={label} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div>
                        <span className="text-foreground font-semibold text-sm">
                          {label}
                        </span>
                        {detail && (
                          <span className="text-muted-foreground text-sm">
                            {" "}
                            — {detail}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
                    onClick={() => navigate({ to: "/login" })}
                  >
                    Começar Grátis
                  </Button>
                </div>
              </div>
            </div>

            {/* Premium plan */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-4 border-accent rounded-2xl overflow-hidden flex flex-col shadow-navy-lg transition-all duration-300 hover:scale-[1.01]">
              {/* Most popular badge */}
              <div className="absolute top-0 left-0 right-0 flex justify-center">
                <div className="bg-accent text-white text-xs font-bold px-6 py-1.5 rounded-b-xl shadow-lg flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  Mais Popular
                </div>
              </div>

              <div className="p-7 md:p-8 flex flex-col flex-1 pt-10">
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-accent/80 mb-2 block">
                    Plano
                  </span>
                  <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white tracking-tight">
                    Premium
                  </h2>
                  <p className="text-white/70 text-sm mt-1">
                    Proteção Ativa — para quem leva segurança a sério
                  </p>
                </div>

                <div className="mb-8">
                  {billing === "monthly" ? (
                    <div>
                      <div className="flex items-end gap-1">
                        <span className="text-5xl font-display font-extrabold text-accent tracking-tight">
                          R$ 9,90
                        </span>
                        <span className="text-white/70 mb-2">/mês</span>
                      </div>
                      <p className="text-xs text-white/50 mt-1">
                        ou R$ 89,00/ano — economize ~25%
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-end gap-2">
                        <span className="text-5xl font-display font-extrabold text-accent tracking-tight">
                          R$ 89,00
                        </span>
                        <span className="text-white/70 mb-2">/ano</span>
                        <Badge className="bg-accent text-white text-xs font-bold mb-2">
                          −25%
                        </Badge>
                      </div>
                      <p className="text-xs text-white/50 mt-1">
                        Equivale a R$ 7,42/mês — Economia de R$ 29,80
                      </p>
                    </div>
                  )}
                </div>

                <ul className="space-y-3 flex-1">
                  {PREMIUM_FEATURES.map(({ label, detail }) => (
                    <li key={label} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-accent" />
                      </div>
                      <div>
                        <span className="text-white font-semibold text-sm">
                          {label}
                        </span>
                        {detail && (
                          <span className="text-white/60 text-sm">
                            {" "}
                            — {detail}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-8">
                  <a
                    href={
                      billing === "monthly" ? STRIPE_MONTHLY : STRIPE_ANNUAL
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      type="button"
                      className="w-full h-14 text-base font-bold bg-accent hover:bg-accent/90 text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      {billing === "monthly"
                        ? "Assinar Mensal — R$ 9,90/mês"
                        : "Assinar Anual — R$ 89,00/ano"}
                    </Button>
                  </a>
                  <p className="text-xs text-center text-white/40 mt-2">
                    Pagamento seguro via Stripe · Cancele a qualquer momento
                  </p>

                  {/* PIX */}
                  <PixPaymentBlock
                    price={
                      billing === "monthly" ? "R$ 9,90 / mês" : "R$ 89,00 / ano"
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee */}
          <div className="max-w-4xl mx-auto mt-10 md:mt-12">
            <div className="bg-card border-2 border-border rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-primary mb-1">
                  Proteção garantida para Fortaleza
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  O CERC FORTALEZA usa tecnologia blockchain ICP para garantir
                  que seus registros sejam imutáveis e seguros. Cada cadastro é
                  verificado e protegido contra adulterações — para sempre.
                </p>
              </div>
            </div>
          </div>

          {/* Back link */}
          <div className="text-center mt-8">
            <Link to="/">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para a página inicial
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-white/10">
        <div className="container mx-auto px-4 py-8 text-center space-y-1.5">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} CERC FORTALEZA — Cadastro de
            Eletrônicos e Registros Ceará.
          </p>
          <p className="text-sm text-white/30">
            Construído com{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white/80 transition-colors font-semibold"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
