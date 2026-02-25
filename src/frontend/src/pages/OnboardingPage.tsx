import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Shield, Search, Package, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";

const slides = [
  {
    icon: Shield,
    title: "Proteja seus bens antes de qualquer problema",
    description: "Cadastre seus objetos de valor no CERC e tenha um registro digital seguro. Em caso de roubo, ative o alerta instantaneamente.",
    color: "bg-primary",
  },
  {
    icon: Search,
    title: "Consulte procedência antes de comprar usado",
    description: "Verifique se um celular, bike ou notebook está reportado como roubado antes de fazer sua compra. Ajude a combater o comércio de itens roubados.",
    color: "bg-accent",
  },
  {
    icon: Package,
    title: "Recupere o que é seu com nossa rede",
    description: "Cidadãos e autoridades compartilham objetos encontrados. Se algo for recuperado, você será notificado imediatamente.",
    color: "bg-primary",
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
      // Check if user is authenticated
      if (identity) {
        navigate({ to: "/app/home" });
      } else {
        navigate({ to: "/login" });
      }
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/assets/uploads/LOGO-BRANCO-1.png" 
            alt="CERC FORTALEZA"
            className="w-full max-w-xs h-auto"
          />
        </div>

        {/* Slide Card */}
        <Card className="border-2 border-primary/20 shadow-2xl">
          <CardContent className="p-8 md:p-12">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className={`w-24 h-24 ${slide.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <Icon className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center space-y-4 mb-10">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-primary tracking-tight leading-tight">
                {slide.title}
              </h2>
              <p className="text-base md:text-lg text-foreground/80 leading-relaxed max-w-lg mx-auto">
                {slide.description}
              </p>
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mb-8">
              {slides.map((slideItem, index) => (
                <button
                  key={`${slideItem.title.slice(0, 10)}-${index}`}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? "w-8 bg-primary" 
                      : "w-2 bg-primary/30 hover:bg-primary/50"
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              {currentSlide > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  className="flex-1 h-12 text-base font-semibold border-2"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Voltar
                </Button>
              )}
              <Button
                onClick={handleNext}
                className={`h-12 text-base font-bold ${currentSlide === 0 ? 'w-full' : 'flex-1'}`}
              >
                {isLastSlide ? "Começar" : "Próximo"}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Skip Button */}
        {!isLastSlide && (
          <div className="text-center mt-6">
            <Button
              variant="ghost"
              onClick={() => setCurrentSlide(slides.length - 1)}
              className="text-muted-foreground hover:text-foreground"
            >
              Pular introdução
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
