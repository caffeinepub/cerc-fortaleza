import { useState } from "react";
import { Plus, Smartphone, Bike, Laptop, Package, AlertTriangle, Loader2, Crown, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useMyObjects, useRegisterObject, useReportTheft, useMySubscription } from "@/hooks/useQueries";
import type { PersonalObject, ObjectType } from "@/backend.d";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";

const objectTypeIcons = {
  phone: Smartphone,
  bike: Bike,
  notebook: Laptop,
  other: Package,
};

const objectTypeLabels = {
  phone: "Celular",
  bike: "Bicicleta",
  notebook: "Notebook",
  other: "Outro",
};

export function VaultTab() {
  const navigate = useNavigate();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedObject, setSelectedObject] = useState<PersonalObject | null>(null);

  // Form states
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [objType, setObjType] = useState<"phone" | "bike" | "notebook" | "other">("phone");

  // Report theft form states
  const [boNumber, setBoNumber] = useState("");
  const [location, setLocation] = useState("");

  const { data: objects = [], isLoading } = useMyObjects();
  const { data: subscription, isLoading: isLoadingSubscription } = useMySubscription();
  const { mutate: registerObject, isPending: isRegistering } = useRegisterObject();
  const { mutate: reportTheft, isPending: isReporting } = useReportTheft();

  const isPremium = subscription?.plan !== "free";
  const canAddMore = subscription ? Number(subscription.objectCount) < Number(subscription.objectLimit) : false;
  const isExpired = subscription?.isExpired || false;

  const formatExpirationDate = (expirationNs?: bigint): string => {
    if (!expirationNs) return "N/A";
    const expirationMs = Number(expirationNs) / 1_000_000;
    const date = new Date(expirationMs);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleRegisterObject = () => {
    if (!brand.trim() || !model.trim() || !identifier.trim()) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (identifier.length < 6) {
      toast.error("O identificador deve ter no mínimo 6 caracteres");
      return;
    }

    let objectTypeVariant: ObjectType;
    switch (objType) {
      case "phone":
        objectTypeVariant = { __kind__: "phone", phone: null };
        break;
      case "bike":
        objectTypeVariant = { __kind__: "bike", bike: null };
        break;
      case "notebook":
        objectTypeVariant = { __kind__: "notebook", notebook: null };
        break;
      case "other":
        objectTypeVariant = { __kind__: "other", other: "" };
        break;
    }

    registerObject(
      { brand, model, identifier, objType: objectTypeVariant },
      {
        onSuccess: () => {
          toast.success("Objeto cadastrado com sucesso!");
          setIsAddSheetOpen(false);
          setBrand("");
          setModel("");
          setIdentifier("");
          setObjType("phone");
        },
        onError: (error) => {
          console.error("Register error:", error);
          toast.error("Erro ao cadastrar objeto. Tente novamente.");
        },
      }
    );
  };

  const handleReportTheft = () => {
    if (!selectedObject) return;

    if (!boNumber.trim() || !location.trim()) {
      toast.error("Por favor, preencha o número do B.O. e o local");
      return;
    }

    const now = Date.now();
    const latitudeValue = BigInt(-3850000); // Fortaleza latitude * 1000000
    const longitudeValue = BigInt(-38500000); // Fortaleza longitude * 1000000

    reportTheft(
      {
        objectId: selectedObject.id,
        boNumber: boNumber.trim(),
        latitude: latitudeValue,
        longitude: longitudeValue,
        date: BigInt(now * 1000000),
        location: location.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Roubo reportado com sucesso!");
          setIsReportDialogOpen(false);
          setSelectedObject(null);
          setBoNumber("");
          setLocation("");
        },
        onError: (error) => {
          console.error("Report theft error:", error);
          toast.error("Erro ao reportar roubo. Tente novamente.");
        },
      }
    );
  };

  const openReportDialog = (obj: PersonalObject) => {
    setSelectedObject(obj);
    setIsReportDialogOpen(true);
  };

  const getObjectTypeKey = (objType: ObjectType): "phone" | "bike" | "notebook" | "other" => {
    if ("phone" in objType) return "phone";
    if ("bike" in objType) return "bike";
    if ("notebook" in objType) return "notebook";
    return "other";
  };

  const maskIdentifier = (id: string) => {
    if (id.length <= 4) return id;
    return "*****" + id.slice(-4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-center tracking-tight">
            Meu Baú
          </h1>
          <p className="text-center text-primary-foreground/90 text-sm md:text-base mt-2">
            Seus objetos protegidos
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Subscription Badge & Counter */}
        {isLoadingSubscription ? (
          <div className="mb-6 space-y-2">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-6 w-32 mx-auto" />
          </div>
        ) : subscription && (
          <div className="mb-6 text-center space-y-2">
            <Badge
              variant={isPremium && !isExpired ? "default" : "secondary"}
              className={`text-base px-4 py-1.5 ${
                isPremium && !isExpired
                  ? "bg-accent text-accent-foreground"
                  : isExpired
                  ? "bg-red-600 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isPremium && !isExpired ? (
                <>
                  <Crown className="w-4 h-4 mr-2 inline" />
                  Plano Premium
                </>
              ) : isExpired ? (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2 inline" />
                  Premium Expirado
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2 inline" />
                  Plano Gratuito
                </>
              )}
            </Badge>
            <p className="text-sm text-muted-foreground font-semibold">
              {Number(subscription.objectCount)}/{Number(subscription.objectLimit)} objetos cadastrados
            </p>
            {isPremium && subscription.expirationDate && (
              <p className="text-xs text-muted-foreground">
                {isExpired ? (
                  <span className="text-red-600 font-bold">Expirou em: {formatExpirationDate(subscription.expirationDate)}</span>
                ) : (
                  <span>Expira em: {formatExpirationDate(subscription.expirationDate)}</span>
                )}
              </p>
            )}
          </div>
        )}

        {/* Upgrade CTA (if limit reached or expired) */}
        {subscription && (!canAddMore || isExpired) && (
          <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-accent/10 mb-6">
            <CardContent className="pt-6 pb-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-accent rounded-full flex items-center justify-center">
                {isExpired ? (
                  <AlertTriangle className="w-8 h-8 text-accent-foreground" />
                ) : (
                  <Crown className="w-8 h-8 text-accent-foreground" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-primary mb-2">
                  {isExpired ? "Assinatura Expirada" : "Limite Atingido"}
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  {isExpired ? (
                    <>Sua assinatura Premium expirou. Renove agora para continuar aproveitando todos os benefícios!</>
                  ) : (
                    <>
                      Você atingiu o limite do plano {isPremium ? "Premium" : "gratuito"} (
                      {Number(subscription.objectCount)}/{Number(subscription.objectLimit)})
                      {!isPremium && ". Faça upgrade para Premium e cadastre até 10 objetos!"}
                    </>
                  )}
                </p>
              </div>
              {(!isPremium || isExpired) && (
                <Button
                  onClick={() => navigate({ to: "/checkout", search: { plan: "monthly" } })}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  {isExpired ? "Renovar Agora" : "Fazer Upgrade"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-2">
                <CardContent className="pt-6">
                  <Skeleton className="h-12 w-12 mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : objects.length === 0 ? (
          <Card className="border-2 border-dashed border-primary/30">
            <CardContent className="pt-12 pb-12">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Package className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-primary mb-2">
                    Nenhum objeto cadastrado
                  </h3>
                  <p className="text-muted-foreground">
                    Cadastre seu primeiro bem para protegê-lo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {objects.map((obj) => {
              const typeKey = getObjectTypeKey(obj.objType);
              const Icon = objectTypeIcons[typeKey];
              const isSafe = obj.status.__kind__ === "safe";

              return (
                <Card 
                  key={obj.id.toString()} 
                  className={`border-2 hover:shadow-lg transition-shadow ${
                    isSafe ? "border-primary/20" : "border-red-500"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isSafe ? "bg-primary" : "bg-red-500"
                        }`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-display">
                            {obj.brand} {obj.model}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {objectTypeLabels[typeKey]}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={isSafe ? "default" : "destructive"}>
                        {isSafe ? "Seguro" : "Roubado"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">ID:</strong> {maskIdentifier(obj.identifier)}
                    </p>
                    {isSafe && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => openReportDialog(obj)}
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Reportar Roubo
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-20 right-6 w-14 h-14 rounded-full shadow-2xl hover:scale-110 transition-transform z-40"
            disabled={!canAddMore}
          >
            <Plus className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[90vh] overflow-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl font-display text-primary">
              Cadastrar Novo Objeto
            </SheetTitle>
            <SheetDescription>
              Proteja seu bem cadastrando-o em nosso sistema
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-base font-semibold">
                Tipo de Objeto
              </Label>
              <Select value={objType} onValueChange={(value) => setObjType(value as typeof objType)}>
                <SelectTrigger className="h-12 border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">📱 Celular</SelectItem>
                  <SelectItem value="bike">🚲 Bicicleta</SelectItem>
                  <SelectItem value="notebook">💻 Notebook</SelectItem>
                  <SelectItem value="other">📦 Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand" className="text-base font-semibold">
                Marca
              </Label>
              <Input
                id="brand"
                placeholder="Ex: Samsung, Caloi, Dell"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="h-12 border-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="text-base font-semibold">
                Modelo
              </Label>
              <Input
                id="model"
                placeholder="Ex: Galaxy S23, Aro 29, Inspiron 15"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="h-12 border-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-base font-semibold">
                Identificador Único
              </Label>
              <Input
                id="identifier"
                placeholder="IMEI, Chassi ou Número de Série"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="h-12 border-2"
              />
              <p className="text-xs text-muted-foreground">
                Mínimo de 6 caracteres. Este número identifica seu objeto de forma única.
              </p>
            </div>

            <Button
              onClick={handleRegisterObject}
              disabled={isRegistering}
              className="w-full h-12 text-base font-bold mt-6"
            >
              {isRegistering ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                "Cadastrar"
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Report Theft Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-red-600">
              Reportar Roubo
            </DialogTitle>
            <DialogDescription>
              {selectedObject && `${selectedObject.brand} ${selectedObject.model}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="boNumber" className="text-base font-semibold">
                Número do Boletim de Ocorrência *
              </Label>
              <Input
                id="boNumber"
                placeholder="Ex: 123456/2026"
                value={boNumber}
                onChange={(e) => setBoNumber(e.target.value)}
                className="h-12 border-2"
              />
              <p className="text-xs text-muted-foreground">
                Obrigatório para validar o reporte
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-base font-semibold">
                Local do Ocorrido *
              </Label>
              <Input
                id="location"
                placeholder="Ex: Aldeota, Fortaleza"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-12 border-2"
              />
            </div>

            <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400">
                ⚠️ Após confirmar, este objeto será marcado como <strong>ROUBADO</strong> em toda a rede instantaneamente.
              </p>
            </div>

            <Button
              onClick={handleReportTheft}
              disabled={isReporting}
              variant="destructive"
              className="w-full h-12 text-base font-bold"
            >
              {isReporting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Reportando...
                </>
              ) : (
                "Confirmar Roubo"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
