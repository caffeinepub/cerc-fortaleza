import type { ObjectType, PersonalObject } from "@/backend.d";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMyObjects,
  useMySubscription,
  useRegisterObject,
  useReportTheft,
} from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Bike,
  Crown,
  Laptop,
  Loader2,
  Lock,
  Package,
  Plus,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

function getObjectTypeKey(
  objType: ObjectType,
): "phone" | "bike" | "notebook" | "other" {
  if (objType.__kind__ === "phone") return "phone";
  if (objType.__kind__ === "bike") return "bike";
  if (objType.__kind__ === "notebook") return "notebook";
  return "other";
}

function maskIdentifier(id: string) {
  if (id.length <= 4) return id;
  return `*****${id.slice(-4)}`;
}

function formatExpirationDate(expirationNs?: bigint): string {
  if (!expirationNs) return "N/A";
  const ms = Number(expirationNs) / 1_000_000;
  const date = new Date(ms);
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export function VaultTab() {
  const navigate = useNavigate();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedObject, setSelectedObject] = useState<PersonalObject | null>(
    null,
  );

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [objType, setObjType] = useState<
    "phone" | "bike" | "notebook" | "other"
  >("phone");

  const [boNumber, setBoNumber] = useState("");
  const [location, setLocation] = useState("");

  const { data: objects = [], isLoading } = useMyObjects();
  const { data: subscription, isLoading: isLoadingSubscription } =
    useMySubscription();
  const { mutate: registerObject, isPending: isRegistering } =
    useRegisterObject();
  const { mutate: reportTheft, isPending: isReporting } = useReportTheft();

  const isPremium = subscription?.plan !== "free";
  const canAddMore = subscription
    ? Number(subscription.objectCount) < Number(subscription.objectLimit)
    : false;
  const isExpired = subscription?.isExpired ?? false;

  const handleRegisterObject = () => {
    if (!brand.trim() || !model.trim() || !identifier.trim()) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    if (identifier.length < 6) {
      toast.error("O identificador deve ter no mínimo 6 caracteres");
      return;
    }

    const objectTypeVariant: ObjectType = (() => {
      switch (objType) {
        case "phone":
          return { __kind__: "phone", phone: null };
        case "bike":
          return { __kind__: "bike", bike: null };
        case "notebook":
          return { __kind__: "notebook", notebook: null };
        default:
          return { __kind__: "other", other: "" };
      }
    })();

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
      },
    );
  };

  const handleReportTheft = () => {
    if (!selectedObject) return;
    if (!boNumber.trim() || !location.trim()) {
      toast.error("Preencha o número do B.O. e o local do ocorrido");
      return;
    }

    const now = Date.now();
    reportTheft(
      {
        objectId: selectedObject.id,
        boNumber: boNumber.trim(),
        latitude: BigInt(-3850000),
        longitude: BigInt(-38500000),
        date: BigInt(now * 1000000),
        location: location.trim(),
      },
      {
        onSuccess: () => {
          toast.success(
            "Roubo reportado! Objeto marcado como roubado na rede.",
          );
          setIsReportDialogOpen(false);
          setSelectedObject(null);
          setBoNumber("");
          setLocation("");
        },
        onError: (error) => {
          console.error("Report theft error:", error);
          toast.error("Erro ao reportar roubo. Tente novamente.");
        },
      },
    );
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-secondary text-white shadow-navy">
        <div className="container mx-auto px-4 py-5">
          <h1 className="text-2xl font-display font-bold text-center tracking-tight">
            Meu Baú
          </h1>
          <p className="text-center text-white/70 text-sm mt-1">
            Seus objetos protegidos
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Subscription status */}
        {isLoadingSubscription ? (
          <div className="mb-5 space-y-2">
            <Skeleton className="h-8 w-40 mx-auto rounded-full" />
            <Skeleton className="h-5 w-28 mx-auto" />
          </div>
        ) : (
          subscription && (
            <div className="mb-5 text-center space-y-1.5">
              <Badge
                className={`text-sm px-4 py-1.5 ${
                  isPremium && !isExpired
                    ? "bg-accent text-white"
                    : isExpired
                      ? "bg-red-600 text-white"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {isPremium && !isExpired ? (
                  <>
                    <Crown className="w-3.5 h-3.5 mr-1.5 inline" />
                    Plano Premium
                  </>
                ) : isExpired ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 mr-1.5 inline" />
                    Premium Expirado
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 mr-1.5 inline" />
                    Plano Gratuito
                  </>
                )}
              </Badge>
              <p className="text-sm text-muted-foreground font-medium">
                {Number(subscription.objectCount)}/
                {Number(subscription.objectLimit)} objetos cadastrados
              </p>
              {isPremium && subscription.expirationDate && (
                <p className="text-xs text-muted-foreground">
                  {isExpired ? (
                    <span className="text-red-600 font-bold">
                      Expirou em:{" "}
                      {formatExpirationDate(subscription.expirationDate)}
                    </span>
                  ) : (
                    <span>
                      Expira em:{" "}
                      {formatExpirationDate(subscription.expirationDate)}
                    </span>
                  )}
                </p>
              )}
            </div>
          )
        )}

        {/* Upgrade CTA */}
        {subscription && (!canAddMore || isExpired) && (
          <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-accent/10 mb-6 rounded-2xl">
            <CardContent className="pt-6 pb-6 text-center space-y-4">
              <div className="w-14 h-14 mx-auto bg-accent rounded-2xl flex items-center justify-center">
                {isExpired ? (
                  <AlertTriangle className="w-7 h-7 text-white" />
                ) : (
                  <Crown className="w-7 h-7 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-primary mb-1.5">
                  {isExpired ? "Assinatura Expirada" : "Limite Atingido"}
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {isExpired
                    ? "Sua assinatura Premium expirou. Renove agora!"
                    : `Limite de ${Number(subscription.objectCount)}/${Number(subscription.objectLimit)} objetos atingido.${!isPremium ? " Faça upgrade para Premium!" : ""}`}
                </p>
              </div>
              {(!isPremium || isExpired) && (
                <Button
                  type="button"
                  onClick={() => navigate({ to: "/planos" })}
                  className="bg-accent hover:bg-accent/90 text-white font-bold"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  {isExpired ? "Renovar Agora" : "Fazer Upgrade"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Objects list */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-2 rounded-2xl">
                <CardContent className="pt-6">
                  <Skeleton className="h-12 w-12 mb-4 rounded-xl" />
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : objects.length === 0 ? (
          <Card className="border-2 border-dashed border-primary/20 rounded-2xl">
            <CardContent className="pt-12 pb-12">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-primary mb-1.5">
                    Nenhum objeto cadastrado
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Cadastre seu primeiro bem para protegê-lo na rede CERC
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
                  className={`border-2 hover:shadow-navy transition-all rounded-2xl ${
                    isSafe ? "border-primary/15" : "border-accent"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isSafe ? "bg-primary" : "bg-accent"
                          }`}
                        >
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
                      <Badge
                        className={
                          isSafe
                            ? "bg-primary/10 text-primary border-0"
                            : "bg-accent text-white border-0"
                        }
                      >
                        {isSafe ? "Seguro" : "Roubado"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">ID:</strong>{" "}
                      <span className="font-mono">
                        {maskIdentifier(obj.identifier)}
                      </span>
                    </p>
                    {isSafe && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full border-2 border-accent text-accent hover:bg-accent hover:text-white transition-all"
                        onClick={() => {
                          setSelectedObject(obj);
                          setIsReportDialogOpen(true);
                        }}
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

      {/* Floating add button */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetTrigger asChild>
          <Button
            type="button"
            size="lg"
            className="fixed bottom-20 right-5 w-14 h-14 rounded-full shadow-navy-lg hover:scale-110 transition-transform z-40 bg-accent hover:bg-accent/90"
            disabled={!canAddMore}
            title={
              canAddMore ? "Adicionar objeto" : "Limite de objetos atingido"
            }
          >
            <Plus className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="h-[90vh] overflow-auto rounded-t-2xl"
        >
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl font-display text-primary">
              Cadastrar Novo Objeto
            </SheetTitle>
            <SheetDescription>
              Proteja seu bem registrando-o na rede CERC FORTALEZA
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-5 pb-8">
            <div className="space-y-2">
              <Label className="text-sm font-semibold uppercase tracking-wide text-foreground/60">
                Tipo de Objeto
              </Label>
              <Select
                value={objType}
                onValueChange={(v) => setObjType(v as typeof objType)}
              >
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
              <Label
                htmlFor="brand"
                className="text-sm font-semibold uppercase tracking-wide text-foreground/60"
              >
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
              <Label
                htmlFor="model"
                className="text-sm font-semibold uppercase tracking-wide text-foreground/60"
              >
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
              <Label
                htmlFor="identifier"
                className="text-sm font-semibold uppercase tracking-wide text-foreground/60"
              >
                Identificador Único (IMEI/Chassi/Serial)
              </Label>
              <Input
                id="identifier"
                placeholder="Mínimo de 6 caracteres"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="h-12 border-2"
              />
              <p className="text-xs text-muted-foreground">
                Este número identifica seu objeto de forma única na rede.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleRegisterObject}
              disabled={isRegistering}
              className="w-full h-12 font-bold bg-primary hover:bg-primary/90 mt-4"
            >
              {isRegistering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                "Cadastrar Objeto"
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Report theft dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-accent">
              Reportar Roubo
            </DialogTitle>
            <DialogDescription>
              {selectedObject &&
                `${selectedObject.brand} ${selectedObject.model}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="boNumber"
                className="text-sm font-semibold uppercase tracking-wide text-foreground/60"
              >
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
                Obrigatório para validar o reporte e evitar trotes
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-sm font-semibold uppercase tracking-wide text-foreground/60"
              >
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

            <div className="bg-accent/10 border-2 border-accent/20 rounded-xl p-4">
              <p className="text-sm text-accent font-medium">
                ⚠️ Após confirmar, este objeto será marcado como{" "}
                <strong>ROUBADO</strong> em toda a rede instantaneamente.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleReportTheft}
              disabled={isReporting}
              className="w-full h-12 font-bold bg-accent hover:bg-accent/90 text-white"
            >
              {isReporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
