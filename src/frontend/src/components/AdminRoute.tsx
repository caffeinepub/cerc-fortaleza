import { ReactNode, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Loader2, Home } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface AdminRouteProps {
  children: ReactNode;
}

/**
 * AdminRoute: Protege rotas que exigem autenticação E permissões de administrador
 * Use para: /admin, /admin/stripe-config, etc.
 */
export function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-lg text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full shadow-2xl border-2 border-accent/20">
          <CardHeader className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-accent/15 rounded-full flex items-center justify-center ring-4 ring-accent/10">
              <ShieldAlert className="w-10 h-10 text-accent" />
            </div>
            <CardTitle className="text-2xl font-display font-bold text-accent tracking-tight">
              Acesso Negado
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-base text-foreground/80 leading-relaxed">
              Você não possui permissões de administrador para acessar esta área.
            </p>
            <p className="text-sm text-muted-foreground">
              Entre em contato com um administrador do sistema para solicitar acesso.
            </p>
            <Link to="/">
              <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                <Home className="w-4 h-4 mr-2" />
                Voltar para o Site
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
