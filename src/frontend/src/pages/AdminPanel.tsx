import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAllLeads, useGetStats } from "@/hooks/useQueries";
import { useAuth } from "@/contexts/AuthContext";
import { Users, TrendingUp, Calendar, LogOut, Home, Loader2, Search, CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
        lead.whatsapp.includes(term.replace(/\D/g, ""))
    );
  }, [leads, searchTerm]);

  const formatWhatsApp = (whatsapp: string): string => {
    const numbers = whatsapp.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const formatTimestamp = (timestamp: bigint): string => {
    const date = new Date(Number(timestamp) / 1_000_000);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-secondary border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <img
                src="/assets/uploads/LOGO-BRANCO-1.png"
                alt="CERC FORTALEZA"
                className="w-auto h-12 md:h-14"
              />
              <h1 className="text-xl md:text-2xl font-display font-bold text-primary hidden sm:block">
                Painel Administrativo
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/admin/stripe-config">
                <Button variant="outline" size="sm" className="font-semibold">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Config. Stripe
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="sm" className="font-semibold">
                  <Home className="w-4 h-4 mr-2" />
                  Voltar ao Site
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="destructive"
                size="sm"
                className="font-semibold bg-accent hover:bg-accent/90"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Cadastros
              </CardTitle>
              <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-10 w-24" />
              ) : (
                <div className="text-3xl md:text-4xl font-display font-bold text-primary">
                  {stats?.total.toString() || "0"}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cadastros Hoje
              </CardTitle>
              <div className="w-12 h-12 bg-accent/15 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-10 w-24" />
              ) : (
                <div className="text-3xl md:text-4xl font-display font-bold text-accent">
                  {stats?.today.toString() || "0"}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cadastros Esta Semana
              </CardTitle>
              <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-10 w-24" />
              ) : (
                <div className="text-3xl md:text-4xl font-display font-bold text-primary">
                  {stats?.thisWeek.toString() || "0"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Leads Table */}
        <Card className="border-2 border-border shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-2xl font-display font-bold text-primary">
                Cadastros Recebidos
              </CardTitle>
              <div className="relative w-full sm:w-64">
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
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-lg text-muted-foreground font-medium">
                  {searchTerm.trim()
                    ? "Nenhum cadastro encontrado com esse filtro"
                    : "Nenhum cadastro ainda"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchTerm.trim()
                    ? "Tente buscar por outro termo"
                    : "Os cadastros aparecerão aqui quando forem enviados"}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead className="font-bold text-primary">Nome</TableHead>
                        <TableHead className="font-bold text-primary">WhatsApp</TableHead>
                        <TableHead className="font-bold text-primary">Data/Hora</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.map((lead, index) => (
                        <TableRow
                          key={index}
                          className="hover:bg-secondary/30 transition-colors"
                        >
                          <TableCell className="font-medium">{lead.name}</TableCell>
                          <TableCell className="font-mono">
                            {formatWhatsApp(lead.whatsapp)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatTimestamp(lead.timestamp)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {filteredLeads.map((lead, index) => (
                    <Card key={index} className="border border-border">
                      <CardContent className="p-4 space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                            Nome
                          </p>
                          <p className="text-base font-semibold text-foreground">
                            {lead.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                            WhatsApp
                          </p>
                          <p className="text-base font-mono text-foreground">
                            {formatWhatsApp(lead.whatsapp)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
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
