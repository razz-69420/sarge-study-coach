import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, PageHeader, SargeSays } from "@/components/sarge/ui";
import { useSarge, type Profile } from "@/lib/sarge-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Enlistment — Sarge Study Coach" },
      { name: "description", content: "Six quick questions so Sarge can build your study battle plan." },
      { property: "og:title", content: "Enlistment — Sarge Study Coach" },
      { property: "og:description", content: "Six quick questions so Sarge can build your study battle plan." },
    ],
  }),
  component: Enlistment,
});

type Step = { key: keyof Profile; q: string; sarge: string; options?: string[]; kind?: "date" | "hours" };
const STEPS: Step[] = [
  { key: "examDate", q: "When is your exam?", sarge: "First things first. When's the battle?", kind: "date" },
  { key: "hours", q: "How many hours per week can you study?", sarge: "Be honest. I plan around the truth, not your ambitions.", kind: "hours" },
  { key: "goal", q: "What's your goal?", sarge: "Pick your mission. All three are respectable.", options: ["Pass", "Solid grade", "Top marks"] },
  { key: "enjoy", q: "What would you enjoy using?", sarge: "You'll train harder with gear you like.", options: ["Reading", "Audio", "Quizzes"] },
  { key: "blocker", q: "What stops you from starting?", sarge: "Everyone has an enemy. Name yours.", options: ["Not knowing where to start", "Phone distractions", "Topic feels too big", "Low energy"] },
  { key: "helpStyle", q: "How should Sarge help when you're stuck?", sarge: "Hints first is standard issue. I don't hand out answers for free.", options: ["Hints first", "Full explanations", "Just the answer"] },
];

function Enlistment() {
  const { profile, setProfile, setEnlisted } = useSarge();
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const s = STEPS[i];
  const set = (v: string | number) => setProfile({ ...profile, [s.key]: v });
  const next = () => {
    if (i < STEPS.length - 1) setI(i + 1);
    else { setEnlisted(true); navigate({ to: "/upload" }); }
  };

  return (
    <div>
      <PageHeader tag="Screen 01 · Enlistment" title="Report for duty" sub="Six questions. Then we get to work, Recruit Alex." />
      <div className="mb-6 flex gap-1.5">
        {STEPS.map((_, k) => (
          <button key={k} aria-label={`Question ${k + 1}`} onClick={() => setI(k)} className={cn("h-1.5 flex-1 rounded-full transition-colors", k <= i ? "bg-primary" : "bg-muted")} />
        ))}
      </div>
      <div key={i} className="space-y-6 fade-up">
        <SargeSays>{s.sarge}</SargeSays>
        <div className="panel p-6 md:p-8">
          <div className="label-tag mb-2">Question {i + 1} of 6</div>
          <h2 className="mb-6 text-2xl font-semibold">{s.q}</h2>
          {s.kind === "date" && (
            <div>
              <input type="date" value={profile.examDate} onChange={(e) => set(e.target.value)} className="rounded-md border border-input bg-background px-4 py-3 font-mono text-foreground [color-scheme:dark]" />
              <p className="mt-2 text-sm text-muted-foreground">Machine Learning Foundations · 12 days from today</p>
            </div>
          )}
          {s.kind === "hours" && (
            <div>
              <div className="stencil mb-3 text-5xl text-primary">{profile.hours} h</div>
              <input type="range" min={2} max={25} value={profile.hours} onChange={(e) => set(Number(e.target.value))} className="w-full accent-primary" />
            </div>
          )}
          {s.options && (
            <div className="grid gap-3 sm:grid-cols-2">
              {s.options.map((o) => {
                const active = profile[s.key] === o;
                return (
                  <button key={o} onClick={() => set(o)} className={cn("rounded-md border px-4 py-3 text-left transition-all", active ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50")}>
                    {o}
                    {o === "Hints first" && <span className="ml-2 label-tag">default</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <Btn variant="ghost" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>← Back</Btn>
          <Btn onClick={next}>{i === STEPS.length - 1 ? "Enlist" : "Next"} →</Btn>
        </div>
      </div>
    </div>
  );
}
