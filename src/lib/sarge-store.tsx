import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { masteryAfter, weakFromQuiz, type Answer } from "./sarge-data";

export type Profile = {
  examDate: string;
  hours: number;
  goal: string;
  enjoy: string;
  blocker: string;
  helpStyle: string;
};

export const DEFAULT_PROFILE: Profile = {
  examDate: "2026-11-12",
  hours: 8,
  goal: "Solid grade",
  enjoy: "Quizzes",
  blocker: "Not knowing where to start",
  helpStyle: "Hints first",
};

export const DEMO_ORDER = ["/", "/upload", "/plan", "/quiz", "/debrief", "/record", "/dashboard"] as const;

type Store = {
  profile: Profile;
  setProfile: (p: Profile) => void;
  enlisted: boolean;
  setEnlisted: (v: boolean) => void;
  uploaded: boolean;
  setUploaded: (v: boolean) => void;
  answers: Answer[];
  setAnswers: (a: Answer[]) => void;
  debriefApplied: boolean;
  setDebriefApplied: (v: boolean) => void;
  demoActive: boolean;
  setDemoActive: (v: boolean) => void;
  quizDone: boolean;
  mastery: ReturnType<typeof masteryAfter>;
  weakNew: ReturnType<typeof weakFromQuiz>;
  reset: () => void;
};

const Ctx = createContext<Store | null>(null);

export function SargeProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [enlisted, setEnlisted] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [debriefApplied, setDebriefApplied] = useState(false);
  const [demoActive, setDemoActive] = useState(false);

  const value = useMemo<Store>(() => {
    const quizDone = answers.length >= 5;
    return {
      profile, setProfile, enlisted, setEnlisted, uploaded, setUploaded,
      answers, setAnswers, debriefApplied, setDebriefApplied, demoActive, setDemoActive,
      quizDone,
      mastery: masteryAfter(debriefApplied ? answers : []),
      weakNew: debriefApplied ? weakFromQuiz(answers) : [],
      reset: () => {
        setProfile(DEFAULT_PROFILE); setEnlisted(false); setUploaded(false);
        setAnswers([]); setDebriefApplied(false);
      },
    };
  }, [profile, enlisted, uploaded, answers, debriefApplied, demoActive]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSarge() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSarge outside provider");
  return c;
}
