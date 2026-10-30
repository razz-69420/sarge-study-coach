import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Btn({
  children, onClick, variant = "primary", disabled, className, type = "button",
}: { children: ReactNode; onClick?: () => void; variant?: "primary" | "ghost" | "outline"; disabled?: boolean; className?: string; type?: "button" | "submit" }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cn(btnClass(variant), className)}>
      {children}
    </button>
  );
}

export function btnClass(variant: "primary" | "ghost" | "outline" = "primary") {
  const base = "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold uppercase tracking-wider transition-all disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  if (variant === "primary") return cn(base, "bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98]");
  if (variant === "outline") return cn(base, "border border-primary/60 text-primary hover:bg-primary/10");
  return cn(base, "text-muted-foreground hover:text-foreground hover:bg-secondary");
}

export function NextLink({ to, children }: { to: "/" | "/upload" | "/plan" | "/quiz" | "/debrief" | "/record" | "/dashboard"; children: ReactNode }) {
  return <Link to={to} className={btnClass("primary")}>{children} →</Link>;
}

export function PageHeader({ tag, title, sub }: { tag: string; title: string; sub?: string }) {
  return (
    <header className="mb-8 fade-up">
      <div className="label-tag mb-2">{tag}</div>
      <h1 className="stencil text-4xl md:text-6xl leading-none text-foreground">{title}</h1>
      {sub && <p className="mt-3 max-w-2xl text-muted-foreground">{sub}</p>}
    </header>
  );
}

export function SargeSays({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("panel flex gap-4 border-l-4 border-l-primary p-4 md:p-5 fade-up", className)}>
      <div className="stencil grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-primary text-lg text-primary-foreground">S</div>
      <div>
        <div className="label-tag mb-1">Sarge</div>
        <div className="text-base md:text-lg font-medium leading-snug">{children}</div>
      </div>
    </div>
  );
}

export function MasteryBar({ label, value, weak, highlight }: { label: string; value: number; weak?: boolean; highlight?: boolean }) {
  return (
    <div className={cn("rounded-md p-3", highlight && "glow")}>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className={cn("font-mono text-xs", weak ? "text-destructive" : "text-muted-foreground")}>
          {value}% {weak && "· WEAK"}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-sm bg-muted">
        <div
          className={cn("h-full rounded-sm transition-[width,background-color] duration-[1600ms] ease-out", weak ? "bg-destructive" : "bg-primary")}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
