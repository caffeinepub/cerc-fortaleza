import { CompraSeguraBadge } from "@/components/CompraSeguraBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Store,
} from "lucide-react";
import { useState } from "react";

const stores = [
  {
    id: 1,
    name: "TechPhone Fortaleza",
    category: "Celulares",
    neighborhood: "Meireles",
    emoji: "📱",
    whatsapp: "5585999990001",
    description: "Especialistas em celulares novos e seminovos com garantia.",
  },
  {
    id: 2,
    name: "BikeShop CE",
    category: "Bicicletas",
    neighborhood: "Aldeota",
    emoji: "🚲",
    whatsapp: "5585999990002",
    description: "A maior loja de bicicletas do Ceará, com todas as marcas.",
  },
  {
    id: 3,
    name: "EletroCenter",
    category: "Eletrônicos",
    neighborhood: "Centro",
    emoji: "💻",
    whatsapp: "5585999990003",
    description: "Eletrônicos, informática e acessórios com nota fiscal.",
  },
  {
    id: 4,
    name: "MotoAcessórios CE",
    category: "Acessórios",
    neighborhood: "Parangaba",
    emoji: "🎧",
    whatsapp: "5585999990004",
    description: "Capacetes, luvas e acessórios para motociclistas.",
  },
  {
    id: 5,
    name: "SmartStore Fortaleza",
    category: "Celulares",
    neighborhood: "Bairro de Fátima",
    emoji: "📱",
    whatsapp: "5585999990005",
    description: "Celulares homologados pela Anatel com assistência técnica.",
  },
  {
    id: 6,
    name: "CicloMania",
    category: "Bicicletas",
    neighborhood: "Varjota",
    emoji: "🚲",
    whatsapp: "5585999990006",
    description: "Bicicletas urbanas, mountain bike e peças originais.",
  },
];

const categories = [
  "Todos",
  "Celulares",
  "Bicicletas",
  "Eletrônicos",
  "Acessórios",
];

const categoryColors: Record<string, string> = {
  Celulares: "bg-blue-100 text-blue-800 border-blue-200",
  Bicicletas: "bg-green-100 text-green-800 border-green-200",
  Eletrônicos: "bg-purple-100 text-purple-800 border-purple-200",
  Acessórios: "bg-orange-100 text-orange-800 border-orange-200",
};

export function LojasPage() {
  const [activeFilter, setActiveFilter] = useState("Todos");

  const filtered =
    activeFilter === "Todos"
      ? stores
      : stores.filter((s) => s.category === activeFilter);

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="bg-secondary border-b border-white/10 sticky top-0 z-50 shadow-navy">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <img
            src="/assets/uploads/LOGO-BRANCO-1.png"
            alt="CERC Fortaleza"
            className="h-8 w-auto"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/assets/uploads/LOGO-COM-NOME-1-1.png";
            }}
          />
          <span className="text-white font-display font-bold text-lg hidden sm:block">
            Lojas Parceiras
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-secondary text-white py-12 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="flex justify-center mb-4">
            <CompraSeguraBadge size="lg" />
          </div>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl mb-4">
            Lojas Parceiras CERC
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-xl mx-auto">
            Estas lojas foram verificadas e utilizam o CERC para proteger seus
            clientes. Ao comprar em uma loja parceira, você garante a
            procedência do produto e pode registrá-lo no CERC com apenas um
            clique.
          </p>
        </div>
      </section>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              data-ocid="lojas.filter.tab"
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                activeFilter === cat
                  ? "bg-primary text-white border-primary shadow-navy"
                  : "bg-white text-foreground border-border hover:border-primary/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stores grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((store, idx) => (
            <Card
              key={store.id}
              data-ocid={`lojas.store.card.${idx + 1}`}
              className="border-2 border-border hover:border-primary/30 hover:shadow-navy transition-all rounded-2xl overflow-hidden group"
            >
              <CardContent className="p-5">
                {/* Store avatar */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center text-3xl flex-shrink-0 border border-border">
                    {store.emoji}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-foreground text-base leading-tight truncate">
                      {store.name}
                    </h3>
                    <span
                      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border mt-1 ${categoryColors[store.category]}`}
                    >
                      {store.category}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {store.description}
                </p>

                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{store.neighborhood}</span>
                </div>

                {/* Compra Segura badge */}
                <div className="mb-4">
                  <CompraSeguraBadge size="sm" />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors"
                  onClick={() =>
                    window.open(`https://wa.me/${store.whatsapp}`, "_blank")
                  }
                >
                  <Store className="w-3.5 h-3.5 mr-1.5" />
                  Ver Loja
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Partner CTA */}
        <section className="mt-16 rounded-3xl bg-gradient-to-br from-secondary to-primary p-8 md:p-12 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-accent" />
            </div>
          </div>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl mb-3">
            Torne-se um Parceiro CERC
          </h2>
          <p className="text-white/80 text-base leading-relaxed max-w-lg mx-auto mb-8">
            Exiba o Selo Compra Segura na sua loja e ganhe a confiança dos
            clientes. Parceiros CERC têm prioridade nas buscas e acessam
            ferramentas exclusivas de gestão de estoque e prevenção contra
            receptação.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              data-ocid="lojas.partner_cta.button"
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8"
              onClick={() =>
                window.open(
                  "https://wa.me/5585999990000?text=Olá!%20Quero%20ser%20um%20parceiro%20CERC.",
                  "_blank",
                )
              }
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Falar com nossa equipe
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/40 text-white hover:bg-white/10 px-8"
              onClick={() => window.open("/planos", "_self")}
            >
              Ver planos
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()}. Construído com ❤️ usando{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
