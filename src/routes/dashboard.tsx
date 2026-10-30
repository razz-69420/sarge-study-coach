import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Flame, Pause, Play } from "lucide-react";
import { PageHeader, SargeSays, btnClass } from "@/components/sarge/ui";
import { useSarge } from "@/lib/sarge-store";
import { DAYS_TO_EXAM, TOPICS, WEAK_THRESHOLD, buildPlan } from "@/lib/sarge-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Sarge Study Coach" },
      { name: "description", content: "Exam countdown, today's orders, weak topics and your audio briefing." },
      { property: "og:title", content: "Dashboard — Sarge Study Coach" },
      { property: "og:description", content: "Exam countdown, today's orders, weak topics and your audio briefing." },
    ],
  }),
  component: Dashboard,
});

const BARS = 32;

function Dashboard() {
  const { mastery, weakNew } = useSarge();
  const [playing, setPlaying] = useState(false);
  const plan = buildPlan(weakNew);
  const today = plan.filter((p) => p.day === 0);
  const nextDrill = plan.find((p) => p.isNew);
  const weak = TOPICS.filter((t) => mastery[t] < WEAK_THRESHOLD);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setPlaying(false), 9000);
    return () => clearTimeout(t);
  }, [playing]);

  return (
    <div className="space-y-6">
      <PageHeader tag="Screen 07 · Dashboard" title="Morning, Recruit Alex" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel p-5 md:col-span-1">
          <div className="label-tag">Exam countdown</div>
          <div className="stencil text-7xl text-primary leading-none mt-2">{DAYS_TO_EXAM}</div>
          <div className="text-sm text-muted-foreground">days · Machine Learning Foundations</div>
        </div>
        <div className="panel p-5">
          <div className="label-tag">Streak</div>
          <div className="mt-2 flex items-center gap-2"><Flame className="h-8 w-8 text-primary" /><span className="stencil text-6xl leading-none">4</span></div>
          <div className="mt-3 flex gap-1">{Array.from({ length: 7 }, (_, k) => <div key={k} className={cn("h-2 flex-1 rounded-sm", k < 4 ? "bg-primary" : "bg-muted")} />)}</div>
        </div>
        <div className="panel p-5">
          <div className="label-tag">Weak topics</div>
          <ul className="mt-2 space-y-1.5">
            {weak.map((t) => <li key={t} className="flex justify-between text-sm"><span>{t}</span><span className="font-mono text-destructive">{mastery[t]}%</span></li>)}
          </ul>
        </div>
      </div>

      <div className="panel p-5 md:p-6">
        <div className="label-tag mb-3">Today's orders</div>
        <ol className="space-y-2">
          {today.map((s, k) => <li key={k} className="flex items-center gap-3"><span className="stencil text-primary">{k + 1}</span>Review {s.topic} · 45 min</li>)}
          {nextDrill && <li className="flex items-center gap-3"><span className="stencil text-primary">{today.length + 1}</span>Prep: {nextDrill.topic} drill is coming. Re-read the update rule.</li>}
          <li className="flex items-center gap-3"><span className="stencil text-primary">{today.length + (nextDrill ? 2 : 1)}</span>Phone in another room. Non-negotiable.</li>
        </ol>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/quiz" className={btnClass("primary")}>Start quiz</Link>
          <Link to="/plan" className={btnClass("outline")}>View plan</Link>
        </div>
      </div>

      <div className="panel flex flex-col gap-5 p-5 md:flex-row md:items-center md:p-6">
        <button onClick={() => setPlaying(!playing)} className={cn(btnClass("primary"), "shrink-0")}>
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? "Pause briefing" : "Play audio briefing"}
        </button>
        <div className="flex h-14 flex-1 items-center gap-1" aria-hidden>
          {Array.from({ length: BARS }, (_, k) => (
            <div key={k} className={cn("w-full rounded-full", playing ? "wave-bar bg-primary" : "bg-muted")}
              style={{ height: `${30 + ((k * 37) % 70)}%`, animationDelay: `${(k % 8) * 0.1}s`, transform: playing ? undefined : "scaleY(0.25)" }} />
          ))}
        </div>
        <div className="label-tag shrink-0">{playing ? "Playing · 1:30" : "1:30 · preview"}</div>
      </div>
      {playing && <SargeSays>Twelve days, recruit. {weak[0] ?? "Nothing"} is the soft spot. We drill it until it isn't.</SargeSays>}
    </div>
  );
}
