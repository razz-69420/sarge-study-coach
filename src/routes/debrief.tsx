import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MasteryBar, NextLink, PageHeader, SargeSays } from "@/components/sarge/ui";
import { PlanCalendar } from "@/components/sarge/PlanCalendar";
import { useSarge } from "@/lib/sarge-store";
import { BASE_MASTERY, TOPICS, WEAK_THRESHOLD, buildPlan, masteryAfter, weakFromQuiz } from "@/lib/sarge-data";

export const Route = createFileRoute("/debrief")({
  head: () => ({
    meta: [
      { title: "Debrief — Sarge Study Coach" },
      { name: "description", content: "See how your quiz changed your mastery and your battle plan." },
      { property: "og:title", content: "Debrief — Sarge Study Coach" },
      { property: "og:description", content: "See how your quiz changed your mastery and your battle plan." },
    ],
  }),
  component: DebriefPage,
});

function DebriefPage() {
  const { quizDone, answers, setDebriefApplied } = useSarge();
  const [phase, setPhase] = useState(0);
  const applied = useRef(false);

  useEffect(() => {
    if (!quizDone) return;
    if (!applied.current) { applied.current = true; setDebriefApplied(true); }
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [quizDone, setDebriefApplied]);

  if (!quizDone) {
    return (
      <div className="space-y-6">
        <PageHeader tag="Screen 05 · Debrief" title="No intel yet" sub="The debrief runs on your quiz results." />
        <SargeSays>Nothing to debrief, recruit. Finish the quiz first.</SargeSays>
        <NextLink to="/quiz">Take the quiz</NextLink>
      </div>
    );
  }

  const after = masteryAfter(answers);
  const weak = weakFromQuiz(answers);
  const before = buildPlan([]);
  const afterPlan = buildPlan(weak);
  const gdWrong = answers.filter((a) => a.topic === "Gradient Descent" && !a.correct).length;
  const focus = weak[0];
  const changed = TOPICS.filter((t) => after[t] !== BASE_MASTERY[t]);

  const line = weak.length === 0
    ? "Clean sweep. Good. Don't get comfortable. Plan stays as is."
    : gdWrong > 0
      ? `${gdWrong === 1 ? "One" : "Two"} wrong on gradient descent, recruit. We are not done here.`
      : `${focus} let you down. We are not done here.`;

  return (
    <div className="space-y-6">
      <PageHeader tag="Screen 05 · Debrief" title="After-action report" sub={`${answers.filter((a) => a.correct).length} of 5 correct.`} />
      <SargeSays>{line}</SargeSays>

      <div className="panel p-5 md:p-6">
        <div className="stencil mb-4 text-xl">Mastery shift</div>
        <div className="grid gap-2 md:grid-cols-2">
          {changed.map((t) => {
            const v = phase >= 1 ? after[t] : BASE_MASTERY[t];
            const isWeak = weak.includes(t);
            return (
              <div key={t}>
                <MasteryBar label={t} value={v} weak={phase >= 1 && v < WEAK_THRESHOLD} highlight={isWeak && phase >= 1} />
                <div className="px-3 font-mono text-[11px] text-muted-foreground">
                  {BASE_MASTERY[t]}% → {phase >= 1 ? `${after[t]}%` : "…"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {phase >= 2 && (
        <div className="space-y-6 fade-up">
          {weak.length > 0 && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <div className="panel p-4"><div className="label-tag">Before</div><div className="stencil text-4xl">{before.length}</div><div className="text-xs text-muted-foreground">sessions</div></div>
              <div className="panel border-primary p-4"><div className="label-tag">After</div><div className="stencil text-4xl text-primary">{afterPlan.length}</div><div className="text-xs text-muted-foreground">sessions</div></div>
              <div className="panel col-span-2 p-4 md:col-span-1"><div className="label-tag">Added</div><div className="stencil text-4xl text-destructive">+{afterPlan.length - before.length}</div><div className="text-xs text-muted-foreground">{weak.join(", ")} drills</div></div>
            </div>
          )}
          <SargeSays>
            {weak.length === 0
              ? "No weak spots found today. Plan unchanged. Same time tomorrow."
              : `What changed: I added ${afterPlan.length - before.length} drill sessions for ${weak.join(" and ")}. Why: you missed ${answers.filter((a) => !a.correct).length} question${answers.filter((a) => !a.correct).length > 1 ? "s" : ""} there, and spaced repetition beats cramming. Drills land early so there's time to fix it before the final review.`}
          </SargeSays>
          <div>
            <div className="stencil mb-3 text-xl">Revised battle plan</div>
            <PlanCalendar sessions={afterPlan} animateNew />
          </div>
          <div className="flex justify-end"><NextLink to="/record">Open service record</NextLink></div>
        </div>
      )}
    </div>
  );
}
