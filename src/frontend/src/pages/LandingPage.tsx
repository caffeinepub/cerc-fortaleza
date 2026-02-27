import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubmitLead } from "@/hooks/useQueries";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bell,
  Check,
  ChevronRight,
  Loader2,
  Lock,
  Search,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const YEAR = new Date().getFullYear();

function formatWhatsApp(value: string): string {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 7)
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}

export function LandingPage() {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const { mutate: submitLead, isPending } = useSubmitLead();

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhatsapp(formatWhatsApp(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Por favor, insira seu nome");
      return;
    }

    const numbersOnly = whatsapp.replace(/\D/g, "");
    if (numbersOnly.length < 10) {
      toast.error("Por favor, insira um WhatsApp válido com DDD");
      return;
    }

    submitLead(
      { name: name.trim(), whatsapp: numbersOnly },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setName("");
          setWhatsapp("");
          toast.success("Cadastro realizado! Redirecionando...");
          setTimeout(() => {
            navigate({ to: "/onboarding" });
          }, 2000);
        },
        onError: (error) => {
          console.error("Submission error:", error);
          toast.error("Erro ao enviar cadastro. Tente novamente.");
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Admin link */}
      <nav className="absolute top-0 right-0 z-50 p-4">
        <Link to="/login">
          <Button
            variant="ghost"
            size="sm"
            className="font-semibold text-primary-foreground hover:bg-white/10"
          >
            <Lock className="w-4 h-4 mr-2" />
            Área do Administrador
          </Button>
        </Link>
      </nav>

      {/* ── HERO ── */}
      <header className="relative overflow-hidden bg-secondary">
        {/* Diagonal grid background */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-primary/80" />

        <div className="relative z-10 container mx-auto px-4 pt-16 pb-16 md:pb-24">
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <img
              src="/assets/uploads/LOGO-BRANCO-1.png"
              alt="CERC FORTALEZA — Cadastro de Eletrônicos e Registros Ceará"
              className="w-full max-w-[280px] sm:max-w-sm md:max-w-md h-auto"
            />
          </div>

          <div className="max-w-4xl mx-auto text-center mb-10 md:mb-14">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white leading-tight mb-5 tracking-tight">
              Fortaleza mais segura:
              <br className="hidden sm:block" /> proteja seus bens antes que
              seja tarde
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Cadastre celulares, bikes e notebooks. Consulte procedência antes
              de comprar. Reporte roubos instantaneamente.
            </p>
          </div>
        </div>

        {/* Diagonal cut */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-background"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
        />
      </header>

      {/* ── REGISTRATION FORM ── */}
      <main className="flex-1 container mx-auto px-4 -mt-8 md:-mt-12 pb-16 relative z-20">
        <Card
          id="cadastro"
          className="max-w-xl mx-auto shadow-navy-lg border-0 rounded-2xl"
        >
          <CardHeader className="text-center space-y-2 pb-4 pt-8">
            <CardTitle className="text-2xl md:text-3xl font-display font-bold text-primary tracking-tight">
              {showSuccess ? "Cadastro Recebido!" : "Cadastre-se Gratuitamente"}
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              {showSuccess
                ? "Você deu o primeiro passo para proteger seus bens. Redirecionando..."
                : "Preencha abaixo e comece a proteger seus bens agora mesmo"}
            </CardDescription>
            {!showSuccess && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-1">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="font-semibold">
                  +247 cadastros esta semana
                </span>
              </div>
            )}
          </CardHeader>

          <CardContent className="pb-8">
            {showSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center shadow-navy">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <p className="text-foreground/70 text-base">
                  Obrigado por confiar no CERC FORTALEZA!
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Redirecionando em instantes...</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold uppercase tracking-wide text-foreground/70"
                  >
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Digite seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isPending}
                    required
                    className="h-12 text-base border-2 focus-visible:ring-primary focus-visible:border-primary"
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="whatsapp"
                    className="text-sm font-semibold uppercase tracking-wide text-foreground/70"
                  >
                    WhatsApp (com DDD)
                  </Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="(85) 98765-4321"
                    value={whatsapp}
                    onChange={handleWhatsAppChange}
                    disabled={isPending}
                    required
                    className="h-12 text-base border-2 focus-visible:ring-primary focus-visible:border-primary"
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </div>

                <div className="pt-2 space-y-3">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-14 text-base font-bold uppercase tracking-wide bg-accent hover:bg-accent/90 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01] disabled:opacity-50"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Quero Proteger Meus Bens
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                  <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Lock className="w-3.5 h-3.5" />
                    Seus dados estão 100% seguros e protegidos
                  </p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* ── PROMOTIONAL BANNER ── */}
        <section
          aria-label="Por que o CERC FORTALEZA importa"
          className="mt-12 md:mt-16 max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-navy-lg"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.18 0.04 240) 0%, oklch(0.22 0.06 235) 50%, oklch(0.16 0.05 250) 100%)",
          }}
        >
          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
              backgroundSize: "128px 128px",
            }}
          />

          <div className="relative z-10 px-6 py-10 md:px-12 md:py-14">
            {/* Badge */}
            <div className="flex justify-center mb-5">
              <span className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 text-accent text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5" />
                Por que o CERC FORTALEZA importa?
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-white text-center leading-tight mb-3 tracking-tight">
              Fortaleza registra mais de{" "}
              <span className="text-accent">40 roubos de celulares</span> por
              dia
            </h2>
            <p className="text-white/65 text-center text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
              Cada cadastro previne que o crime compense. Cada consulta protege
              quem compra usado.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                {
                  icon: Shield,
                  value: "2.847 objetos",
                  label: "Cadastrados este mês",
                  iconColor: "text-blue-300",
                  iconBg: "bg-blue-500/20",
                },
                {
                  icon: Search,
                  value: "1.203 consultas",
                  label: "De procedência realizadas",
                  iconColor: "text-green-300",
                  iconBg: "bg-green-500/20",
                },
                {
                  icon: AlertTriangle,
                  value: "68% dos roubos",
                  label: "Nunca são recuperados sem registro",
                  iconColor: "text-accent",
                  iconBg: "bg-accent/20",
                },
                {
                  icon: Users,
                  value: "+5.000 cidadãos",
                  label: "Já fazem parte da rede",
                  iconColor: "text-purple-300",
                  iconBg: "bg-purple-500/20",
                },
              ].map(({ icon: Icon, value, label, iconColor, iconBg }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div
                    className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <p className="text-white font-display font-extrabold text-base sm:text-lg leading-tight">
                    {value}
                  </p>
                  <p className="text-white/50 text-xs leading-snug">{label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex justify-center">
              <a href="#cadastro">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                >
                  <Shield className="w-5 h-5" />
                  Cadastre-se Agora — É Grátis
                  <ChevronRight className="w-4 h-4" />
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section className="mt-20 md:mt-28 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary border-0 text-sm font-semibold px-4 py-1.5 mb-4">
              Como funciona
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-primary tracking-tight">
              Proteção em 3 camadas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Cofre Digital",
                description:
                  "Cadastre seus bens com IMEI, chassi ou serial. Tenha um registro digital imutável e seguro.",
                color: "bg-primary",
                hoverBorder: "hover:border-primary/40",
              },
              {
                icon: Bell,
                title: "Alerta Real",
                description:
                  "Notificações instantâneas sobre qualquer movimentação suspeita dos seus bens cadastrados.",
                color: "bg-accent",
                hoverBorder: "hover:border-accent/40",
              },
              {
                icon: Search,
                title: "Match de Recuperação",
                description:
                  "Cruzamos dados com itens encontrados em delegacias e pela comunidade para devolver o que é seu.",
                color: "bg-primary",
                hoverBorder: "hover:border-primary/40",
              },
            ].map(({ icon: Icon, title, description, color, hoverBorder }) => (
              <div
                key={title}
                className={`flex flex-col items-center text-center space-y-4 p-7 md:p-8 rounded-2xl bg-card border-2 border-border transition-all duration-300 ${hoverBorder} hover:shadow-navy`}
              >
                <div
                  className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center shadow-md`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold text-primary tracking-tight">
                  {title}
                </h3>
                <p className="text-foreground/70 leading-relaxed text-sm">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PLANS SECTION ── */}
        <section className="mt-24 md:mt-32 max-w-6xl mx-auto">
          {/* Banner */}
          <div className="relative rounded-3xl overflow-hidden mb-12 shadow-navy-lg">
            {/* Background images */}
            <div className="absolute inset-0">
              <img
                src="/assets/uploads/Gemini_Generated_Image_yf9yfeyf9yfeyf9y-1.png"
                alt=""
                aria-hidden
                className="absolute left-0 top-0 w-1/3 h-full object-cover opacity-40"
              />
              <img
                src="/assets/uploads/BANNER-2.png"
                alt=""
                aria-hidden
                className="absolute right-0 top-0 w-1/3 h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/95" />
            </div>

            <div className="relative z-10 px-8 py-14 md:px-16 md:py-20 text-center">
              <Badge className="bg-accent text-white border-0 text-sm font-bold px-4 py-1.5 mb-5 gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Escolha seu nível de proteção
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white leading-tight mb-4 tracking-tight">
                Do básico ao Premium:
                <br className="hidden md:block" /> proteja quem você ama
              </h2>
              <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto">
                Temos o plano ideal para cada perfil — do cidadão comum ao
                profissional que depende dos seus equipamentos.
              </p>
            </div>
          </div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Gratuito */}
            <Card className="border-2 border-border hover:border-primary/40 transition-all duration-300 hover:shadow-navy rounded-2xl">
              <CardHeader className="space-y-3 pb-4">
                <Badge
                  variant="outline"
                  className="w-fit border-primary/40 text-primary font-bold"
                >
                  Gratuito
                </Badge>
                <CardTitle className="text-3xl font-display font-extrabold text-primary tracking-tight">
                  O Essencial
                </CardTitle>
                <div className="text-4xl font-display font-extrabold text-foreground">
                  R$ 0
                  <span className="text-lg font-normal text-muted-foreground">
                    /mês
                  </span>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  Perfeito para o cidadão que quer proteger seus principais bens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <ul className="space-y-3">
                  {[
                    "Cadastro de até 2 objetos (1 celular e 1 bike)",
                    "Consultas ilimitadas de procedência",
                    "Alerta de roubo básico no sistema",
                    "Suporte via FAQ e comunidade",
                  ].map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-foreground/80">{feat}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="w-full h-12 font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
                  onClick={() => navigate({ to: "/login" })}
                >
                  Começar Grátis
                </Button>
              </CardContent>
            </Card>

            {/* Premium */}
            <Card className="relative border-4 border-accent hover:border-accent/80 transition-all duration-300 hover:shadow-navy-lg rounded-2xl bg-gradient-to-br from-card to-accent/5">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                <Badge className="bg-accent text-white text-sm font-bold px-4 py-1.5 shadow-lg gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Mais Popular
                </Badge>
              </div>

              <CardHeader className="space-y-3 pb-4 pt-8">
                <Badge
                  variant="outline"
                  className="w-fit border-accent/40 text-accent font-bold"
                >
                  Premium
                </Badge>
                <CardTitle className="text-3xl font-display font-extrabold text-primary tracking-tight">
                  Proteção Ativa
                </CardTitle>
                <div>
                  <div className="text-4xl font-display font-extrabold text-accent">
                    R$ 9,90
                    <span className="text-lg font-normal text-muted-foreground">
                      /mês
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    ou <strong className="text-accent">R$ 89,00/ano</strong> —
                    economize ~25%
                  </p>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  Para quem tem bens de valor ou trabalha com o objeto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <ul className="space-y-3">
                  {[
                    "Cadastro de até 10 objetos (família toda)",
                    "Histórico de propriedade com validade jurídica",
                    "Notificação de proximidade em raio de 50km",
                    "Transferência de posse para venda segura",
                    "Suporte prioritário",
                  ].map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                      <span className="text-foreground/80">{feat}</span>
                    </li>
                  ))}
                </ul>
                <div className="space-y-2.5 pt-1">
                  <Button
                    className="w-full h-14 text-base font-bold bg-accent hover:bg-accent/90 text-white shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl"
                    onClick={() => navigate({ to: "/planos" })}
                  >
                    Assinar Mensal — R$ 9,90/mês
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-11 font-bold border-2 border-accent text-accent hover:bg-accent hover:text-white transition-all"
                    onClick={() => navigate({ to: "/planos" })}
                  >
                    Assinar Anual — R$ 89,00/ano
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-secondary mt-24 border-t border-white/10">
        <div className="container mx-auto px-4 py-12 md:py-14">
          <div className="text-center mb-8">
            <img
              src="/assets/uploads/LOGO-BRANCO-1.png"
              alt="CERC FORTALEZA"
              className="h-12 w-auto mx-auto mb-4 opacity-90"
            />
            <p className="text-white/70 text-base max-w-md mx-auto leading-relaxed">
              Juntos por uma Fortaleza mais segura. Quem cadastra, não perde.
              Quem consulta, não financia o crime.
            </p>
          </div>

          <div className="pt-8 border-t border-white/10 text-center space-y-2">
            <p className="text-sm text-white/40">
              © {YEAR} CERC FORTALEZA — Cadastro de Eletrônicos e Registros
              Ceará. Todos os direitos reservados.
            </p>
            <Link
              to="/privacidade"
              className="text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              Política de Privacidade e Proteção de Dados
            </Link>
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
        </div>
      </footer>
    </div>
  );
}
