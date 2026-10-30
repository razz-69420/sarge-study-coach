import { describe, expect, it } from "vitest";
import { DAYS_TO_EXAM, buildPlan, masteryAfter, weakFromQuiz, type Answer } from "@/lib/sarge-data";

const wrongGD: Answer[] = [
  { qid: "q1", topic: "Gradient Descent", choice: 0, confidence: 2, correct: false },
  { qid: "q3", topic: "Gradient Descent", choice: 0, confidence: 1, correct: false },
];

describe("battle plan", () => {
  it("puts the final review 2 days before the exam", () => {
    const final = buildPlan([]).filter((s) => s.kind === "final");
    expect(final).toHaveLength(1);
    expect(final[0].day).toBe(DAYS_TO_EXAM - 2);
  });
  it("adds Gradient Descent drills when GD answers are wrong", () => {
    const weak = weakFromQuiz(wrongGD);
    expect(weak).toEqual(["Gradient Descent"]);
    const before = buildPlan([]).length;
    const after = buildPlan(weak);
    expect(after.length - before).toBe(3);
    expect(after.filter((s) => s.isNew).every((s) => s.day < DAYS_TO_EXAM - 2)).toBe(true);
  });
  it("drops Gradient Descent mastery below the weak threshold", () => {
    expect(masteryAfter(wrongGD)["Gradient Descent"]).toBeLessThan(45);
  });
});
