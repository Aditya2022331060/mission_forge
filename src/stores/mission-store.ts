import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Design, EngineId, Instrument, MissionId, Outcome, RouteId } from "../lib/mission-sim";

export type Phase =
  | "city"
  | "classroom"
  | "training"
  | "menu"
  | "missions"
  | "brief"
  | "route"
  | "routePreview"
  | "objectives"
  | "budget"
  | "fuel"
  | "power"
  | "comms"
  | "instruments"
  | "overview"
  | "craft"
  | "build"
  | "check"
  | "launch"
  | "flight"
  | "encounter"
  | "failure"
  | "rescue"
  | "docking"
  | "landing"
  | "report";

export type { MissionId, RouteId };
export type Lang = "en" | "bn" | "hi" | "es" | "ar" | "fr";

export interface TraineeProfile {
  xp: number;
  completedLessons: string[];
  completedQuizzes: string[];
  completedTraining: string[];
  unlockedMissions: string[];
  credits: number;
  rank: string;
}

type State = Design & {
  phase: Phase;
  cam: "chase" | "cockpit";
  quality: "high" | "low";
  referenceModel: boolean;
  activeNasaModel?: string | undefined;
  outcome: Outcome | null;
  rescueKit: string[];
  rescued: boolean;
  landing: number;
  landingErrors: number;
  dvSpent: number;
  attempts: number;
  craft: "explorer" | "surveyor" | "guardian";
  budget: number;
  objective: "surface" | "orbit" | "survey";
  lang: Lang;
  muted: boolean;
  captions: boolean;
  learn: string | null;
  ayeshaSeen: string[];
  status: { id: number; text: string; tone: "info" | "ok" | "warn" | "danger" }[];
  
  // Progression & Forge City
  profile: TraineeProfile;
  activeCityZone: string | null;
  addXp: (amount: number, reason?: string) => void;
  completeLesson: (lessonId: string) => void;
  completeQuiz: (quizId: string) => void;
  completeTrainingModule: (moduleId: string) => void;

  set: (p: Partial<State>) => void;
  go: (phase: Phase) => void;
  toggleInstrument: (i: Instrument) => void;
  say: (text: string, tone?: "info" | "ok" | "warn" | "danger") => void;
  newRun: (phase?: Phase) => void;
};

const initialProfile: TraineeProfile = {
  xp: 150,
  completedLessons: ["intro-solar-system"],
  completedQuizzes: [],
  completedTraining: [],
  unlockedMissions: ["Moon", "Mars"],
  credits: 5000000,
  rank: "Cadet Explorer",
};

const run = { outcome: null, rescueKit: [], rescued: false, landing: 0, landingErrors: 0, dvSpent: 0 };
const ship: Design = { mission: "Mars", route: "safe", engine: "chemical" as EngineId, engines: 1, tanks: 4, wings: 4, rtgs: 0, antennas: 1, shield: true, battery: false, instruments: ["camera"], fuel: 100 };
let sid = 0;

export const useMissionStore = create<State>()(
  persist(
    (set) => ({
      ...ship,
      ...run,
      phase: "city", // Default starting hub is Forge City
      lang: "en",
      muted: false,
      captions: true,
      learn: null,
      ayeshaSeen: [],
      cam: "chase",
      quality: "high",
      attempts: 0,
      craft: "explorer",
      budget: 2,
      objective: "surface",
      status: [],
      referenceModel: false,
      activeNasaModel: undefined,
      profile: initialProfile,
      activeCityZone: "plaza",

      addXp: (amount, reason) =>
        set((s) => {
          const newXp = s.profile.xp + amount;
          let rank = "Cadet Explorer";
          if (newXp >= 1500) rank = "Flight Director";
          else if (newXp >= 1000) rank = "Senior Commander";
          else if (newXp >= 500) rank = "Mission Specialist";
          else if (newXp >= 250) rank = "Spaceflight Engineer";

          return {
            profile: {
              ...s.profile,
              xp: newXp,
              rank,
            },
            status: reason
              ? [{ id: ++sid, text: `+${amount} XP: ${reason}`, tone: "ok" as const }, ...s.status].slice(0, 4)
              : s.status,
          };
        }),

      completeLesson: (lessonId) =>
        set((s) => ({
          profile: {
            ...s.profile,
            completedLessons: Array.from(new Set([...s.profile.completedLessons, lessonId])),
          },
        })),

      completeQuiz: (quizId) =>
        set((s) => ({
          profile: {
            ...s.profile,
            completedQuizzes: Array.from(new Set([...s.profile.completedQuizzes, quizId])),
          },
        })),

      completeTrainingModule: (moduleId) =>
        set((s) => ({
          profile: {
            ...s.profile,
            completedTraining: Array.from(new Set([...s.profile.completedTraining, moduleId])),
          },
        })),

      set: (p) => set(p as never),
      go: (phase) => set({ phase, referenceModel: false }),
      toggleInstrument: (i) =>
        set((s) => ({
          instruments: s.instruments.includes(i) ? s.instruments.filter((x) => x !== i) : [...s.instruments, i],
        })),
      say: (text, tone = "info") =>
        set((s) => ({ status: [{ id: ++sid, text, tone }, ...s.status].slice(0, 4) })),
      newRun: (phase = "build") => set((s) => ({ ...run, phase, attempts: s.attempts + 1, status: [] })),
    }),
    {
      name: "mission-forge-v4",
      partialize: (s) => {
        const { status, set: _a, go: _b, toggleInstrument: _c, say: _d, newRun: _e, addXp: _f, completeLesson: _g, completeQuiz: _h, completeTrainingModule: _i, ...rest } = s;
        void status;
        return rest as never;
      },
      merge: (p, c) => {
        const s = { ...c, ...(p as object) } as State;
        if (["launch", "docking"].includes(s.phase)) s.phase = s.phase === "launch" ? "check" : "rescue";
        if (s.phase === "encounter" && !s.outcome) s.phase = "flight";
        return s;
      },
    },
  ),
);

export const designOf = (s: Design): Design => ({
  mission: s.mission,
  route: s.route,
  engine: s.engine,
  engines: s.engines,
  tanks: s.tanks,
  wings: s.wings,
  rtgs: s.rtgs,
  antennas: s.antennas,
  shield: s.shield,
  battery: s.battery,
  instruments: s.instruments,
  fuel: s.fuel,
});
