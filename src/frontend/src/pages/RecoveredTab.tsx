import { Variant_claimed_available } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddFoundObject,
  useClaimFoundObject,
  useFoundObjects,
} from "@/hooks/useQueries";
import { CheckCircle2, Loader2, MapPin, Package, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function RecoveredTab() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const { data: foundObjects = [], isLoading } = useFoundObjects();
  const { mutate: addFoundObject, isPending: isAdding } = useAddFoundObject();
  const { mutate: claimFoundObject, isPending: isClaiming } =
    useClaimFoundObject();

  const handleAddFoundObject = () => {
    if (!description.trim() || !location.trim()) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    addFoundObject(
      { description: description.trim(), location: location.trim() },
      {
        onSuccess: () => {
          toast.success("Objeto adicionado ao mural!");
          setIsAddDialogOpen(false);
          setDescription("");
          setLocation("");
        },
        onError: (error) => {
          console.error("Add found object error:", error);
          toast.error("Erro ao adicionar objeto. Tente novamente.");
        },
      },
    );
  };

  const handleClaimObject = (objectId: bigint) => {
    claimFoundObject(objectId, {
      onSuccess: () => {
        toast.success("Objeto reivindicado! Dirija-se ao local para retirada.");
      },
      onError: (error) => {
        console.error("Claim object error:", error);
        toast.error("Erro ao reivindicar objeto.");
      },
    });
  };

  const formatDate = (createdAt: bigint) => {
    const date = new Date(Number(createdAt) / 1_000_000);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-secondary text-white shadow-navy">
        <div className="container mx-auto px-4 py-5">
          <h1 className="text-2xl font-display font-bold text-center tracking-tight">
            Objetos Recuperados
          </h1>
          <p className="text-center text-white/70 text-sm mt-1">
            Mural da comunidade CERC Fortaleza
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Add button */}
        <div className="mb-6">
          <Button
            type="button"
            onClick={() => setIsAddDialogOpen(true)}
            className="w-full md:w-auto h-12 font-bold bg-primary hover:bg-primary/90 rounded-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Objeto Encontrado
          </Button>
        </div>

        {/* Objects grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-2 rounded-2xl">
                <CardContent className="pt-6">
                  <Skeleton className="h-5 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : foundObjects.length === 0 ? (
          <Card className="border-2 border-dashed border-primary/20 rounded-2xl">
            <CardContent className="pt-12 pb-12">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Package className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-primary mb-1.5">
                    Nenhum objeto disponível
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Encontrou algo? Adicione ao mural para ajudar o dono
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {foundObjects.map((obj) => {
              const isAvailable =
                obj.status === Variant_claimed_available.available;

              return (
                <Card
                  key={obj.id.toString()}
                  className={`border-2 hover:shadow-navy transition-all rounded-2xl ${
                    isAvailable ? "border-primary/15" : "border-border"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-base font-display text-primary leading-tight">
                        Objeto Encontrado
                      </CardTitle>
                      <Badge
                        className={
                          isAvailable
                            ? "bg-primary/10 text-primary border-0 shrink-0"
                            : "bg-muted text-muted-foreground border-0 shrink-0"
                        }
                      >
                        {isAvailable ? "Disponível" : "Reivindicado"}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm leading-relaxed line-clamp-3">
                      {obj.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                      <span className="line-clamp-2">
                        <strong className="text-foreground">Local:</strong>{" "}
                        {obj.location}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Encontrado em: {formatDate(obj.createdAt)}
                    </p>

                    {isAvailable ? (
                      <Button
                        type="button"
                        onClick={() => handleClaimObject(obj.id)}
                        disabled={isClaiming}
                        size="sm"
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        {isClaiming ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />É MEU!
                          </>
                        )}
                      </Button>
                    ) : (
                      <p className="text-center text-sm text-muted-foreground py-1.5 bg-muted rounded-lg">
                        Objeto já foi reivindicado
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info */}
        <Card className="mt-8 border-primary/10 rounded-2xl">
          <CardContent className="pt-5 pb-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Como funciona
            </p>
            <div className="space-y-2.5 text-sm text-muted-foreground">
              {[
                "Encontrou um objeto? Adicione ao mural para ajudar o dono a recuperá-lo",
                "Perdeu algo? Verifique os objetos disponíveis e clique em 'É MEU!' se reconhecer",
                "Após reivindicar, dirija-se ao local indicado para recuperar seu bem",
              ].map((tip) => (
                <p key={tip} className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>{tip}</span>
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Found Object Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-primary">
              Adicionar Objeto Encontrado
            </DialogTitle>
            <DialogDescription>
              Ajude alguém a recuperar o que perdeu
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-semibold uppercase tracking-wide text-foreground/60"
              >
                Descrição do Objeto *
              </Label>
              <Textarea
                id="description"
                placeholder="Ex: Celular Samsung preto encontrado no Terminal do Siqueira"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="border-2 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-sm font-semibold uppercase tracking-wide text-foreground/60"
              >
                Local de Entrega *
              </Label>
              <Input
                id="location"
                placeholder="Ex: Delegacia do Centro - Rua São José, 75"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-12 border-2"
              />
              <p className="text-xs text-muted-foreground">
                Onde o dono pode retirar o objeto?
              </p>
            </div>

            <div className="bg-primary/5 border-2 border-primary/15 rounded-xl p-4">
              <p className="text-sm text-foreground/70">
                ℹ️ Seu objeto ficará visível no mural para que o dono possa
                reivindicá-lo.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleAddFoundObject}
              disabled={isAdding}
              className="w-full h-12 font-bold bg-primary hover:bg-primary/90"
            >
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publicando...
                </>
              ) : (
                "Publicar no Mural"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
