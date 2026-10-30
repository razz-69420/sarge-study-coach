import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { Btn, NextLink, PageHeader, SargeSays } from "@/components/sarge/ui";
import { useSarge } from "@/lib/sarge-store";
import { CONFIDENCE, QUESTIONS, reaction, type Answer } from "@/lib/sarge-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz — Sarge Study Coach" },
      { name: "description", content: "Five mixed questions with hints, confidence ratings and Sarge's verdict." },
      { property: "og:title", content: "Quiz — Sarge Study Coach" },
      { property: "og:description", content: "Five mixed questions with hints, confidence ratings and Sarge's verdict." },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const { answers, setAnswers, setDebriefApplied, quizDone } = useSarge();
  const navigate = useNavigate();
  const [i, setI] = useState(quizDone ? 0 : answers.length);
  const [choice, setChoice] = useState<number | null>(null);
  const [conf, setConf] = useState<number | null>(null);
  const [hint, setHint] = useState(false);
  const [locked, setLocked] = useState<Answer | null>(null);
  const [restarted, setRestarted] = useState(!quizDone);

  if (quizDone && !restarted && !locked) {
    const right = answers.filter((a) => a.correct).length;
    return (
      <div className="space-y-6">
        <PageHeader tag="Screen 04 · Quiz" title="Quiz complete" sub={`${right} of 5 correct.`} />
        <SargeSays>Results are in. Get to the debrief.</SargeSays>
        <div className="flex flex-wrap justify-between gap-3">
          <Btn variant="ghost" onClick={() => { setAnswers([]); setDebriefApplied(false); setI(0); setRestarted(true); }}>Retake quiz</Btn>
          <NextLink to="/debrief">Go to debrief</NextLink>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[i];
  const lock = () => {
    if (choice === null || conf === null) return;
    const a: Answer = { qid: q.id, topic: q.topic, choice, confidence: conf, correct: choice === q.correct };
    setLocked(a);
    setAnswers([...answers.filter((x) => x.qid !== q.id), a]);
  };
  const next = () => {
    if (i === QUESTIONS.length - 1) { navigate({ to: "/debrief" }); return; }
    setI(i + 1); setChoice(null); setConf(null); setHint(false); setLocked(null);
  };

  return (
    <div>
      <PageHeader tag="Screen 04 · Quiz" title="Live fire drill" sub="Five questions, mixed topics. Rate your confidence. Guessing is allowed. Lying is not." />
      <div className="mb-6 flex gap-1.5">
        {QUESTIONS.map((_, k) => (
          <div key={k} className={cn("h-1.5 flex-1 rounded-full", k < i || (k === i && locked) ? "bg-primary" : k === i ? "bg-primary/40" : "bg-muted")} />
        ))}
      </div>
      <div key={i} className="panel space-y-6 p-5 md:p-8 fade-up">
        <div className="flex items-center justify-between gap-3">
          <span className="label-tag">Question {i + 1}/5 · {q.topic}</span>
          {!locked && (
            <button onClick={() => setHint(true)} disabled={hint} className="inline-flex items-center gap-1.5 rounded-md border border-primary/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-primary/10 disabled:opacity-50">
              <Lightbulb className="h-3.5 w-3.5" /> Hint
            </button>
          )}
        </div>
        <h2 className="text-xl font-semibold md:text-2xl">{q.q}</h2>
        {hint && <div className="rounded-md bg-primary/10 p-3 text-sm fade-up"><span className="font-semibold text-primary">Hint: </span>{q.hint}</div>}
        <div className="grid gap-2">
          {q.options.map((o, k) => {
            const isRight = locked && k === q.correct;
            const isWrongPick = locked && k === locked.choice && !locked.correct;
            return (
              <button key={k} disabled={!!locked} onClick={() => setChoice(k)} className={cn(
                "flex items-center gap-3 rounded-md border px-4 py-3 text-left transition-all",
                isRight ? "border-success bg-success/15" : isWrongPick ? "border-destructive bg-destructive/15" : choice === k ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
              )}>
                <span className="font-mono text-xs text-muted-foreground">{String.fromCharCode(65 + k)}</span>{o}
              </button>
            );
          })}
        </div>
        {!locked && (
          <div>
            <div className="label-tag mb-2">How sure are you?</div>
            <div className="flex flex-wrap gap-2">
              {CONFIDENCE.map((c, k) => (
                <button key={c} onClick={() => setConf(k)} className={cn("rounded-md border px-4 py-2 text-sm", conf === k ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50")}>{c}</button>
              ))}
            </div>
          </div>
        )}
        {locked && (
          <div className="space-y-3">
            <SargeSays>{reaction(locked.correct, locked.confidence)}</SargeSays>
            <p className="text-sm text-muted-foreground">{q.explain}</p>
          </div>
        )}
        <div className="flex justify-end">
          {!locked ? (
            <Btn onClick={lock} disabled={choice === null || conf === null}>Lock in</Btn>
          ) : (
            <Btn onClick={next}>{i === QUESTIONS.length - 1 ? "To debrief" : "Next question"} →</Btn>
          )}
        </div>
      </div>
    </div>
  );
}
