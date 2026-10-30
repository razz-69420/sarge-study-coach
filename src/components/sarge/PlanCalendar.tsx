import { DAYS_TO_EXAM, dayDate, fmtDay, type Session } from "@/lib/sarge-data";
import { cn } from "@/lib/utils";

export function PlanCalendar({ sessions, animateNew }: { sessions: Session[]; animateNew?: boolean }) {
  let newIdx = 0;
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: DAYS_TO_EXAM + 1 }, (_, d) => {
        const isExam = d === DAYS_TO_EXAM;
        const daySessions = sessions.filter((s) => s.day === d);
        return (
          <div key={d} className={cn("panel min-h-28 p-3", isExam && "border-primary bg-primary/10")}>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-xs font-semibold">{fmtDay(dayDate(d))}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{isExam ? "EXAM" : `T-${DAYS_TO_EXAM - d}`}</span>
            </div>
            {isExam && <div className="stencil text-xl text-primary">Exam day</div>}
            {!isExam && daySessions.length === 0 && <div className="text-xs text-muted-foreground">Rest & light recap</div>}
            <div className="space-y-1.5">
              {daySessions.map((s, k) => {
                const delay = s.isNew && animateNew ? newIdx++ * 220 : 0;
                return (
                  <div
                    key={k}
                    className={cn(
                      "rounded-sm px-2 py-1 text-xs leading-tight",
                      s.kind === "final" && "bg-primary font-semibold text-primary-foreground",
                      s.kind === "review" && "bg-secondary text-secondary-foreground",
                      s.kind === "drill" && "border border-destructive/70 bg-destructive/15 text-foreground",
                      s.isNew && animateNew && "slide-in",
                    )}
                    style={delay ? { animationDelay: `${delay}ms` } : undefined}
                  >
                    {s.kind === "final" ? "Final review" : s.kind === "drill" ? `Drill · ${s.topic}` : s.topic}
                    {s.isNew && <span className="ml-1 font-mono text-[9px] text-primary">NEW</span>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
