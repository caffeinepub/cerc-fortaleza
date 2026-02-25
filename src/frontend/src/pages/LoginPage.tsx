import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate({ to: "/admin" });
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full shadow-2xl border-2 border-primary/20">
        <CardHeader className="text-center space-y-4 pb-4">
          <div className="flex justify-center mb-4">
            <img
              src="/assets/uploads/LOGO-BRANCO-1.png"
              alt="CERC FORTALEZA"
              className="w-full max-w-[280px] h-auto"
            />
          </div>
          <div className="w-20 h-20 mx-auto bg-primary/15 rounded-full flex items-center justify-center ring-4 ring-primary/10">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-display font-bold text-primary tracking-tight">
            Área do Administrador
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Faça login para acessar o painel administrativo do CERC FORTALEZA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-14 text-base md:text-lg font-bold uppercase tracking-wide transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 bg-accent hover:bg-accent/90 shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Autenticando...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-5 w-5" />
                Entrar com Internet Identity
              </>
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Sistema seguro de autenticação descentralizada
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
