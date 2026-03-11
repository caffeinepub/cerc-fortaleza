import { useUnreadAlertCount } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Bell, MapPin, Package, Phone, Search, Shield } from "lucide-react";

function AlertsBellIcon({ className }: { className?: string }) {
  const { data: unreadCount } = useUnreadAlertCount();
  const count = Number(unreadCount ?? BigInt(0));

  return (
    <div className="relative">
      <Bell className={cn("w-5 h-5 transition-all", className)} />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </div>
  );
}

const staticTabs = [
  { path: "/app/home", icon: Search, label: "Busca" },
  { path: "/app/vault", icon: Shield, label: "Meu Baú" },
  { path: "/app/recovered", icon: Package, label: "Recuperados" },
  { path: "/app/alertas", icon: "bell" as const, label: "Alertas" },
  { path: "/app/mapa", icon: MapPin, label: "Mapa" },
  { path: "/app/sos", icon: Phone, label: "SOS" },
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
          {staticTabs.map((tab) => {
            const isActive = location.pathname === tab.path;

            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl transition-all duration-200 min-w-[52px]",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
                data-ocid={`nav.${tab.label.toLowerCase()}.link`}
              >
                {tab.icon === "bell" ? (
                  <AlertsBellIcon
                    className={cn(isActive && "stroke-[2.5px]")}
                  />
                ) : (
                  <tab.icon
                    className={cn(
                      "w-5 h-5 transition-all",
                      isActive && "stroke-[2.5px]",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "text-[10px] font-medium leading-none",
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
