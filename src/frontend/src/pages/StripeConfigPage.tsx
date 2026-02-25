import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Settings, CheckCircle2, AlertCircle, Loader2, ArrowLeft, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useActor } from "@/hooks/useActor";

export function StripeConfigPage() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  const [secretKey, setSecretKey] = useState("");
  const [allowedCountries, setAllowedCountries] = useState("BR");

  const checkStripeStatus = useCallback(async () => {
    if (!actor) return;
    
    setIsLoading(true);
    try {
      const configured = await actor.isStripeConfigured();
      setIsConfigured(configured);
    } catch (error) {
      console.error("Error checking Stripe status:", error);
      toast.error("Erro ao verificar status do Stripe");
    } finally {
      setIsLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    checkStripeStatus();
  }, [checkStripeStatus]);

  const handleSaveConfiguration = async () => {
    if (!actor) {
      toast.error("Sistema não inicializado");
      return;
    }

    if (!secretKey.trim()) {
      toast.error("A Secret Key é obrigatória");
      return;
    }

    if (!allowedCountries.trim()) {
      toast.error("Informe pelo menos um país permitido");
      return;
    }

    const countries = allowedCountries
      .split(",")
      .map((c) => c.trim().toUpperCase())
      .filter((c) => c.length > 0);

    if (countries.length === 0) {
      toast.error("Formato inválido de países");
      return;
    }

    setIsSaving(true);
    try {
      await actor.setStripeConfiguration({
        secretKey: secretKey.trim(),
        allowedCountries: countries,
      });

      toast.success("Configuração do Stripe salva com sucesso!");
      setIsConfigured(true);
      setSecretKey(""); // Limpar por segurança
    } catch (error) {
      console.error("Error saving Stripe config:", error);
      toast.error("Erro ao salvar configuração. Verifique os dados e tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/admin" })}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-center tracking-tight">
                Configuração Stripe
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        {/* Instruções em Destaque */}
        <Card className="mb-6 border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
          <CardHeader>
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-1" />
              <div className="space-y-3">
                <CardTitle className="text-xl font-display text-blue-900 dark:text-blue-100">
                  Como configurar o Stripe (Passo a Passo)
                </CardTitle>
                <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-blue-600 dark:text-blue-400">1.</span>
                    <span>
                      Acesse o{" "}
                      <a
                        href="https://dashboard.stripe.com/register"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-bold hover:text-blue-900 inline-flex items-center gap-1"
                      >
                        Dashboard do Stripe
                        <ExternalLink className="w-3 h-3" />
                      </a>{" "}
                      e crie uma conta (se ainda não tiver)
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-blue-600 dark:text-blue-400">2.</span>
                    <span>
                      Vá em <strong>Developers → API keys</strong> no menu lateral
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-blue-600 dark:text-blue-400">3.</span>
                    <span>
                      Copie a <strong>Secret key</strong> (começa com <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">sk_test_</code> para testes)
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-blue-600 dark:text-blue-400">4.</span>
                    <span>
                      Cole a chave abaixo e clique em <strong>Salvar Configuração</strong>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Card Principal */}
        <Card className="border-2 border-primary/20 shadow-2xl">
          <CardHeader className="text-center space-y-3 border-b">
            <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
              <Settings className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-display font-bold text-primary tracking-tight">
              Integração de Pagamentos
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Configure a integração com Stripe para processar assinaturas Premium
            </CardDescription>

            {/* Status Badge */}
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 pt-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Verificando...</span>
              </div>
            ) : (
              <Badge
                variant={isConfigured ? "default" : "secondary"}
                className={`text-base px-4 py-1.5 ${
                  isConfigured
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-yellow-600 text-white hover:bg-yellow-700"
                }`}
              >
                {isConfigured ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2 inline" />
                    Configurado
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2 inline" />
                    Não Configurado
                  </>
                )}
              </Badge>
            )}
          </CardHeader>

          <CardContent className="space-y-6 pt-8 pb-8">
            {/* Quick Link */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30 rounded-lg p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    Acesso Rápido ao Dashboard Stripe
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Obtenha sua Secret Key em segundos
                  </p>
                </div>
                <Button
                  asChild
                  variant="default"
                  className="bg-primary hover:bg-primary/90 shrink-0"
                  size="sm"
                >
                  <a
                    href="https://dashboard.stripe.com/apikeys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    Abrir Dashboard
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="secretKey" className="text-base font-semibold">
                  Secret Key do Stripe *
                </Label>
                <Input
                  id="secretKey"
                  type="password"
                  placeholder="sk_live_... ou sk_test_..."
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="h-12 border-2 font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Use <strong>sk_test_</strong> para testes ou <strong>sk_live_</strong> para produção
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowedCountries" className="text-base font-semibold">
                  Países Permitidos *
                </Label>
                <Textarea
                  id="allowedCountries"
                  placeholder="BR, US, CA (separados por vírgula)"
                  value={allowedCountries}
                  onChange={(e) => setAllowedCountries(e.target.value)}
                  className="h-24 border-2 font-mono"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Códigos ISO de 2 letras, separados por vírgula. Ex: BR, US, CA
                </p>
              </div>
            </div>

            {/* Security Warning */}
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                ⚠️ <strong>Segurança:</strong> A Secret Key será armazenada de forma segura no backend. Nunca compartilhe esta chave publicamente.
              </p>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSaveConfiguration}
              disabled={isSaving || isLoading}
              className="w-full h-14 text-base md:text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Salvar Configuração
                </>
              )}
            </Button>

            {/* Help Text */}
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                Após salvar, o sistema estará pronto para processar pagamentos
              </p>
              {isConfigured && (
                <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                  ✓ Você pode atualizar a configuração a qualquer momento
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
