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
import { usePublicSearch, usePublicStats } from "@/hooks/useQueries";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Loader2,
  RefreshCw,
  Search,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SearchTab() {
  const [identifier, setIdentifier] = useState("");
  const [searchResult, setSearchResult] = useState<{
    status: "safe" | "stolen";
    location?: string;
  } | null>(null);

  const { mutate: search, isPending } = usePublicSearch();
  const { data: stats } = usePublicStats();

  const handleSearch = () => {
    const trimmed = identifier.trim();
    if (trimmed.length < 6) {
      toast.error("O identificador deve ter no mínimo 6 caracteres");
      return;
    }

    search(trimmed, {
      onSuccess: (result) => {
        if (result === "Sem restricoes") {
          setSearchResult({ status: "safe" });
        } else {
          try {
            const parsed = JSON.parse(result) as { local?: string };
            setSearchResult({
              status: "stolen",
              location: parsed.local ?? "Local desconhecido",
            });
          } catch {
            setSearchResult({ status: "safe" });
          }
        }
      },
      onError: (error) => {
        console.error("Search error:", error);
        toast.error("Erro ao realizar busca. Tente novamente.");
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isPending) {
      handleSearch();
    }
  };

  const handleReset = () => {
    setSearchResult(null);
    setIdentifier("");
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-secondary text-white shadow-navy">
        <div className="container mx-auto px-4 py-5">
          <div className="flex justify-center mb-3">
            <div className="bg-white rounded-lg px-3 py-1.5">
              <img
                src="/assets/uploads/LOGO-COM-NOME-1-1.png"
                alt="CERC FORTALEZA"
                className="h-9 w-auto"
              />
            </div>
          </div>
          <h1 className="text-2xl font-display font-bold text-center tracking-tight">
            Consultar Procedência
          </h1>
          <p className="text-center text-white/70 text-sm mt-1">
            Verifique se um objeto foi reportado como roubado
          </p>
        </div>
      </header>

      {/* Stats strip */}
      {stats && (
        <div className="bg-primary/5 border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Database className="w-3.5 h-3.5 text-primary" />
                <span>
                  <strong className="text-foreground">
                    {Number(stats.totalObjects)}
                  </strong>{" "}
                  objetos cadastrados
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <ShieldAlert className="w-3.5 h-3.5 text-accent" />
                <span>
                  <strong className="text-foreground">
                    {Number(stats.totalStolen)}
                  </strong>{" "}
                  reportados
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                <span>
                  <strong className="text-foreground">
                    {Number(stats.totalRecovered)}
                  </strong>{" "}
                  recuperados
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Search card */}
        <Card className="border-2 border-primary/15 shadow-navy mb-6 rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-display text-primary">
              Digite o identificador do objeto
            </CardTitle>
            <CardDescription>
              IMEI para celulares • Chassi para bicicletas • Número de série
              para notebooks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="identifier"
                className="text-sm font-semibold uppercase tracking-wide text-foreground/60"
              >
                Identificador
              </Label>
              <Input
                id="identifier"
                type="text"
                placeholder="Ex: 123456789012345"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isPending}
                className="h-12 text-base border-2 focus-visible:ring-primary focus-visible:border-primary"
                autoComplete="off"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleSearch}
                disabled={isPending || identifier.trim().length < 6}
                className="flex-1 h-12 font-bold bg-primary hover:bg-primary/90"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Verificar
                  </>
                )}
              </Button>
              {searchResult && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="h-12 px-4 border-2"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {searchResult && (
          <Card
            className={`border-2 shadow-lg rounded-2xl animate-slide-up ${
              searchResult.status === "safe"
                ? "border-green-500 bg-green-50"
                : "border-accent bg-red-50"
            }`}
          >
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col items-center text-center space-y-4">
                {searchResult.status === "safe" ? (
                  <>
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold text-green-700 mb-2">
                        Sem Restrições
                      </h3>
                      <p className="text-green-600 leading-relaxed">
                        Este objeto não está reportado como roubado em nosso
                        sistema. Consulta realizada com segurança.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <AlertTriangle className="w-10 h-10 text-white" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-display font-bold text-accent">
                        Objeto Reportado como Roubado
                      </h3>
                      <p className="text-accent/80 leading-relaxed">
                        Atenção! Este objeto foi reportado como roubado em nosso
                        sistema.
                      </p>
                      <div className="bg-white rounded-xl p-4 text-left space-y-1 border border-accent/20">
                        <p className="text-sm text-foreground/80">
                          <strong>Local:</strong> {searchResult.location}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          ⚠️ Não adquira este objeto. Entre em contato com as
                          autoridades.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        {!searchResult && (
          <Card className="border-primary/10 rounded-2xl">
            <CardContent className="pt-5 pb-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Sabia que...
              </p>
              <div className="space-y-2.5 text-sm text-muted-foreground">
                {[
                  "Consultas são totalmente gratuitas e ilimitadas",
                  "Verifique sempre antes de comprar um produto usado",
                  "Ajude a combater o comércio de objetos roubados em Fortaleza",
                ].map((tip) => (
                  <p key={tip} className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span>{tip}</span>
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
