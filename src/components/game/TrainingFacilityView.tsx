import { useState } from "react";
import { ArrowLeft, CheckCircle2, RotateCcw, ShieldAlert, Sparkles, Trophy } from "lucide-react";
import { Button } from "../ui/button";
import { useMissionStore } from "../../stores/mission-store";

export interface TrainingDrill {
  id: string;
  title: string;
  type: string;
  xpReward: number;
  description: string;
  questionOrChallenge: string;
  choices: {
    label: string;
    isOptimal: boolean;
    feedback: string;
  }[];
}

export const DRILLS: TrainingDrill[] = [
  {
    id: "drill-delta-v-tradeoff",
    title: "Propellant Mass vs Payload Capacity Drill",
    type: "Rocket Engineering",
    xpReward: 150,
    description:
      "A mission to Mars requires 4.2 km/s Δv. You are balancing scientific instrument weight against fuel tank capacity.",
    questionOrChallenge:
      "Your current dry spacecraft mass is 3,200 kg with 3 science instruments. Adding a heavy Synthetic Aperture Radar (+450 kg) drops your Δv margin below safe transit limits. How do you resolve this?",
    choices: [
      {
        label: "Switch to high-Isp ion propulsion or upgrade to a larger launch vehicle tier with additional tank stages",
        isOptimal: true,
        feedback:
          "Correct! Upgrading specific impulse (Isp) or launch vehicle class expands the propellant capacity without violating mass constraints.",
      },
      {
        label: "Remove the heat shield and batteries to save weight for the radar",
        isOptimal: false,
        feedback:
          "Dangerous: Removing thermal protection or power reserves risks spacecraft destruction during Mars atmospheric entry or eclipse.",
      },
      {
        label: "Launch without enough fuel and hope for a solar flare push",
        isOptimal: false,
        feedback:
          "Unscientific: Solar flares do not provide directed spacecraft propulsion and would destroy unshielded avionics.",
      },
    ],
  },
  {
    id: "drill-reaction-wheel",
    title: "Attitude Control & Reaction Wheel Desaturation",
    type: "Guidance & Navigation",
    xpReward: 120,
    description:
      "During cruise, solar radiation pressure steadily builds angular momentum in the spacecraft's reaction wheels.",
    questionOrChallenge:
      "Telemetry indicates Reaction Wheel 2 is spinning at 95% maximum RPM. If it saturates, the spacecraft cannot point its high-gain antenna to Earth. What is the standard recovery drill?",
    choices: [
      {
        label: "Fire cold-gas or RCS thrusters in opposition while braking the wheel to desaturate stored momentum",
        isOptimal: true,
        feedback:
          "Optimal: RCS thruster pulses create an external torque, allowing the wheels to spin down safely to zero RPM.",
      },
      {
        label: "Turn off the spacecraft power and let it drift freely",
        isOptimal: false,
        feedback:
          "Catastrophic: Turning off avionics causes telemetry blackout and thermal freezing.",
      },
      {
        label: "Spin all other wheels in the same direction to increase total speed",
        isOptimal: false,
        feedback:
          "Failure: Spinning all wheels in the same direction accelerates angular momentum buildup.",
      },
    ],
  },
  {
    id: "drill-heatshield-angle",
    title: "Atmospheric Entry Corridor Precision",
    type: "Descent & Landing",
    xpReward: 140,
    description:
      "When entering planetary atmospheres (Mars or Earth), entry flight path angle (FPA) must remain within a narrow corridor.",
    questionOrChallenge:
      "What happens if your spacecraft's atmospheric entry angle is too shallow (e.g. -11° instead of -12.5°)?",
    choices: [
      {
        label: "The spacecraft skips off the upper atmosphere back into deep space like a stone on water",
        isOptimal: true,
        feedback:
          "Correct: Too shallow an angle fails to generate enough aerodynamic drag to capture, skipping the craft into orbit.",
      },
      {
        label: "The spacecraft instantly burns up from extreme G-loads",
        isOptimal: false,
        feedback:
          "Incorrect: Extreme G-loads and burn-up occur when the entry angle is too steep, not too shallow.",
      },
      {
        label: "The parachutes deploy immediately and float upwards",
        isOptimal: false,
        feedback:
          "Physically impossible in hypersonic upper atmospheric layers.",
      },
    ],
  },
];

export function TrainingFacilityView() {
  const [activeDrill, setActiveDrill] = useState<TrainingDrill>(DRILLS[0]!);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [drillSubmitted, setDrillSubmitted] = useState<boolean>(false);
  const go = useMissionStore((s) => s.go);
  const profile = useMissionStore((s) => s.profile);
  const addXp = useMissionStore((s) => s.addXp);
  const completeTraining = useMissionStore((s) => s.completeTrainingModule);

  const isCompleted = profile.completedTraining.includes(activeDrill.id);

  const handleSelectDrill = (drill: TrainingDrill) => {
    setActiveDrill(drill);
    setSelectedIdx(null);
    setDrillSubmitted(false);
  };

  const handleDrillSubmit = () => {
    if (selectedIdx === null) return;
    setDrillSubmitted(true);
    const chosen = activeDrill.choices[selectedIdx];
    if (chosen && chosen.isOptimal && !isCompleted) {
      addXp(activeDrill.xpReward, `Completed Drill: ${activeDrill.title}`);
      completeTraining(activeDrill.id);
    }
  };

  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-slate-950/90 p-4 backdrop-blur-md sm:p-8">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between border-b border-amber-500/30 pb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => go("city")}>
            <ArrowLeft className="mr-1.5 size-4" /> Exit to Forge City
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-amber-400 sm:text-2xl">
              ASTRONAUT & MISSION TRAINING FACILITY
            </h1>
            <p className="text-xs text-slate-400">
              Interactive Spaceflight Simulation Drills & Contingency Exercises
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-amber-950/60 px-3 py-1.5 border border-amber-500/40 text-amber-300">
          <Trophy className="size-4 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider">{profile.xp} XP</span>
        </div>
      </header>

      {/* Main Layout */}
      <div className="grid flex-1 grid-cols-1 gap-6 overflow-hidden md:grid-cols-12">
        {/* Drill Menu */}
        <aside className="space-y-2 overflow-y-auto md:col-span-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Simulation Stations</h3>
          {DRILLS.map((d) => {
            const done = profile.completedTraining.includes(d.id);
            const isSelected = activeDrill.id === d.id;
            return (
              <button
                key={d.id}
                onClick={() => handleSelectDrill(d)}
                className={`flex w-full flex-col rounded-lg border p-3 text-left transition ${
                  isSelected
                    ? "border-amber-400 bg-amber-950/40 text-amber-100"
                    : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-400">{d.type}</span>
                  {done && <CheckCircle2 className="size-4 text-emerald-400" />}
                </div>
                <h4 className="mt-1 text-sm font-bold">{d.title}</h4>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Sparkles className="size-3 text-amber-400" /> Interactive Drill
                  </span>
                  <span className="text-amber-400">+{d.xpReward} XP</span>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Drill Simulation Workspace */}
        <main className="flex flex-col space-y-4 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900/80 p-6 md:col-span-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-950 px-2 py-0.5 text-[11px] font-bold uppercase text-amber-300">
                {activeDrill.type}
              </span>
              <span className="text-xs text-slate-400">Reward: {activeDrill.xpReward} XP</span>
            </div>
            <h2 className="mt-2 text-xl font-bold text-slate-100 sm:text-2xl">{activeDrill.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{activeDrill.description}</p>
          </div>

          {/* Scenario Challenge */}
          <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <ShieldAlert className="size-4" /> Operational Dilemma
            </h4>
            <p className="mt-2 text-sm font-semibold text-slate-200">
              {activeDrill.questionOrChallenge}
            </p>
          </div>

          {/* Decision Choices */}
          <div className="mt-auto border-t border-slate-800 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Flight Controller Command:
            </h4>

            <div className="mt-3 space-y-2">
              {activeDrill.choices.map((c, idx) => {
                const isChosen = selectedIdx === idx;
                let btnStyle = "border-slate-700 bg-slate-950/40 text-slate-300 hover:border-slate-600";

                if (drillSubmitted) {
                  if (c.isOptimal) {
                    btnStyle = "border-emerald-500 bg-emerald-950/40 text-emerald-200";
                  } else if (isChosen) {
                    btnStyle = "border-rose-500 bg-rose-950/40 text-rose-200";
                  }
                } else if (isChosen) {
                  btnStyle = "border-amber-400 bg-amber-950/50 text-amber-200";
                }

                return (
                  <button
                    key={idx}
                    disabled={drillSubmitted}
                    onClick={() => setSelectedIdx(idx)}
                    className={`flex w-full items-center justify-between rounded-lg border p-3 text-left text-xs transition ${btnStyle}`}
                  >
                    <span>{c.label}</span>
                    {drillSubmitted && c.isOptimal && <CheckCircle2 className="size-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            {/* Feedback / Result */}
            <div className="mt-4 flex items-center justify-between">
              {drillSubmitted && selectedIdx !== null ? (
                <div className="flex-1 mr-4 text-xs">
                  <strong className={activeDrill.choices[selectedIdx]?.isOptimal ? "text-emerald-400" : "text-rose-400"}>
                    {activeDrill.choices[selectedIdx]?.isOptimal ? "Simulation Passed! " : "Drill Sub-Optimal. "}
                  </strong>
                  <span className="text-slate-300">{activeDrill.choices[selectedIdx]?.feedback}</span>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400">Select procedure to execute drill</div>
              )}

              {drillSubmitted ? (
                <Button
                  onClick={() => {
                    setDrillSubmitted(false);
                    setSelectedIdx(null);
                  }}
                  variant="outline"
                  className="flex items-center gap-1.5"
                >
                  <RotateCcw className="size-3.5" /> Replay Drill
                </Button>
              ) : (
                <Button
                  disabled={selectedIdx === null}
                  onClick={handleDrillSubmit}
                  className="bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold"
                >
                  Execute Procedure
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
