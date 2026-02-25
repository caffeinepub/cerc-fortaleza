import { Phone, MapPin, ExternalLink, Copy, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";

interface EmergencyContact {
  name: string;
  phone: string;
  description?: string;
  address?: string;
  type: "emergency" | "delegacia";
}

const emergencyContacts: EmergencyContact[] = [
  { 
    name: "190 - Polícia Militar", 
    phone: "190", 
    description: "Emergências policiais e ocorrências em andamento",
    type: "emergency"
  },
  { 
    name: "193 - Corpo de Bombeiros", 
    phone: "193", 
    description: "Emergências médicas, incêndios e resgates",
    type: "emergency"
  },
  { 
    name: "197 - Polícia Civil", 
    phone: "197", 
    description: "Denúncias e ocorrências policiais",
    type: "emergency"
  },
  { 
    name: "Delegacia - Aldeota", 
    phone: "(85) 3101-0197", 
    address: "Av. Santos Dumont, 2350",
    type: "delegacia"
  },
  { 
    name: "Delegacia - Centro", 
    phone: "(85) 3101-3435", 
    address: "Rua São José, 75",
    type: "delegacia"
  },
  { 
    name: "Delegacia - Messejana", 
    phone: "(85) 3101-7491", 
    address: "Av. Frei Cirilo, 3480",
    type: "delegacia"
  },
];

export function SOSTab() {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const handleCopyPhone = (phone: string) => {
    const numbersOnly = phone.replace(/\D/g, "");
    navigator.clipboard.writeText(numbersOnly);
    toast.success("Telefone copiado!");
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const handleCall = (phone: string) => {
    const numbersOnly = phone.replace(/\D/g, "");
    window.location.href = `tel:${numbersOnly}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-background to-red-50 dark:from-red-950/10 dark:via-background dark:to-red-950/10">
      {/* Header */}
      <header className="bg-accent text-accent-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-center tracking-tight">
            Guia de Emergências
          </h1>
          <p className="text-center text-accent-foreground/90 text-sm md:text-base mt-2">
            Contatos importantes de Fortaleza
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* B.O. Civil Card */}
        <Card className="border-2 border-primary shadow-xl mb-8 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shrink-0">
                <ExternalLink className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl font-display text-primary">
                  Registrar B.O. Online
                </CardTitle>
                <CardDescription className="text-base">
                  Faça seu Boletim de Ocorrência pela internet
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Para casos de roubo ou furto, registre seu boletim de ocorrência de forma rápida e segura no site oficial da Polícia Civil do Ceará.
            </p>
            <a 
              href="https://bo.ssp.ce.gov.br" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button className="w-full h-12 text-base font-bold">
                <ExternalLink className="w-5 h-5 mr-2" />
                Acessar B.O. Civil
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Emergency Numbers */}
        <div className="mb-6">
          <h2 className="text-xl font-display font-bold text-primary mb-4">
            Números de Emergência
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {emergencyContacts
              .filter(contact => contact.type === "emergency")
              .map((contact) => (
                <Card 
                  key={contact.phone} 
                  className="border-2 border-accent/30 hover:border-accent hover:shadow-lg transition-all"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <Badge variant="destructive" className="text-base font-bold px-3 py-1">
                        {contact.phone}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-display text-foreground">
                      {contact.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {contact.description}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCall(contact.phone)}
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Ligar
                      </Button>
                      <Button
                        onClick={() => handleCopyPhone(contact.phone)}
                        size="sm"
                        variant="outline"
                      >
                        {copiedPhone === contact.phone ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Delegacias */}
        <div>
          <h2 className="text-xl font-display font-bold text-primary mb-4">
            Delegacias em Fortaleza
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {emergencyContacts
              .filter(contact => contact.type === "delegacia")
              .map((contact) => (
                <Card 
                  key={contact.phone} 
                  className="border-2 border-primary/20 hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-display text-primary mb-2">
                          {contact.name}
                        </CardTitle>
                        {contact.address && (
                          <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
                            <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                            <span>{contact.address}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-base font-semibold text-foreground">
                            {contact.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCall(contact.phone)}
                        size="sm"
                        className="flex-1"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Ligar
                      </Button>
                      <Button
                        onClick={() => handleCopyPhone(contact.phone)}
                        size="sm"
                        variant="outline"
                      >
                        {copiedPhone === contact.phone ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Info Card */}
        <Card className="mt-8 border-accent/20 bg-accent/5">
          <CardContent className="pt-6">
            <div className="space-y-3 text-sm text-foreground/80">
              <p className="flex items-start gap-2">
                <span className="text-accent font-bold">⚠️</span>
                <span>Em caso de emergência, ligue para 190 (PM) ou 193 (Bombeiros)</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-accent font-bold">📱</span>
                <span>Mantenha sempre o número do B.O. anotado ao reportar roubos</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-accent font-bold">🔒</span>
                <span>Estes dados funcionam offline após o primeiro acesso</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
