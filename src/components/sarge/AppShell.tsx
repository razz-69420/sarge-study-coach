import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ClipboardList, Upload, CalendarDays, Crosshair, Radar, FolderTree, LayoutDashboard, Play, X, RotateCcw } from "lucide-react";
import { DEMO_ORDER, useSarge } from "@/lib/sarge-store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Enlistment", icon: ClipboardList },
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/plan", label: "Battle Plan", icon: CalendarDays },
  { to: "/quiz", label: "Quiz", icon: Crosshair },
  { to: "/debrief", label: "Debrief", icon: Radar },
  { to: "/record", label: "Service Record", icon: FolderTree },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { demoActive, setDemoActive, reset } = useSarge();
  const navigate = useNavigate();
  const step = DEMO_ORDER.indexOf(path as (typeof DEMO_ORDER)[number]);

  const startDemo = () => {
    reset();
    setDemoActive(true);
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <aside className="border-b border-border bg-background/80 backdrop-blur md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between gap-3 p-4 md:block md:p-6">
          <div>
            <div className="stencil text-3xl text-primary md:text-4xl">Sarge</div>
            <div className="label-tag hidden md:block">Study coach · JKU AI</div>
          </div>
          <button onClick={startDemo} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110 md:mt-6 md:w-full md:justify-center md:py-2.5">
            <Play className="h-3.5 w-3.5" /> Run demo
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:px-4">
          {NAV.map((n, i) => {
            const active = path === n.to;
            return (
              <Link key={n.to} to={n.to} className={cn(
                "flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}>
                <span className="font-mono text-[10px] opacity-60">0{i + 1}</span>
                <n.icon className="h-4 w-4" />
                <span className="whitespace-nowrap">{n.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="hidden px-6 pt-6 md:block">
          <div className="panel p-3 text-xs">
            <div className="label-tag">Recruit</div>
            <div className="mt-1 font-semibold">Recruit Alex</div>
            <div className="text-muted-foreground">Machine Learning Foundations</div>
          </div>
          <button onClick={reset} className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <RotateCcw className="h-3 w-3" /> Reset demo data
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-10 md:py-12">{children}</main>
        <footer className="border-t border-border px-4 py-4 text-center label-tag md:px-10">Demo with fictional course data</footer>
      </div>

      {demoActive && step >= 0 && (
        <div className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-xl items-center gap-3 rounded-lg border border-primary/50 bg-card p-3 glow md:bottom-6">
          <div className="label-tag shrink-0">Demo {step + 1}/{DEMO_ORDER.length}</div>
          <div className="flex flex-1 gap-1">
            {DEMO_ORDER.map((_, i) => (
              <div key={i} className={cn("h-1 flex-1 rounded-full", i <= step ? "bg-primary" : "bg-muted")} />
            ))}
          </div>
          {step > 0 && (
            <button onClick={() => navigate({ to: DEMO_ORDER[step - 1] })} className="text-xs text-muted-foreground hover:text-foreground">Back</button>
          )}
          {step < DEMO_ORDER.length - 1 ? (
            <button onClick={() => navigate({ to: DEMO_ORDER[step + 1] })} className="rounded bg-primary px-3 py-1.5 text-xs font-bold uppercase text-primary-foreground">Next</button>
          ) : (
            <button onClick={() => setDemoActive(false)} className="rounded bg-primary px-3 py-1.5 text-xs font-bold uppercase text-primary-foreground">Finish</button>
          )}
          <button aria-label="Close demo" onClick={() => setDemoActive(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
}
