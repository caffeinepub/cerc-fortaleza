import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Package, Search, Shield } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const slides = [
  {
    icon: Shield,
    title: "Cadastre seus bens antes de qualquer problema",
    description:
      "Registre celulares, bikes e notebooks com IMEI, chassi ou serial. Em caso de roubo, ative o alerta instantaneamente na rede CERC.",
    accent: "bg-primary",
    step: "01",
  },
  {
    icon: Search,
    title: "Consulte procedência antes de comprar usado",
    description:
      "Verifique se um objeto está reportado como roubado antes de fazer sua compra. Ajude a combater o comércio de itens ilícitos em Fortaleza.",
    accent: "bg-accent",
    step: "02",
  },
  {
    icon: Package,
    title: "Recupere o que é seu com a rede CERC",
    description:
      "Cidadãos e autoridades compartilham objetos encontrados. Se algo for recuperado, você será notificado imediatamente.",
    accent: "bg-primary",
    step: "03",
  },
];

export function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();

  const isLastSlide = currentSlide === slides.length - 1;
  const slide = slides[currentSlide];
  const Icon = slide.icon;

  const handleNext = () => {
    if (isLastSlide) {
      if (identity && !identity.getPrincipal().isAnonymous()) {
        navigate({ to: "/app/home" });
      } else {
        navigate({ to: "/login" });
      }
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-secondary/90 to-primary/80">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-white mx-auto" />
          <p className="text-white/70">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-secondary via-secondary/90 to-primary/80">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 pt-4 z-10">
        <Link to="/">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </Link>

        {!isLastSlide && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentSlide(slides.length - 1)}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            Pular
          </Button>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <img
            src="/assets/uploads/LOGO-BRANCO-1.png"
            alt="CERC FORTALEZA"
            className="w-full max-w-[200px] h-auto opacity-90"
          />
        </div>

        {/* Slide card */}
        <div className="w-full max-w-lg bg-card rounded-3xl shadow-navy-lg overflow-hidden">
          {/* Step indicator bar */}
          <div className="flex h-1">
            {slides.map((s, i) => (
              <div
                key={s.step}
                className={`flex-1 transition-all duration-500 ${
                  i <= currentSlide ? "bg-accent" : "bg-border"
                }`}
              />
            ))}
          </div>

          <div className="p-8 md:p-12">
            {/* Step number + icon */}
            <div className="flex items-center gap-4 mb-8">
              <div
                className={`w-16 h-16 ${slide.accent} rounded-2xl flex items-center justify-center shadow-md shrink-0`}
              >
                <Icon className="w-8 h-8 text-white" />
              </div>
              <span className="text-5xl font-display font-extrabold text-primary/10 select-none">
                {slide.step}
              </span>
            </div>

            {/* Content */}
            <div className="space-y-3 mb-10">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-primary tracking-tight leading-tight">
                {slide.title}
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                {slide.description}
              </p>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mb-8">
              {slides.map((s, index) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-8 bg-primary"
                      : "w-2 bg-primary/20 hover:bg-primary/40"
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              {currentSlide > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentSlide((prev) => prev - 1)}
                  className="flex-1 h-12 font-semibold border-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              )}
              <Button
                type="button"
                onClick={handleNext}
                className={`h-12 font-bold bg-accent hover:bg-accent/90 text-white transition-all hover:scale-[1.01] ${
                  currentSlide === 0 ? "w-full" : "flex-1"
                }`}
              >
                {isLastSlide ? "Entrar no App" : "Próximo"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
