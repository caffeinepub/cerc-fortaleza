import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/app/home" });
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleLogin = () => {
    try {
      login();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Erro ao iniciar autenticação");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-secondary via-secondary/90 to-primary/80 p-4">
      {/* Back button */}
      <div className="absolute top-4 left-4">
        <Link to="/">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10 gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <Card className="max-w-md w-full shadow-navy-lg border-0 rounded-2xl overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1.5 bg-accent w-full" />

        <CardHeader className="text-center space-y-4 pt-10 pb-4">
          <div className="flex justify-center mb-2">
            <img
              src="/assets/uploads/LOGO-BRANCO-1.png"
              alt="CERC FORTALEZA"
              className="w-full max-w-[220px] h-auto"
            />
          </div>
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center border-2 border-primary/20">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-display font-bold text-primary tracking-tight">
            Entrar na sua conta
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Acesse o aplicativo CERC FORTALEZA de forma segura com sua
            identidade digital
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pb-10 px-8">
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-14 text-base font-bold bg-accent hover:bg-accent/90 text-white shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Autenticando...
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-5 w-5" />
                Entrar com Internet Identity
              </>
            )}
          </Button>

          <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide">
              O que é Internet Identity?
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              É um sistema de autenticação descentralizado da blockchain ICP.
              Seus dados nunca ficam com terceiros — você tem controle total.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
