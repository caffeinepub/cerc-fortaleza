import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useGetAllLeads, useGetStats } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  CreditCard,
  Home,
  Loader2,
  LogOut,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

export function AdminPanel() {
  const { logout } = useAuth();
  const { data: leads = [], isLoading: leadsLoading } = useGetAllLeads();
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLeads = useMemo(() => {
    if (!searchTerm.trim()) return leads;
    const term = searchTerm.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(term) ||
        lead.whatsapp.includes(term.replace(/\D/g, "")),
    );
  }, [leads, searchTerm]);

  const formatWhatsApp = (whatsapp: string): string => {
    const numbers = whatsapp.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const formatTimestamp = (timestamp: bigint): string => {
    const date = new Date(Number(timestamp) / 1_000_000);
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    const h = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${d}/${m}/${y} ${h}:${min}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-secondary border-b border-white/10 sticky top-0 z-50 shadow-navy">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <img
                src="/assets/uploads/LOGO-BRANCO-1.png"
                alt="CERC FORTALEZA"
                className="h-10 md:h-12 w-auto"
              />
              <h1 className="text-lg md:text-xl font-display font-bold text-white hidden sm:block">
                Painel Administrativo
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/admin/stripe-config">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="font-semibold border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Stripe
                </Button>
              </Link>
              <Link to="/">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="font-semibold border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Site
                </Button>
              </Link>
              <Button
                type="button"
                onClick={logout}
                size="sm"
                className="font-semibold bg-accent hover:bg-accent/90 text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
            {
              label: "Total de Cadastros",
              value: stats?.total,
              icon: Users,
              color: "text-primary",
              bg: "bg-primary/10",
            },
            {
              label: "Cadastros Hoje",
              value: stats?.today,
              icon: TrendingUp,
              color: "text-accent",
              bg: "bg-accent/10",
            },
            {
              label: "Esta Semana",
              value: stats?.thisWeek,
              icon: Calendar,
              color: "text-primary",
              bg: "bg-primary/10",
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <Card
              key={label}
              className="border-2 border-border hover:border-primary/30 transition-colors rounded-2xl"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {label}
                </CardTitle>
                <div
                  className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  <div
                    className={`text-4xl font-display font-extrabold ${color} tracking-tight`}
                  >
                    {value?.toString() ?? "0"}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Leads table */}
        <Card className="border-2 border-border shadow-navy rounded-2xl">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-2xl font-display font-bold text-primary">
                Cadastros Recebidos
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por nome ou telefone"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 focus-visible:ring-primary"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {leadsLoading ? (
              <div className="space-y-3">
                {["s1", "s2", "s3", "s4", "s5"].map((k) => (
                  <Skeleton key={k} className="h-12 w-full" />
                ))}
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-14 h-14 mx-auto text-muted-foreground/20 mb-4" />
                <p className="text-lg text-muted-foreground font-medium">
                  {searchTerm.trim()
                    ? "Nenhum cadastro encontrado com esse filtro"
                    : "Nenhum cadastro ainda"}
                </p>
                <p className="text-sm text-muted-foreground mt-1.5">
                  {searchTerm.trim()
                    ? "Tente buscar por outro termo"
                    : "Os cadastros aparecerão aqui quando forem enviados"}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="font-bold text-primary">
                          Nome
                        </TableHead>
                        <TableHead className="font-bold text-primary">
                          WhatsApp
                        </TableHead>
                        <TableHead className="font-bold text-primary">
                          Data/Hora
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.map((lead) => (
                        <TableRow
                          key={`${lead.whatsapp}-${lead.timestamp.toString()}`}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <TableCell className="font-medium">
                            {lead.name}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {formatWhatsApp(lead.whatsapp)}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {formatTimestamp(lead.timestamp)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden space-y-3">
                  {filteredLeads.map((lead) => (
                    <Card
                      key={`mobile-${lead.whatsapp}-${lead.timestamp.toString()}`}
                      className="border border-border rounded-xl"
                    >
                      <CardContent className="p-4 space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide mb-0.5">
                            Nome
                          </p>
                          <p className="font-semibold">{lead.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide mb-0.5">
                            WhatsApp
                          </p>
                          <p className="font-mono text-sm">
                            {formatWhatsApp(lead.whatsapp)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide mb-0.5">
                            Data/Hora
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatTimestamp(lead.timestamp)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {searchTerm.trim() && (
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    Mostrando {filteredLeads.length} de {leads.length} cadastros
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
