import { createFileRoute } from "@tanstack/react-router";
import { NextLink, PageHeader, SargeSays } from "@/components/sarge/ui";
import { PlanCalendar } from "@/components/sarge/PlanCalendar";
import { useSarge } from "@/lib/sarge-store";
import { buildPlan } from "@/lib/sarge-data";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Battle Plan — Sarge Study Coach" },
      { name: "description", content: "A 12-day study calendar counting back from your exam." },
      { property: "og:title", content: "Battle Plan — Sarge Study Coach" },
      { property: "og:description", content: "A 12-day study calendar counting back from your exam." },
    ],
  }),
  component: PlanPage,
});

function PlanPage() {
  const { weakNew, profile } = useSarge();
  const plan = buildPlan(weakNew);
  return (
    <div className="space-y-6">
      <PageHeader tag="Screen 03 · Battle Plan" title="12 days to contact" sub={`${plan.length} sessions across ${profile.hours} h/week. Final review lands 2 days before the exam. The last day is for sleep, not panic.`} />
      <SargeSays>Every topic gets hit at least twice. You show up, the plan works. You don't, it doesn't.</SargeSays>
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm bg-secondary" />Review</span>
        <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm bg-primary" />Final review</span>
        <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm border border-destructive bg-destructive/15" />Extra drill</span>
      </div>
      <PlanCalendar sessions={plan} />
      <div className="flex justify-end"><NextLink to="/quiz">Start quiz</NextLink></div>
    </div>
  );
}
