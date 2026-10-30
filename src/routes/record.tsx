import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Folder } from "lucide-react";
import { NextLink, PageHeader, SargeSays } from "@/components/sarge/ui";
import { useSarge } from "@/lib/sarge-store";
import { CONFIDENCE, QUESTIONS, TOPICS, WEAK_THRESHOLD, buildPlan, dayDate, fmtDay } from "@/lib/sarge-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/record")({
  head: () => ({
    meta: [
      { title: "Service Record — Sarge Study Coach" },
      { name: "description", content: "Sarge's memory of you, stored as plain Markdown notes." },
      { property: "og:title", content: "Service Record — Sarge Study Coach" },
      { property: "og:description", content: "Sarge's memory of you, stored as plain Markdown notes." },
    ],
  }),
  component: RecordPage,
});

const FILES = [
  { path: "Profile.md", depth: 0 },
  { path: "Plan.md", depth: 0 },
  { folder: "Courses", depth: 0 },
  { folder: "Machine Learning Foundations", depth: 1 },
  { path: "Courses/Machine Learning Foundations/Topics.md", depth: 2 },
  { path: "Weak Topics.md", depth: 0 },
  { folder: "Sessions", depth: 0 },
  { path: "Sessions/2026-10-31.md", depth: 1 },
];
const UPDATED = ["Weak Topics.md", "Sessions/2026-10-31.md"];

function RecordPage() {
  const s = useSarge();
  const [open, setOpen] = useState(s.debriefApplied ? "Weak Topics.md" : "Profile.md");
  const plan = buildPlan(s.weakNew);

  const content: Record<string, string> = {
    "Profile.md": `# Recruit Alex\n\n- Program: AI Bachelor, JKU Linz\n- Exam date: ${s.profile.examDate}\n- Study time: ${s.profile.hours} h/week\n- Goal: ${s.profile.goal}\n- Prefers: ${s.profile.enjoy}\n- Main blocker: ${s.profile.blocker}\n- Help style: ${s.profile.helpStyle}\n\n> Responds well to short orders. Needs a clear first step.`,
    "Plan.md": `# Battle Plan · ${plan.length} sessions\n\n${Array.from({ length: 11 }, (_, d) => {
      const ss = plan.filter((x) => x.day === d);
      return `## ${fmtDay(dayDate(d))}\n${ss.length ? ss.map((x) => `- ${x.kind === "final" ? "FINAL REVIEW (all topics)" : x.kind === "drill" ? `Drill: ${x.topic}` : `Review: ${x.topic}`}`).join("\n") : "- Rest & light recap"}`;
    }).join("\n\n")}\n\n## ${fmtDay(dayDate(11))}\n- Rest. Sleep. No cramming.\n\n## ${fmtDay(dayDate(12))}\n- EXAM`,
    "Courses/Machine Learning Foundations/Topics.md": `# Machine Learning Foundations\n\n| Topic | Mastery |\n|---|---|\n${TOPICS.map((t) => `| ${t} | ${s.mastery[t]}% |`).join("\n")}`,
    "Weak Topics.md": `# Weak Topics\n\n${TOPICS.filter((t) => s.mastery[t] < WEAK_THRESHOLD).map((t) => `- **${t}** · ${s.mastery[t]}%${s.weakNew.includes(t) ? "  ← added after quiz 2026-10-31" : ""}`).join("\n") || "- None. Suspicious."}\n\n${s.weakNew.length ? `## Notes\n${s.weakNew.map((t) => `- ${t}: missed in quiz. 3 extra drills scheduled.`).join("\n")}` : "_Quiz not debriefed yet._"}`,
    "Sessions/2026-10-31.md": s.debriefApplied
      ? `# Session · 2026-10-31\n\nQuiz: ${s.answers.filter((a) => a.correct).length}/5 correct\n\n${s.answers.map((a, k) => `${k + 1}. ${QUESTIONS.find((q) => q.id === a.qid)?.topic} · ${a.correct ? "✔ correct" : "✘ wrong"} · ${CONFIDENCE[a.confidence]}`).join("\n")}\n\n## Sarge's notes\n${s.weakNew.length ? `- Weak: ${s.weakNew.join(", ")}. Plan revised.` : "- Clean sweep. Plan unchanged."}\n- Next order: ${plan.find((p) => p.day === 0)?.topic} today.`
      : `# Session · 2026-10-31\n\n- Enlisted. Slides uploaded.\n- Quiz: not taken yet.`,
  };

  return (
    <div className="space-y-6">
      <PageHeader tag="Screen 06 · Service Record" title="Sarge's memory" sub="Everything Sarge knows about you lives in plain Markdown notes. Readable, yours." />
      {s.debriefApplied && <SargeSays>I wrote down what happened. I don't forget, recruit.</SargeSays>}
      <div className="grid gap-4 md:grid-cols-[260px_1fr]">
        <div className="panel p-3 font-mono text-sm">
          <div className="mb-2 px-2 label-tag">sarge-memory/</div>
          {FILES.map((f, k) =>
            f.folder ? (
              <div key={k} className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground" style={{ paddingLeft: 8 + f.depth * 16 }}>
                <Folder className="h-4 w-4 text-olive" />{f.folder}
              </div>
            ) : (
              <button key={k} onClick={() => setOpen(f.path!)} style={{ paddingLeft: 8 + f.depth * 16 }} className={cn(
                "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left",
                open === f.path ? "bg-secondary text-primary" : "hover:bg-secondary/60",
                s.debriefApplied && UPDATED.includes(f.path!) && "flash-update",
              )}>
                <FileText className="h-4 w-4 shrink-0" />
                <span className="truncate">{f.path!.split("/").pop()}</span>
                {s.debriefApplied && UPDATED.includes(f.path!) && <span className="ml-auto shrink-0 rounded-sm bg-primary px-1.5 text-[9px] font-bold uppercase text-primary-foreground">updated</span>}
              </button>
            ),
          )}
        </div>
        <div key={open} className={cn("panel overflow-hidden fade-up", s.debriefApplied && UPDATED.includes(open) && "glow")}>
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <span className="font-mono text-xs text-muted-foreground">{open}</span>
            {s.debriefApplied && UPDATED.includes(open) && <span className="label-tag text-primary">● just updated</span>}
          </div>
          <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap p-4 font-mono text-sm leading-relaxed">{content[open]}</pre>
        </div>
      </div>
      <div className="flex justify-end"><NextLink to="/dashboard">To dashboard</NextLink></div>
    </div>
  );
}
