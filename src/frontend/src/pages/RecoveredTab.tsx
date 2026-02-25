import { useState } from "react";
import { Plus, Package, MapPin, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useFoundObjects, useAddFoundObject, useClaimFoundObject } from "@/hooks/useQueries";
import { Variant_claimed_available, type FoundObject } from "@/backend.d";

export function RecoveredTab() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const { data: foundObjects = [], isLoading } = useFoundObjects();
  const { mutate: addFoundObject, isPending: isAdding } = useAddFoundObject();
  const { mutate: claimFoundObject, isPending: isClaiming } = useClaimFoundObject();

  const handleAddFoundObject = () => {
    if (!description.trim() || !location.trim()) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    addFoundObject(
      { description: description.trim(), location: location.trim() },
      {
        onSuccess: () => {
          toast.success("Objeto adicionado ao mural com sucesso!");
          setIsAddDialogOpen(false);
          setDescription("");
          setLocation("");
        },
        onError: (error) => {
          console.error("Add found object error:", error);
          toast.error("Erro ao adicionar objeto. Tente novamente.");
        },
      }
    );
  };

  const handleClaimObject = (objectId: bigint) => {
    claimFoundObject(objectId, {
      onSuccess: () => {
        toast.success("Objeto reivindicado com sucesso! Dirija-se ao local indicado.");
      },
      onError: (error) => {
        console.error("Claim object error:", error);
        toast.error("Erro ao reivindicar objeto. Tente novamente.");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-center tracking-tight">
            Objetos Recuperados
          </h1>
          <p className="text-center text-primary-foreground/90 text-sm md:text-base mt-2">
            Mural de objetos encontrados pela comunidade
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Add Button */}
        <div className="mb-6">
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="w-full md:w-auto h-12 text-base font-bold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Objeto Encontrado
          </Button>
        </div>

        {/* Objects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-2">
                <CardContent className="pt-6">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : foundObjects.length === 0 ? (
          <Card className="border-2 border-dashed border-primary/30">
            <CardContent className="pt-12 pb-12">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Package className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-primary mb-2">
                    Nenhum objeto disponível
                  </h3>
                  <p className="text-muted-foreground">
                    Seja o primeiro a adicionar um objeto encontrado
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {foundObjects.map((obj) => {
              const isAvailable = obj.status === Variant_claimed_available.available;

              return (
                <Card 
                  key={obj.id.toString()} 
                  className={`border-2 hover:shadow-lg transition-shadow ${
                    isAvailable ? "border-primary/20" : "border-muted"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-display text-primary">
                        Objeto Encontrado
                      </CardTitle>
                      <Badge variant={isAvailable ? "default" : "secondary"}>
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
                      <span>
                        <strong className="text-foreground">Local de entrega:</strong> {obj.location}
                      </span>
                    </div>

                    {isAvailable ? (
                      <Button
                        onClick={() => handleClaimObject(obj.id)}
                        disabled={isClaiming}
                        className="w-full"
                        size="sm"
                      >
                        {isClaiming ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            É MEU
                          </>
                        )}
                      </Button>
                    ) : (
                      <div className="text-center text-sm text-muted-foreground py-2">
                        Este objeto já foi reivindicado
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Card */}
        <Card className="mt-8 border-primary/20">
          <CardContent className="pt-6">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Encontrou um objeto? Adicione ao mural para ajudar o dono a recuperá-lo</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Perdeu algo? Verifique os objetos disponíveis e reivindique se reconhecer</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Após reivindicar, dirija-se ao local indicado para recuperar seu bem</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Found Object Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
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
              <Label htmlFor="description" className="text-base font-semibold">
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
              <Label htmlFor="location" className="text-base font-semibold">
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

            <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4">
              <p className="text-sm text-foreground/80">
                ℹ️ Seu objeto será visível no mural para que o dono possa reivindicá-lo.
              </p>
            </div>

            <Button
              onClick={handleAddFoundObject}
              disabled={isAdding}
              className="w-full h-12 text-base font-bold"
            >
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Adicionando...
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
