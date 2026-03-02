import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useIsAdminPasswordSet,
  useSetAdminPassword,
  useVerifyAdminPassword,
} from "@/hooks/useQueries";
import { hashPassword } from "@/utils/hashPassword";
import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { type ReactNode, useState } from "react";

const SESSION_KEY = "admin_password_verified";

interface AdminPasswordGateProps {
  children: ReactNode;
}

export function AdminPasswordGate({ children }: AdminPasswordGateProps) {
  const [isVerified, setIsVerified] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true",
  );

  const { data: isPasswordSet, isLoading: checkingPasswordSet } =
    useIsAdminPasswordSet();

  // If already verified in this session, skip the gate
  if (isVerified) {
    return <>{children}</>;
  }

  if (checkingPasswordSet) {
    return (
      <GateShell>
        <div className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">
            Verificando segurança...
          </p>
        </div>
      </GateShell>
    );
  }

  if (!isPasswordSet) {
    return (
      <SetPasswordForm
        onPasswordSet={() => {
          // After setting the password, prompt the user to enter it
          // Don't auto-grant access — still need to login
        }}
      />
    );
  }

  return (
    <EnterPasswordForm
      onVerified={() => {
        sessionStorage.setItem(SESSION_KEY, "true");
        setIsVerified(true);
      }}
    />
  );
}

// ─── Shell layout ────────────────────────────────────────────────────────────

function GateShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary/90 to-primary/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl px-5 py-3 shadow-navy-lg">
            <img
              src="/assets/uploads/LOGO-COM-NOME-1-1.png"
              alt="CERC FORTALEZA"
              className="h-12 w-auto"
            />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Set Password Form ────────────────────────────────────────────────────────

function SetPasswordForm({ onPasswordSet }: { onPasswordSet: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const setAdminPassword = useSetAdminPassword();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const hash = await hashPassword(password);
      await setAdminPassword.mutateAsync(hash);
      setSuccess(true);
      onPasswordSet();
    } catch {
      setError("Erro ao salvar a senha. Tente novamente.");
    }
  }

  if (success) {
    return (
      <GateShell>
        <EnterPasswordFormInner
          title="Senha Criada com Sucesso"
          description="Agora insira a senha para acessar o painel."
          onVerified={() => {
            sessionStorage.setItem(SESSION_KEY, "true");
            window.location.reload();
          }}
        />
      </GateShell>
    );
  }

  return (
    <GateShell>
      <Card className="border-0 shadow-navy-lg rounded-3xl">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-display font-bold text-primary">
            Criar Senha do Administrador
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Defina uma senha segura para proteger o painel administrativo. Esta
            senha será solicitada sempre que você acessar esta área.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="new-password"
                className="font-semibold text-foreground"
              >
                Nova Senha
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  className="pr-10 border-2 focus-visible:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirm-password"
                className="font-semibold text-foreground"
              >
                Confirmar Senha
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repita a senha"
                  autoComplete="new-password"
                  className="pr-10 border-2 focus-visible:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 rounded-xl"
              disabled={setAdminPassword.isPending}
            >
              {setAdminPassword.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Criar Senha
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </GateShell>
  );
}

// ─── Enter Password Form ──────────────────────────────────────────────────────

interface EnterPasswordFormProps {
  onVerified: () => void;
}

function EnterPasswordForm({ onVerified }: EnterPasswordFormProps) {
  return (
    <GateShell>
      <EnterPasswordFormInner
        title="Acesso Restrito"
        description="Esta área é exclusiva para administradores do CERC FORTALEZA. Insira sua senha para continuar."
        onVerified={onVerified}
      />
    </GateShell>
  );
}

interface EnterPasswordFormInnerProps {
  title: string;
  description: string;
  onVerified: () => void;
}

function EnterPasswordFormInner({
  title,
  description,
  onVerified,
}: EnterPasswordFormInnerProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  const verifyAdminPassword = useVerifyAdminPassword();

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    if (error) setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Digite sua senha.");
      return;
    }

    try {
      const hash = await hashPassword(password);
      const ok = await verifyAdminPassword.mutateAsync(hash);
      if (ok) {
        onVerified();
      } else {
        setAttempts((n) => n + 1);
        setError(
          attempts >= 2
            ? "Senha incorreta. Verifique sua senha e tente novamente."
            : "Senha incorreta.",
        );
        setPassword("");
      }
    } catch {
      setError("Erro ao verificar a senha. Tente novamente.");
    }
  }

  return (
    <Card className="border-0 shadow-navy-lg rounded-3xl">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-display font-bold text-primary">
          {title}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="admin-password"
              className="font-semibold text-foreground"
            >
              Senha do Administrador
            </Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                autoFocus
                className="pr-10 border-2 focus-visible:ring-primary h-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div
              className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2 flex items-center gap-2"
              role="alert"
              aria-live="polite"
            >
              <Lock className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 rounded-xl"
            disabled={verifyAdminPassword.isPending}
          >
            {verifyAdminPassword.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 mr-2" />
                Acessar Painel
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
