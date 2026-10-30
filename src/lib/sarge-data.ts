export const TOPICS = [
  "Linear Regression",
  "Gradient Descent",
  "Regularization",
  "Bias-Variance",
  "Logistic Regression",
  "Neural Network Basics",
] as const;
export type Topic = (typeof TOPICS)[number];

export const BASE_MASTERY: Record<Topic, number> = {
  "Linear Regression": 72,
  "Gradient Descent": 64,
  Regularization: 50,
  "Bias-Variance": 56,
  "Logistic Regression": 60,
  "Neural Network Basics": 38,
};
export const WEAK_THRESHOLD = 45;

export const EXAM_DATE = new Date(Date.UTC(2026, 10, 12)); // 12 Nov 2026
export const TODAY = new Date(Date.UTC(2026, 9, 31)); // 31 Oct 2026
export const DAYS_TO_EXAM = 12;

export function dayDate(i: number) {
  return new Date(TODAY.getTime() + i * 86400000);
}
export function fmtDay(d: Date) {
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
}

export type Session = { day: number; topic: Topic | "All topics"; kind: "review" | "final" | "drill"; isNew?: boolean };

const BASE_SESSIONS: Session[] = [
  { day: 0, topic: "Linear Regression", kind: "review" },
  { day: 1, topic: "Gradient Descent", kind: "review" },
  { day: 2, topic: "Regularization", kind: "review" },
  { day: 3, topic: "Bias-Variance", kind: "review" },
  { day: 4, topic: "Logistic Regression", kind: "review" },
  { day: 5, topic: "Neural Network Basics", kind: "review" },
  { day: 6, topic: "Linear Regression", kind: "review" },
  { day: 6, topic: "Gradient Descent", kind: "review" },
  { day: 7, topic: "Regularization", kind: "review" },
  { day: 7, topic: "Bias-Variance", kind: "review" },
  { day: 8, topic: "Logistic Regression", kind: "review" },
  { day: 9, topic: "Neural Network Basics", kind: "review" },
  { day: 10, topic: "All topics", kind: "final" },
];
const DRILL_DAYS = [2, 4, 8];

/** Builds the 12-day plan. Each weak topic from the quiz gets extra drill sessions. Final review is always 2 days before the exam. */
export function buildPlan(weakFromQuiz: Topic[]): Session[] {
  const extra = weakFromQuiz.flatMap((t, ti) =>
    DRILL_DAYS.map((d) => ({ day: Math.min(9, d + ti), topic: t, kind: "drill" as const, isNew: true })),
  );
  return [...BASE_SESSIONS, ...extra].sort((a, b) => a.day - b.day);
}

export type Question = { id: string; topic: Topic; q: string; options: string[]; correct: number; hint: string; explain: string };

export const QUESTIONS: Question[] = [
  {
    id: "q1", topic: "Gradient Descent",
    q: "Your learning rate is far too large. What is most likely to happen to the training loss?",
    options: ["It converges faster to the same minimum", "It oscillates or diverges", "It stays exactly constant", "It always finds the global minimum"],
    correct: 1,
    hint: "Picture taking giant leaps across a valley. Do you land at the bottom?",
    explain: "Steps overshoot the minimum, so loss bounces around or blows up.",
  },
  {
    id: "q2", topic: "Regularization",
    q: "What does L2 regularization do to the model weights?",
    options: ["Sets most of them exactly to zero", "Shrinks them toward zero", "Makes them all equal", "Doubles the largest weight"],
    correct: 1,
    hint: "It adds a penalty proportional to the squared size of each weight.",
    explain: "L2 penalises large weights, shrinking them smoothly. Exact zeros are L1's thing.",
  },
  {
    id: "q3", topic: "Gradient Descent",
    q: "In gradient descent, in which direction do we update the parameters?",
    options: ["Along the gradient", "Opposite to the gradient", "Perpendicular to the gradient", "In a random direction"],
    correct: 1,
    hint: "The gradient points uphill. Where do you want to go?",
    explain: "The gradient points to steepest increase, so we step the opposite way.",
  },
  {
    id: "q4", topic: "Bias-Variance",
    q: "A degree-15 polynomial has near-zero training error but high test error. This is…",
    options: ["High bias", "High variance", "Irreducible noise", "Perfect generalization"],
    correct: 1,
    hint: "The model memorised the training set. Is it too rigid, or too flexible?",
    explain: "Too flexible: classic overfitting, which means high variance.",
  },
  {
    id: "q5", topic: "Logistic Regression",
    q: "Logistic regression turns a linear score into a probability using…",
    options: ["ReLU", "Softplus", "The sigmoid function", "The identity function"],
    correct: 2,
    hint: "You need an S-shaped curve that squeezes any number into (0, 1).",
    explain: "The sigmoid maps any real number to a value between 0 and 1.",
  },
];

export const CONFIDENCE = ["Guessing", "Fairly sure", "Certain"] as const;

export type Answer = { qid: string; topic: Topic; choice: number; confidence: number; correct: boolean };

export function reaction(correct: boolean, confidence: number) {
  if (correct && confidence === 2) return "Good. Don't get comfortable.";
  if (correct) return "Right answer, shaky nerves. Next time, know it, don't hope it.";
  if (confidence === 2) return "Confident and wrong. That's the dangerous kind, recruit. We fix it.";
  return "Wrong, but you knew you were unsure. Honest. Now we learn it properly.";
}

export function masteryAfter(answers: Answer[]): Record<Topic, number> {
  const m = { ...BASE_MASTERY };
  for (const a of answers) {
    const delta = a.correct ? 3 + a.confidence * 3 : -(16 + a.confidence * 4);
    m[a.topic] = Math.max(5, Math.min(98, m[a.topic] + delta));
  }
  return m;
}

export function weakFromQuiz(answers: Answer[]): Topic[] {
  return TOPICS.filter((t) => answers.some((a) => a.topic === t && !a.correct));
}
