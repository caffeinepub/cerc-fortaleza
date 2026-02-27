import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Copy, ExternalLink, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EmergencyContact {
  name: string;
  phone: string;
  description?: string;
  address?: string;
  type: "emergency" | "delegacia";
}

const emergencyContacts: EmergencyContact[] = [
  {
    name: "Polícia Militar",
    phone: "190",
    description: "Emergências policiais e ocorrências em andamento",
    type: "emergency",
  },
  {
    name: "Corpo de Bombeiros",
    phone: "193",
    description: "Emergências médicas, incêndios e resgates",
    type: "emergency",
  },
  {
    name: "Polícia Civil",
    phone: "197",
    description: "Denúncias e ocorrências criminais",
    type: "emergency",
  },
  {
    name: "Delegacia — Aldeota",
    phone: "(85) 3101-0197",
    address: "Av. Santos Dumont, 2350 — Aldeota",
    type: "delegacia",
  },
  {
    name: "Delegacia — Centro",
    phone: "(85) 3101-3435",
    address: "Rua São José, 75 — Centro",
    type: "delegacia",
  },
  {
    name: "Delegacia — Messejana",
    phone: "(85) 3101-7491",
    address: "Av. Frei Cirilo, 3480 — Messejana",
    type: "delegacia",
  },
  {
    name: "DEIC — Crimes Digitais",
    phone: "(85) 3257-8850",
    address: "Av. Bezerra de Menezes, 1701 — São Gerardo",
    type: "delegacia",
  },
];

export function SOSTab() {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const handleCopyPhone = (phone: string) => {
    const numbersOnly = phone.replace(/\D/g, "");
    navigator.clipboard.writeText(numbersOnly).then(() => {
      toast.success("Telefone copiado!");
      setCopiedPhone(phone);
      setTimeout(() => setCopiedPhone(null), 2000);
    });
  };

  const handleCall = (phone: string) => {
    const numbersOnly = phone.replace(/\D/g, "");
    window.location.href = `tel:${numbersOnly}`;
  };

  const emergencies = emergencyContacts.filter((c) => c.type === "emergency");
  const delegacias = emergencyContacts.filter((c) => c.type === "delegacia");

  return (
    <div className="min-h-full bg-gradient-to-br from-accent/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-accent text-white shadow-navy">
        <div className="container mx-auto px-4 py-5">
          <h1 className="text-2xl font-display font-bold text-center tracking-tight">
            Guia SOS — Fortaleza
          </h1>
          <p className="text-center text-white/70 text-sm mt-1">
            Contatos de emergência e delegacias
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* B.O. Civil quick access */}
        <Card className="border-2 border-primary shadow-navy mb-8 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0">
                <ExternalLink className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-display text-primary">
                  Registrar B.O. Online
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Boletim de Ocorrência online pelo site da Polícia Civil do
                  Ceará
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Registre seu B.O. de roubo ou furto de forma rápida e segura sem
              sair de casa. Guarde o número do B.O. para reportar o roubo no
              CERC.
            </p>
            <a
              href="https://bo.ssp.ce.gov.br"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                type="button"
                className="w-full h-12 font-bold bg-primary hover:bg-primary/90"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Acessar B.O. Civil Online
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Emergency numbers */}
        <section className="mb-8">
          <h2 className="text-xl font-display font-bold text-foreground mb-4">
            Números de Emergência
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {emergencies.map((contact) => (
              <Card
                key={contact.phone}
                className="border-2 border-accent/25 hover:border-accent hover:shadow-navy transition-all rounded-2xl"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <Badge className="bg-accent text-white text-base font-bold px-3 py-1 border-0">
                      {contact.phone}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-display text-foreground">
                    {contact.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {contact.description}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => handleCall(contact.phone)}
                      size="sm"
                      className="flex-1 bg-accent hover:bg-accent/90"
                    >
                      <Phone className="w-4 h-4 mr-1.5" />
                      Ligar
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleCopyPhone(contact.phone)}
                      size="sm"
                      variant="outline"
                      className="border-2"
                      aria-label="Copiar número"
                    >
                      {copiedPhone === contact.phone ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Delegacias */}
        <section>
          <h2 className="text-xl font-display font-bold text-foreground mb-4">
            Delegacias em Fortaleza
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {delegacias.map((contact) => (
              <Card
                key={contact.phone}
                className="border-2 border-primary/15 hover:shadow-navy transition-all rounded-2xl"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-display text-primary">
                    {contact.name}
                  </CardTitle>
                  {contact.address && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                      <span>{contact.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">
                      {contact.phone}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => handleCall(contact.phone)}
                      size="sm"
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      <Phone className="w-4 h-4 mr-1.5" />
                      Ligar
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleCopyPhone(contact.phone)}
                      size="sm"
                      variant="outline"
                      className="border-2"
                      aria-label="Copiar número"
                    >
                      {copiedPhone === contact.phone ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tips */}
        <Card className="mt-8 border-accent/20 bg-accent/5 rounded-2xl">
          <CardContent className="pt-5 pb-5">
            <div className="space-y-2.5 text-sm text-foreground/70">
              {[
                [
                  "⚠️",
                  "Em caso de emergência, ligue imediatamente para 190 (PM) ou 193 (Bombeiros)",
                ],
                [
                  "📋",
                  "Mantenha sempre o número do B.O. anotado após registrar um roubo",
                ],
                [
                  "📶",
                  "Os endereços das delegacias funcionam offline após o primeiro acesso",
                ],
              ].map(([icon, text]) => (
                <p key={text} className="flex items-start gap-2">
                  <span className="shrink-0">{icon}</span>
                  <span>{text}</span>
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
