import { Outlet, Link, useLocation } from "@tanstack/react-router";
import { Search, Shield, Package, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

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
      {/* Main Content */}
      <main className="flex-1 pb-20 overflow-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border shadow-lg z-50">
        <div className="h-full max-w-screen-xl mx-auto px-2 flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all duration-200",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
                <span className={cn("text-xs font-medium", isActive && "font-semibold")}>
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
