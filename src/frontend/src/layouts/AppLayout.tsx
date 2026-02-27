import { cn } from "@/lib/utils";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Package, Phone, Search, Shield } from "lucide-react";

const tabs = [
  { path: "/app/home", icon: Search, label: "Busca" },
  { path: "/app/vault", icon: Shield, label: "Meu Baú" },
  { path: "/app/recovered", icon: Package, label: "Recuperados" },
  { path: "/app/sos", icon: Phone, label: "Guia SOS" },
];

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Main content with bottom padding for nav */}
      <main className="flex-1 pb-[72px] overflow-auto">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-card border-t border-border shadow-navy z-50">
        <div className="h-full max-w-screen-xl mx-auto px-1 flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;

            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-[64px]",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-all",
                    isActive && "stroke-[2.5px]",
                  )}
                />
                <span
                  className={cn(
                    "text-[11px] font-medium leading-none",
                    isActive && "font-bold text-primary",
                  )}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
