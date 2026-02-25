import { useState } from "react";
import { Search, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { usePublicSearch } from "@/hooks/useQueries";

export function SearchTab() {
  const [identifier, setIdentifier] = useState("");
  const [searchResult, setSearchResult] = useState<{
    status: "safe" | "stolen";
    location?: string;
  } | null>(null);

  const { mutate: search, isPending } = usePublicSearch();

  const handleSearch = () => {
    if (identifier.length < 6) {
      toast.error("O identificador deve ter no mínimo 6 caracteres");
      return;
    }

    search(identifier, {
      onSuccess: (result) => {
        if (result === "Sem restricoes") {
          setSearchResult({ status: "safe" });
        } else {
          try {
            const parsed = JSON.parse(result);
            setSearchResult({
              status: "stolen",
              location: parsed.local || "Local desconhecido",
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isPending) {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center mb-4">
            <img 
              src="/assets/uploads/LOGO-BRANCO-1.png" 
              alt="CERC FORTALEZA"
              className="h-12 w-auto"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-center tracking-tight">
            Consultar Procedência
          </h1>
          <p className="text-center text-primary-foreground/90 text-sm md:text-base mt-2">
            Verifique se um objeto foi reportado como roubado
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Search Card */}
        <Card className="border-2 border-primary/20 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-display text-primary">
              Digite o identificador do objeto
            </CardTitle>
            <CardDescription>
              IMEI para celulares, Chassi para bicicletas, Número de série para notebooks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-base font-semibold">
                Identificador
              </Label>
              <Input
                id="identifier"
                type="text"
                placeholder="Ex: 123456789012345"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isPending}
                className="h-12 text-base border-2 focus-visible:ring-primary focus-visible:border-primary"
              />
            </div>

            <Button
              onClick={handleSearch}
              disabled={isPending || identifier.length < 6}
              className="w-full h-12 text-base font-bold"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Buscar
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Result Card */}
        {searchResult && (
          <Card 
            className={`border-2 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 ${
              searchResult.status === "safe" 
                ? "border-green-500 bg-green-50 dark:bg-green-950/20" 
                : "border-red-500 bg-red-50 dark:bg-red-950/20"
            }`}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                {searchResult.status === "safe" ? (
                  <>
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold text-green-700 dark:text-green-400 mb-2">
                        ✅ Sem Restrições
                      </h3>
                      <p className="text-base text-green-600 dark:text-green-300">
                        Este objeto não está reportado como roubado em nosso sistema.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <AlertTriangle className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold text-red-700 dark:text-red-400 mb-2">
                        ⚠️ Objeto Reportado como Roubado
                      </h3>
                      <p className="text-base text-red-600 dark:text-red-300 mb-4">
                        Este objeto foi reportado como roubado em nosso sistema.
                      </p>
                      <div className="bg-white dark:bg-card rounded-lg p-4 text-left space-y-2 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-foreground/80">
                          <strong className="text-foreground">Local:</strong> {searchResult.location}
                        </p>
                        <p className="text-xs text-muted-foreground mt-3">
                          ⚠️ Não compre ou aceite este objeto. Entre em contato com as autoridades.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        {!searchResult && (
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Consultas são totalmente gratuitas e ilimitadas</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Verifique sempre antes de comprar um produto usado</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Ajude a combater o comércio de objetos roubados</span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
