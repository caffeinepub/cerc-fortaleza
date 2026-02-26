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
  Copy,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PIX_KEY = "proj.defdriver+pagbank@gmail.com";

function PixPaymentBlock({ price }: { price: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(PIX_KEY).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="mt-6">
      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-white/20" />
        <span className="text-white/60 text-xs font-semibold uppercase tracking-widest whitespace-nowrap">
          ou pague via Pix
        </span>
        <div className="flex-1 h-px bg-white/20" />
      </div>

      {/* Pix Container */}
      <div className="bg-white rounded-2xl p-5 flex flex-col items-center gap-3 shadow-inner">
        {/* QR Code */}
        <img
          src="/assets/uploads/pix-QR-CODE-1.jpeg"
          alt="QR Code Pix CERC Fortaleza"
          width={160}
          height={160}
          className="rounded-xl object-contain"
        />

        {/* Price label */}
        <p className="text-slate-700 font-bold text-base tracking-tight">
          {price}
        </p>

        {/* Pix key copy */}
        <div className="w-full">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1 text-center">
            Chave Pix (e-mail)
          </p>
          <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 border border-slate-200">
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
          {copied && (
            <p className="text-center text-xs text-green-600 font-semibold mt-1.5 animate-fade-in">
              ✓ Chave copiada!
            </p>
          )}
        </div>

        <p className="text-xs text-slate-400 text-center leading-relaxed">
          Escaneie o QR code ou copie a chave Pix acima e envie o comprovante para ativação.
        </p>
      </div>
    </div>
  );
}

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
      <header className="bg-[#1a1a2e] text-white sticky top-0 z-50 shadow-lg">
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
            {/* Spacer for centering logo */}
            <div className="w-16 sm:w-20 shrink-0" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-slate-100 text-slate-800 pb-12 md:pb-20 pt-8 md:pt-12 border-b border-slate-200">
          <div className="container mx-auto px-4 text-center space-y-4">
            <div className="flex justify-center">
              <Badge className="bg-accent text-accent-foreground text-sm px-4 py-1.5 font-bold gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Escolha seu nível de proteção
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold leading-tight tracking-tight text-slate-900">
              Proteja seus bens com o plano ideal
            </h1>
            <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Do essencial ao avançado — tenha controle total sobre o que é seu.
              Fortaleza mais segura começa com uma decisão.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center pt-4">
              <div className="inline-flex bg-slate-200 rounded-full p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setBilling("monthly")}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                    billing === "monthly"
                      ? "bg-white text-slate-900 shadow-md"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Mensal
                </button>
                <button
                  type="button"
                  onClick={() => setBilling("annual")}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                    billing === "annual"
                      ? "bg-white text-slate-900 shadow-md"
                      : "text-slate-500 hover:text-slate-700"
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
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-4 border-accent rounded-2xl overflow-hidden flex flex-col shadow-2xl transition-all duration-300 hover:shadow-accent/20 hover:scale-[1.01]">
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
                  <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white tracking-tight">
                    Premium
                  </h2>
                  <p className="text-white/75 text-sm mt-1">
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
                        <span className="text-white/75 mb-2 text-base">/mês</span>
                      </div>
                      <p className="text-xs text-white/65 mt-1">
                        ou R$ 89,00/ano economizando ~25%
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-end gap-2">
                        <span className="text-5xl font-display font-extrabold text-accent tracking-tight">
                          R$ 89,00
                        </span>
                        <span className="text-white/75 mb-2 text-base">/ano</span>
                        <Badge className="bg-accent text-accent-foreground text-xs font-bold mb-2">
                          -25%
                        </Badge>
                      </div>
                      <p className="text-xs text-white/65 mt-1">
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
                        <span className="text-white font-semibold text-sm">{label}</span>
                        {detail && (
                          <span className="text-white/65 text-sm"> — {detail}</span>
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
                  <p className="text-xs text-center text-white/50 mt-3">
                    Pagamento seguro via Stripe · Cancele a qualquer momento
                  </p>
                </div>

                {/* Pix Payment Block */}
                <PixPaymentBlock
                  price={billing === "monthly" ? "R$ 9,90 / mês" : "R$ 89,00 / ano"}
                />
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
