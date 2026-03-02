import type { UserAdminView } from "@/backend.d";
import { SubscriptionPlan } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
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
import {
  useBlockUser,
  useGetAllUsersAdmin,
  useUnblockUser,
} from "@/hooks/useQueries";
import { Principal } from "@icp-sdk/core/principal";
import {
  Activity,
  AlertCircle,
  Ban,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldOff,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shortenPrincipal(principal: Principal): string {
  const text = principal.toText();
  if (text.length <= 14) return text;
  return `${text.slice(0, 8)}...${text.slice(-4)}`;
}

function formatExpirationDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1_000_000);
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function isExpired(expirationDate: bigint): boolean {
  const expMs = Number(expirationDate) / 1_000_000;
  return expMs < Date.now();
}

function getPlanLabel(plan: SubscriptionPlan): {
  label: string;
  variant: "secondary" | "default" | "outline";
} {
  switch (plan) {
    case SubscriptionPlan.premiumMonthly:
      return { label: "Premium Mensal", variant: "default" };
    case SubscriptionPlan.premiumAnnual:
      return { label: "Premium Anual", variant: "default" };
    default:
      return { label: "Gratuito", variant: "secondary" };
  }
}

// ─── Summary Cards ────────────────────────────────────────────────────────────

interface SummaryData {
  total: number;
  premium: number;
  blocked: number;
  expired: number;
}

function computeSummary(users: UserAdminView[]): SummaryData {
  let premium = 0;
  let blocked = 0;
  let expired = 0;

  for (const u of users) {
    if (u.isBlocked) blocked++;
    if (u.subscription) {
      const plan = u.subscription.plan;
      const expDate = u.subscription.expirationDate;
      if (plan !== SubscriptionPlan.free) {
        if (expDate !== undefined && !isExpired(expDate)) {
          premium++;
        } else if (expDate !== undefined && isExpired(expDate)) {
          expired++;
        } else {
          premium++;
        }
      }
    }
  }

  return { total: users.length, premium, blocked, expired };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function UserManagementTab() {
  const {
    data: users = [],
    isLoading,
    refetch,
    isFetching,
  } = useGetAllUsersAdmin();
  const blockUser = useBlockUser();
  const unblockUser = useUnblockUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const summary = useMemo(() => computeSummary(users), [users]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return users;
    return users.filter((u) => {
      const name = (u.profile?.name ?? "").toLowerCase();
      const principalShort = shortenPrincipal(u.principal).toLowerCase();
      const principalFull = u.principal.toText().toLowerCase();
      return (
        name.includes(term) ||
        principalShort.includes(term) ||
        principalFull.includes(term)
      );
    });
  }, [users, searchTerm]);

  async function handleBlock(user: UserAdminView) {
    const pid = user.principal.toText();
    setPendingAction(pid);
    try {
      const principal = Principal.fromText(pid);
      await blockUser.mutateAsync(principal);
      toast.success("Usuário bloqueado com sucesso.");
    } catch {
      toast.error("Erro ao bloquear usuário. Tente novamente.");
    } finally {
      setPendingAction(null);
    }
  }

  async function handleUnblock(user: UserAdminView) {
    const pid = user.principal.toText();
    setPendingAction(pid);
    try {
      const principal = Principal.fromText(pid);
      await unblockUser.mutateAsync(principal);
      toast.success("Acesso do usuário liberado.");
    } catch {
      toast.error("Erro ao liberar usuário. Tente novamente.");
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          icon={Users}
          label="Total de Usuários"
          value={summary.total}
          color="text-primary"
          bg="bg-primary/10"
          loading={isLoading}
        />
        <SummaryCard
          icon={Shield}
          label="Usuários Premium"
          value={summary.premium}
          color="text-amber-600"
          bg="bg-amber-50"
          loading={isLoading}
        />
        <SummaryCard
          icon={ShieldOff}
          label="Usuários Bloqueados"
          value={summary.blocked}
          color="text-destructive"
          bg="bg-destructive/10"
          loading={isLoading}
        />
        <SummaryCard
          icon={Clock}
          label="Assinaturas Expiradas"
          value={summary.expired}
          color="text-orange-500"
          bg="bg-orange-50"
          loading={isLoading}
        />
      </div>

      {/* Users table */}
      <Card className="border-2 border-border shadow-navy rounded-2xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-display font-bold text-primary flex items-center gap-2">
              <Users className="w-5 h-5" />
              Gerenciar Usuários
            </CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por nome ou ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 focus-visible:ring-primary"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                disabled={isFetching}
                className="border-2 shrink-0"
                aria-label="Atualizar lista"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {["s1", "s2", "s3", "s4"].map((k) => (
                <Skeleton key={k} className="h-14 w-full" />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-14 h-14 mx-auto text-muted-foreground/20 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                {searchTerm.trim()
                  ? "Nenhum usuário encontrado com esse filtro"
                  : "Nenhum usuário cadastrado ainda"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchTerm.trim()
                  ? "Tente buscar por outro termo"
                  : "Usuários aparecerão aqui após se cadastrarem"}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="font-bold text-primary">
                        ID
                      </TableHead>
                      <TableHead className="font-bold text-primary">
                        Nome
                      </TableHead>
                      <TableHead className="font-bold text-primary">
                        Plano
                      </TableHead>
                      <TableHead className="font-bold text-primary">
                        Assinatura
                      </TableHead>
                      <TableHead className="font-bold text-primary">
                        Acesso
                      </TableHead>
                      <TableHead className="font-bold text-primary text-right">
                        Ação
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <UserRow
                        key={user.principal.toText()}
                        user={user}
                        isPending={pendingAction === user.principal.toText()}
                        onBlock={() => handleBlock(user)}
                        onUnblock={() => handleUnblock(user)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile cards */}
              <div className="lg:hidden space-y-3">
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.principal.toText()}
                    user={user}
                    isPending={pendingAction === user.principal.toText()}
                    onBlock={() => handleBlock(user)}
                    onUnblock={() => handleUnblock(user)}
                  />
                ))}
              </div>

              {searchTerm.trim() && (
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Mostrando {filteredUsers.length} de {users.length} usuários
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Diagnóstico */}
      <DiagnosticSection summary={summary} />
    </div>
  );
}

// ─── Summary Card ─────────────────────────────────────────────────────────────

interface SummaryCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  bg: string;
  loading: boolean;
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
  loading,
}: SummaryCardProps) {
  return (
    <Card className="border-2 border-border hover:border-primary/30 transition-colors rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-xs font-medium text-muted-foreground leading-tight">
          {label}
        </p>
        <div
          className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center shrink-0`}
        >
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <p
            className={`text-3xl font-display font-extrabold ${color} tracking-tight`}
          >
            {value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Subscription Status ──────────────────────────────────────────────────────

function SubscriptionStatus({ user }: { user: UserAdminView }) {
  const sub = user.subscription;
  if (!sub || sub.plan === SubscriptionPlan.free) {
    return <span className="text-muted-foreground text-sm">N/A</span>;
  }
  if (sub.expirationDate !== undefined) {
    if (isExpired(sub.expirationDate)) {
      return (
        <span className="flex items-center gap-1.5 text-sm text-destructive font-medium">
          <AlertCircle className="w-3.5 h-3.5" />
          Expirada
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Ativa até {formatExpirationDate(sub.expirationDate)}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
      <Activity className="w-3.5 h-3.5" />
      Ativa
    </span>
  );
}

// ─── User Row (Desktop) ───────────────────────────────────────────────────────

interface UserRowProps {
  user: UserAdminView;
  isPending: boolean;
  onBlock: () => void;
  onUnblock: () => void;
}

function UserRow({ user, isPending, onBlock, onUnblock }: UserRowProps) {
  const planInfo = user.subscription
    ? getPlanLabel(user.subscription.plan)
    : getPlanLabel(SubscriptionPlan.free);

  return (
    <TableRow className="hover:bg-muted/30 transition-colors">
      <TableCell className="font-mono text-xs text-muted-foreground">
        {shortenPrincipal(user.principal)}
      </TableCell>
      <TableCell className="font-medium">
        {user.profile?.name ?? (
          <span className="text-muted-foreground italic">Sem perfil</span>
        )}
      </TableCell>
      <TableCell>
        <PlanBadge
          plan={user.subscription?.plan ?? SubscriptionPlan.free}
          label={planInfo.label}
        />
      </TableCell>
      <TableCell>
        <SubscriptionStatus user={user} />
      </TableCell>
      <TableCell>
        <AccessBadge isBlocked={user.isBlocked} />
      </TableCell>
      <TableCell className="text-right">
        <ActionButton
          isBlocked={user.isBlocked}
          isPending={isPending}
          onBlock={onBlock}
          onUnblock={onUnblock}
        />
      </TableCell>
    </TableRow>
  );
}

// ─── User Card (Mobile) ───────────────────────────────────────────────────────

function UserCard({ user, isPending, onBlock, onUnblock }: UserRowProps) {
  const planInfo = user.subscription
    ? getPlanLabel(user.subscription.plan)
    : getPlanLabel(SubscriptionPlan.free);

  return (
    <Card className="border border-border rounded-xl">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold truncate">
              {user.profile?.name ?? (
                <span className="text-muted-foreground italic font-normal">
                  Sem perfil
                </span>
              )}
            </p>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">
              {shortenPrincipal(user.principal)}
            </p>
          </div>
          <AccessBadge isBlocked={user.isBlocked} />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <PlanBadge
            plan={user.subscription?.plan ?? SubscriptionPlan.free}
            label={planInfo.label}
          />
          <SubscriptionStatus user={user} />
        </div>

        <ActionButton
          isBlocked={user.isBlocked}
          isPending={isPending}
          onBlock={onBlock}
          onUnblock={onUnblock}
          fullWidth
        />
      </CardContent>
    </Card>
  );
}

// ─── Reusable UI Atoms ────────────────────────────────────────────────────────

function PlanBadge({ plan, label }: { plan: SubscriptionPlan; label: string }) {
  if (plan === SubscriptionPlan.free) {
    return (
      <Badge variant="secondary" className="text-xs font-semibold">
        {label}
      </Badge>
    );
  }
  if (plan === SubscriptionPlan.premiumAnnual) {
    return (
      <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100">
        {label}
      </Badge>
    );
  }
  // premiumMonthly
  return (
    <Badge className="bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold hover:bg-amber-100">
      {label}
    </Badge>
  );
}

function AccessBadge({ isBlocked }: { isBlocked: boolean }) {
  if (isBlocked) {
    return (
      <Badge className="bg-destructive/10 text-destructive border border-destructive/20 text-xs font-semibold flex items-center gap-1 hover:bg-destructive/10">
        <Ban className="w-3 h-3" />
        Bloqueado
      </Badge>
    );
  }
  return (
    <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1 hover:bg-emerald-100">
      <CheckCircle2 className="w-3 h-3" />
      Liberado
    </Badge>
  );
}

interface ActionButtonProps {
  isBlocked: boolean;
  isPending: boolean;
  onBlock: () => void;
  onUnblock: () => void;
  fullWidth?: boolean;
}

function ActionButton({
  isBlocked,
  isPending,
  onBlock,
  onUnblock,
  fullWidth,
}: ActionButtonProps) {
  const widthClass = fullWidth ? "w-full" : "";

  if (isBlocked) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onUnblock}
        disabled={isPending}
        className={`border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 ${widthClass}`}
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
        ) : (
          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
        )}
        Liberar Acesso
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onBlock}
      disabled={isPending}
      className={`border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive ${widthClass}`}
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
      ) : (
        <Ban className="w-3.5 h-3.5 mr-1.5" />
      )}
      Bloquear
    </Button>
  );
}

// ─── Diagnostic Section ───────────────────────────────────────────────────────

function DiagnosticSection({ summary }: { summary: SummaryData }) {
  const hasIssues = summary.blocked > 0 || summary.expired > 0;

  return (
    <Card className="border-2 border-primary/20 bg-primary/5 rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-display font-bold text-primary flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" />
          Diagnóstico do Sistema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <DiagItem
            icon={Shield}
            color="text-emerald-600"
            label="Assinaturas Premium ativas"
            value={`${summary.premium} usuário${summary.premium !== 1 ? "s" : ""}`}
          />
          <DiagItem
            icon={Clock}
            color="text-orange-500"
            label="Assinaturas expiradas"
            value={`${summary.expired} usuário${summary.expired !== 1 ? "s" : ""}`}
          />
          <DiagItem
            icon={Ban}
            color="text-destructive"
            label="Acessos bloqueados"
            value={`${summary.blocked} usuário${summary.blocked !== 1 ? "s" : ""}`}
          />
        </div>

        <div className="border-t border-primary/10 pt-3">
          <p className="text-sm text-foreground/80 leading-relaxed">
            {hasIssues ? (
              <>
                <span className="font-semibold text-primary">Status:</span>{" "}
                {summary.blocked > 0 && (
                  <span className="text-destructive font-medium">
                    {summary.blocked} usuário{summary.blocked !== 1 ? "s" : ""}{" "}
                    com acesso bloqueado.{" "}
                  </span>
                )}
                {summary.expired > 0 && (
                  <span className="text-orange-600 font-medium">
                    {summary.expired} assinatura
                    {summary.expired !== 1 ? "s" : ""} expirada
                    {summary.expired !== 1 ? "s" : ""} que precisam de
                    renovação.{" "}
                  </span>
                )}
                Revise os usuários na tabela acima para tomar as ações
                necessárias.
              </>
            ) : (
              <span className="text-emerald-700 font-medium">
                ✓ Todos os {summary.total} usuários estão com acesso liberado e
                sem assinaturas expiradas.
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function DiagItem({
  icon: Icon,
  color,
  label,
  value,
}: {
  icon: React.ElementType;
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5 bg-background rounded-xl p-3 border border-border">
      <div className={`mt-0.5 shrink-0 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`font-bold text-sm ${color}`}>{value}</p>
      </div>
    </div>
  );
}
