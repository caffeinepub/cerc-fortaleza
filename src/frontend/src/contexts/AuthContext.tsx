import { UserRole } from "@/backend.d";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userRole: UserRole;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    identity,
    login: iiLogin,
    clear: iiClear,
    loginStatus,
    isInitializing,
  } = useInternetIdentity();
  const { actor, isFetching } = useActor();

  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.guest);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  // Check admin status when identity or actor changes
  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      if (!actor || !isAuthenticated || isFetching) {
        setIsAdmin(false);
        setUserRole(UserRole.guest);
        return;
      }

      setIsCheckingAuth(true);
      try {
        const [adminStatus, role] = await Promise.all([
          actor.isCallerAdmin(),
          actor.getCallerUserRole(),
        ]);

        if (!cancelled) {
          setIsAdmin(adminStatus);
          setUserRole(role);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        if (!cancelled) {
          setIsAdmin(false);
          setUserRole(UserRole.guest);
        }
      } finally {
        if (!cancelled) {
          setIsCheckingAuth(false);
        }
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [actor, isAuthenticated, isFetching]);

  const login = useCallback(() => {
    iiLogin();
  }, [iiLogin]);

  const logout = useCallback(() => {
    iiClear();
    setIsAdmin(false);
    setUserRole(UserRole.guest);
    sessionStorage.clear();
  }, [iiClear]);

  const isLoading =
    isInitializing || isCheckingAuth || loginStatus === "logging-in";

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        userRole,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
