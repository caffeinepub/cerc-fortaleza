import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Shield, Bell, Search, Loader2, Lock, TrendingUp, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSubmitLead } from "@/hooks/useQueries";

export function LandingPage() {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const { mutate: submitLead, isPending } = useSubmitLead();

  const formatWhatsApp = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value);
    setWhatsapp(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Por favor, insira seu nome");
      return;
    }
    
    const numbersOnly = whatsapp.replace(/\D/g, "");
    if (numbersOnly.length < 10) {
      toast.error("Por favor, insira um WhatsApp válido");
      return;
    }

    submitLead(
      { name: name.trim(), whatsapp: numbersOnly },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setName("");
          setWhatsapp("");
          toast.success("Cadastro realizado com sucesso!");
          
          // Redirect to onboarding after 2 seconds
          setTimeout(() => {
            navigate({ to: "/onboarding" });
          }, 2000);
        },
        onError: (error) => {
          console.error("Submission error:", error);
          toast.error("Erro ao enviar cadastro. Tente novamente.");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation Header */}
      <nav className="absolute top-0 right-0 z-50 p-4">
        <Link to="/login">
          <Button
            variant="ghost"
            size="sm"
            className="font-semibold text-primary hover:text-primary/80 hover:bg-primary/10"
          >
            <Lock className="w-4 h-4 mr-2" />
            Área do Administrador
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-secondary overflow-hidden">
        {/* Background Map with Opacity */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('/assets/generated/fortaleza-map.dim_1600x900.png')" }}
        />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
          <div className="flex justify-center mb-10 md:mb-14">
            <img 
              src="/assets/uploads/LOGO-COM-NOME-1.png" 
              alt="CERC FORTALEZA - Cadastro de Eletrônicos e Registros Ceará"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto"
            />
          </div>

          <div className="max-w-5xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-primary leading-tight mb-6 tracking-tight">
              Fortaleza mais segura: Não deixe seu celular ou sua bike virarem estatística
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Proteja seus bens com tecnologia de ponta. Cadastre-se agora e tenha acesso imediato ao nosso sistema de proteção e recuperação.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 -mt-8 md:-mt-12 pb-12 relative z-20">
        {/* Conversion Form Card */}
        <Card className="max-w-xl mx-auto shadow-2xl border-2 border-primary/20">
          <CardHeader className="text-center space-y-3 pb-4">
            <CardTitle className="text-2xl md:text-3xl font-display font-bold text-primary tracking-tight">
              {showSuccess ? "Cadastro Realizado!" : "Cadastre-se Gratuitamente"}
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              {showSuccess 
                ? "Em breve entraremos em contato via WhatsApp com mais informações sobre como proteger seus bens."
                : "Preencha os dados abaixo e comece a proteger seus bens agora mesmo"
              }
            </CardDescription>
            {!showSuccess && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="font-medium">+247 cadastros esta semana</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {showSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-20 h-20 mx-auto bg-primary/15 rounded-full flex items-center justify-center ring-4 ring-primary/10">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
                <p className="text-foreground/70 text-lg">
                  Obrigado por confiar no CERC FORTALEZA!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-semibold">
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="text-base font-semibold">
                    WhatsApp
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
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-14 text-base md:text-lg font-bold uppercase tracking-wide transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-accent hover:bg-accent/90 shadow-lg"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Quero Proteger Meus Bens"
                    )}
                  </Button>
                  <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
                    <Lock className="w-4 h-4" />
                    <span>Seus dados estão 100% seguros e protegidos</span>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <section className="mt-16 md:mt-20 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-primary mb-10 md:mb-12 tracking-tight">
            Como Protegemos Você
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Benefit 1 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 md:p-8 rounded-xl bg-card border-2 border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center shadow-md">
                <Shield className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl md:text-2xl font-display font-bold text-primary tracking-tight">
                Cofre Digital
              </h3>
              <p className="text-foreground/80 leading-relaxed text-base">
                Seus dados protegidos com criptografia de ponta. Acesso seguro a qualquer momento.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 md:p-8 rounded-xl bg-card border-2 border-border hover:border-accent/30 transition-all duration-300 hover:shadow-lg">
              <div className="w-20 h-20 bg-accent rounded-xl flex items-center justify-center shadow-md">
                <Bell className="w-10 h-10 text-accent-foreground" />
              </div>
              <h3 className="text-xl md:text-2xl font-display font-bold text-primary tracking-tight">
                Alerta Real
              </h3>
              <p className="text-foreground/80 leading-relaxed text-base">
                Notificações instantâneas sobre qualquer movimentação suspeita dos seus bens.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 md:p-8 rounded-xl bg-card border-2 border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center shadow-md">
                <Search className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl md:text-2xl font-display font-bold text-primary tracking-tight">
                Match de Recuperação
              </h3>
              <p className="text-foreground/80 leading-relaxed text-base">
                Cruzamos dados com itens encontrados para devolver o que é seu.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mt-20 md:mt-28 max-w-7xl mx-auto">
          {/* Hero Banner */}
          <div className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/80 rounded-2xl overflow-hidden mb-12 md:mb-16 shadow-2xl">
            {/* Background Decorative Images */}
            <div className="absolute inset-0 opacity-20">
              <img
                src="/assets/uploads/Gemini_Generated_Image_yf9yfeyf9yfeyf9y-1.png"
                alt=""
                className="absolute left-0 top-0 w-1/3 h-full object-cover"
              />
              <img
                src="/assets/uploads/BANNER-2.png"
                alt=""
                className="absolute right-0 top-0 w-1/3 h-full object-cover"
              />
            </div>

            {/* Banner Content */}
            <div className="relative z-10 px-6 py-12 md:px-12 md:py-16 text-center">
              <div className="flex justify-center mb-4">
                <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-accent animate-pulse" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-primary-foreground leading-tight mb-4 md:mb-6 tracking-tight">
                Escolha Seu Nível de Proteção
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
                Do básico ao premium: proteja seus bens com a tecnologia que atende suas necessidades. 
                Seja para uso pessoal ou familiar, temos o plano ideal para você.
              </p>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
            {/* Plano Gratuito */}
            <Card className="relative border-2 border-primary hover:border-primary/60 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] bg-card">
              <CardHeader className="text-center space-y-3 pb-6">
                <Badge variant="outline" className="w-fit mx-auto text-base font-bold border-primary text-primary">
                  Gratuito
                </Badge>
                <CardTitle className="text-3xl md:text-4xl font-display font-extrabold text-primary tracking-tight">
                  O Essencial
                </CardTitle>
                <CardDescription className="text-base md:text-lg leading-relaxed">
                  Perfeito para o cidadão comum que quer proteger seus bens principais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground/90 leading-relaxed">
                      <strong className="text-primary">Cadastro:</strong> Até 2 objetos (ex: 1 celular e 1 bike)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground/90 leading-relaxed">
                      <strong className="text-primary">Consultas:</strong> Ilimitadas para evitar compra de roubados
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground/90 leading-relaxed">
                      <strong className="text-primary">Alerta de Roubo:</strong> Ativação básica no sistema
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground/90 leading-relaxed">
                      <strong className="text-primary">Suporte:</strong> Via FAQ e Comunidade
                    </span>
                  </li>
                </ul>

                <Button 
                  variant="outline" 
                  className="w-full h-12 text-base font-bold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  onClick={() => navigate({ to: "/login" })}
                >
                  Começar Grátis
                </Button>
              </CardContent>
            </Card>

            {/* Plano Premium */}
            <Card className="relative border-4 border-accent hover:border-accent/70 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] bg-gradient-to-br from-card via-card to-accent/5">
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                <Badge className="bg-accent text-accent-foreground text-sm font-bold px-4 py-1.5 shadow-lg">
                  <Sparkles className="w-4 h-4 mr-1.5 inline" />
                  Mais Popular
                </Badge>
              </div>

              <CardHeader className="text-center space-y-3 pb-6 pt-8">
                <CardTitle className="text-3xl md:text-4xl font-display font-extrabold text-primary tracking-tight">
                  Proteção Ativa
                </CardTitle>
                <div className="space-y-2">
                  <div className="text-5xl md:text-6xl font-display font-extrabold text-accent tracking-tight">
                    R$ 9,90
                    <span className="text-2xl text-foreground/60 font-normal">/mês</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ou <strong className="text-accent">R$ 89,00/ano</strong> (economize ~25%)
                  </p>
                </div>
                <CardDescription className="text-base md:text-lg leading-relaxed">
                  Para quem tem bens de maior valor ou trabalha com o objeto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-foreground/90 leading-relaxed">
                      <strong className="text-accent">Cadastro:</strong> Até 10 objetos (família toda)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-foreground/90 leading-relaxed">
                      <strong className="text-accent">Histórico de Propriedade:</strong> Certificado digital com validade jurídica para revenda
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-foreground/90 leading-relaxed">
                      <strong className="text-accent">Notificação de Proximidade:</strong> Alerta se um objeto roubado similar ao seu for consultado num raio de 50km
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-foreground/90 leading-relaxed">
                      <strong className="text-accent">Transferência de Posse:</strong> Botão para transferir o registro digital para outra pessoa ao vender (evita golpes)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-foreground/90 leading-relaxed">
                      <strong className="text-accent">Suporte Prioritário:</strong> Atendimento preferencial
                    </span>
                  </li>
                </ul>

                <div className="space-y-3">
                  <Button 
                    className="w-full h-14 text-base md:text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                    onClick={() => navigate({ to: "/checkout", search: { plan: "monthly" } })}
                  >
                    Assinar Mensal - R$ 9,90/mês
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full h-12 text-base font-bold border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                    onClick={() => navigate({ to: "/checkout", search: { plan: "annual" } })}
                  >
                    Assinar Anual - R$ 89,00/ano
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-12 md:py-14">
          {/* Impact Statement */}
          <div className="text-center mb-8 md:mb-10">
            <p className="text-xl md:text-2xl font-display font-bold text-primary mb-2 tracking-tight">
              Juntos por uma Fortaleza mais segura
            </p>
            <p className="text-foreground/80 text-base">
              Milhares de bens protegidos. Centenas de recuperações bem-sucedidas.
            </p>
          </div>

          {/* Partner Logos */}
          <div className="mb-8">
            <p className="text-center text-xs text-muted-foreground uppercase tracking-wider mb-5 font-semibold">
              Parceiros
            </p>
            <div className="flex justify-center">
              <img 
                src="/assets/generated/partner-logos.dim_800x200.png" 
                alt="Logos dos parceiros"
                className="max-w-full h-auto opacity-50 grayscale hover:opacity-70 transition-opacity duration-300"
                style={{ maxHeight: "70px" }}
              />
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              © 2026 CERC FORTALEZA - Cadastro de Eletrônicos e Registros Ceará. Todos os direitos reservados.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
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
        </div>
      </footer>
    </div>
  );
}
