import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

type BadgeSize = "sm" | "md" | "lg";

interface CompraSeguraBadgeProps {
  size?: BadgeSize;
  className?: string;
}

const sizeConfig: Record<
  BadgeSize,
  { icon: string; title: string; sub: string; padding: string; gap: string }
> = {
  sm: {
    icon: "w-4 h-4",
    title: "text-xs",
    sub: "text-[10px]",
    padding: "px-2 py-1",
    gap: "gap-1.5",
  },
  md: {
    icon: "w-5 h-5",
    title: "text-sm",
    sub: "text-xs",
    padding: "px-3 py-1.5",
    gap: "gap-2",
  },
  lg: {
    icon: "w-7 h-7",
    title: "text-base",
    sub: "text-sm",
    padding: "px-4 py-2.5",
    gap: "gap-2.5",
  },
};

export function CompraSeguraBadge({
  size = "md",
  className,
}: CompraSeguraBadgeProps) {
  const cfg = sizeConfig[size];
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border-2 border-emerald-400/60 bg-emerald-50 text-emerald-800 font-sans",
        cfg.padding,
        cfg.gap,
        className,
      )}
    >
      <ShieldCheck
        className={cn(cfg.icon, "text-emerald-500 flex-shrink-0 animate-pulse")}
        strokeWidth={2.5}
      />
      <div className="leading-none">
        <p
          className={cn(
            cfg.title,
            "font-display font-extrabold tracking-wide text-emerald-700 uppercase",
          )}
        >
          Compra Segura
        </p>
        <p
          className={cn(
            cfg.sub,
            "text-emerald-600 font-semibold leading-tight",
          )}
        >
          Verificado CERC
        </p>
      </div>
    </div>
  );
}
