import { useState } from "react";
import { ArrowLeft, BookOpen, CheckCircle, HelpCircle, Trophy } from "lucide-react";
import { Button } from "../ui/button";
import { useMissionStore } from "../../stores/mission-store";

export interface Lesson {
  id: string;
  title: string;
  topic: string;
  duration: string;
  xpReward: number;
  summary: string;
  keyPoints: string[];
  formula?: string;
  formulaNote?: string;
  quiz: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
}

export const CLASSROOM_LESSONS: Lesson[] = [
  {
    id: "orbit-basics",
    title: "Orbital Mechanics & Kepler's Laws",
    topic: "Astrodynamics",
    duration: "4 mins",
    xpReward: 100,
    summary:
      "Planets and spacecraft follow elliptical orbits around a gravitational center of mass. An orbit is maintained when forward velocity exactly balances downward gravitational acceleration.",
    keyPoints: [
      "Low Earth Orbit (LEO) velocity requires ~7.8 km/s to balance Earth's gravity.",
      "Kepler's First Law: Orbits are ellipses with the primary body at one focus.",
      "Perigee/Periapsis is closest approach (highest velocity); Apogee/Apoapsis is furthest (lowest velocity).",
    ],
    formula: "v_{orbital} = \\sqrt{\\frac{G \\cdot M}{r}}",
    formulaNote: "Orbital velocity decreases with orbital radius (higher orbits move slower).",
    quiz: {
      question: "What happens to a spacecraft's speed as it climbs to a higher circular orbit?",
      options: [
        "Its orbital speed increases to overcome gravity",
        "Its orbital speed decreases as radius increases",
        "Its speed stays exactly 7.8 km/s regardless of altitude",
        "It stops moving and stays fixed over one point",
      ],
      correct: 1,
      explanation:
        "Because orbital velocity v = sqrt(GM/r), as orbital altitude (r) increases, gravitational acceleration decreases and orbital velocity actually decreases.",
    },
  },
  {
    id: "tsiolkovsky-rocket",
    title: "The Tsiolkovsky Rocket Equation & Delta-V",
    topic: "Propulsion",
    duration: "5 mins",
    xpReward: 150,
    summary:
      "Delta-v (Δv) represents the total velocity change a rocket can produce. It depends exponentially on propellant mass fraction and linearly on exhaust velocity.",
    keyPoints: [
      "Specific Impulse (Isp) measures propulsion efficiency: how many seconds 1 kg of fuel produces 1 kg-force of thrust.",
      "Chemical rockets (RL10) offer high thrust but moderate Isp (~450 s).",
      "Ion propulsion (NSTAR) offers low thrust but massive Isp (~3,100 s), saving enormous propellant mass.",
    ],
    formula: "\\Delta v = I_{sp} \\cdot g_0 \\cdot \\ln\\left(\\frac{m_0}{m_f}\\right)",
    formulaNote: "Exponential propellant penalty: doubling Δv requires squaring the mass ratio.",
    quiz: {
      question: "Why can't engineers simply add more fuel tanks endlessly to reach any planet quickly?",
      options: [
        "Fuel has zero weight in space",
        "Each extra tank adds dry mass and fuel weight, yielding diminishing returns due to the natural logarithm",
        "Chemical fuel expires after 3 days",
        "Rockets cannot carry more than 2 engines",
      ],
      correct: 1,
      explanation:
        "The Tsiolkovsky equation dictates that adding fuel adds mass that must also be accelerated, resulting in diminishing Δv returns unless staging or higher Isp engines are used.",
    },
  },
  {
    id: "solar-power-decay",
    title: "Deep Space Power: Inverse-Square Law vs RTG",
    topic: "Spacecraft Systems",
    duration: "4 mins",
    xpReward: 120,
    summary:
      "Solar irradiance drops with the square of the distance from the Sun. Beyond Mars and the asteroid belt, nuclear RTGs (Radioisotope Thermoelectric Generators) become necessary.",
    keyPoints: [
      "At Earth (1 AU), solar panels receive 100% baseline irradiance.",
      "At Mars (1.52 AU), solar energy is only (1 / 1.52^2) ≈ 43% of Earth.",
      "At Jupiter (5.2 AU), solar energy drops to (1 / 5.2^2) ≈ 3.7%, requiring giant solar wings (like Juno or Europa Clipper) or RTGs.",
    ],
    formula: "P(r) = \\frac{P_0}{r_{AU}^2}",
    formulaNote: "Inverse-Square Law governs all spherical radiation in deep space.",
    quiz: {
      question: "If a spacecraft generates 1,000 W at Earth (1 AU), approximately how much solar power does it generate at Mars (1.52 AU)?",
      options: ["1,000 W", "750 W", "430 W", "100 W"],
      correct: 2,
      explanation:
        "Using 1000 / (1.52^2) = 1000 / 2.31 ≈ 433 W (approximately 43% of the power available at Earth orbit).",
    },
  },
  {
    id: "space-weather",
    title: "Space Weather & Radiation Hazards",
    topic: "Mission Safety",
    duration: "5 mins",
    xpReward: 140,
    summary:
      "Outside Earth's protective magnetosphere, spacecraft face Coronal Mass Ejections (CMEs), solar proton events, and galactic cosmic rays.",
    keyPoints: [
      "NASA's DONKI system monitors CMEs, solar flares, and geomagnetic storms in real time.",
      "Radiation shields (aluminum/polyethylene Whipple shields) protect delicate electronics from single-event upsets.",
      "Solar maximum cycles increase flare risk; safe-mode protocols orient spacecraft shields toward the Sun.",
    ],
    quiz: {
      question: "Which NASA database provides operational space-weather event notifications used in Mission Forge?",
      options: ["NASA DONKI", "NASA APOD", "NASA NeoWs", "NASA Horizons"],
      correct: 0,
      explanation:
        "NASA DONKI (Database Of Notifications, Knowledge, Information) tracks Coronal Mass Ejections, solar energetic particles, and solar flares.",
    },
  },
];

export function ClassroomView() {
  const [activeLesson, setActiveLesson] = useState<Lesson>(CLASSROOM_LESSONS[0]!);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const go = useMissionStore((s) => s.go);
  const profile = useMissionStore((s) => s.profile);
  const addXp = useMissionStore((s) => s.addXp);
  const completeLesson = useMissionStore((s) => s.completeLesson);
  const completeQuiz = useMissionStore((s) => s.completeQuiz);

  const isLessonDone = profile.completedLessons.includes(activeLesson.id);
  const isQuizDone = profile.completedQuizzes.includes(activeLesson.id);

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setSelectedOption(null);
    setQuizSubmitted(false);
  };

  const handleQuizSubmit = () => {
    if (selectedOption === null) return;
    setQuizSubmitted(true);
    if (selectedOption === activeLesson.quiz.correct) {
      if (!isQuizDone) {
        addXp(activeLesson.xpReward, `Passed Quiz: ${activeLesson.title}`);
        completeQuiz(activeLesson.id);
        completeLesson(activeLesson.id);
      }
    }
  };

  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-slate-950/90 p-4 backdrop-blur-md sm:p-8">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between border-b border-cyan-500/30 pb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => go("city")}>
            <ArrowLeft className="mr-1.5 size-4" /> Exit to Forge City
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-cyan-400 sm:text-2xl">
              MISSION FORGE SPACE SCIENCE ACADEMY
            </h1>
            <p className="text-xs text-slate-400">
              Interactive Spaceflight & Orbital Physics Classroom · Cadet Rank: <strong className="text-cyan-300">{profile.rank}</strong> ({profile.xp} XP)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-cyan-950/60 px-3 py-1.5 border border-cyan-500/40 text-cyan-300">
          <Trophy className="size-4 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider">{profile.xp} XP</span>
        </div>
      </header>

      {/* Main Layout */}
      <div className="grid flex-1 grid-cols-1 gap-6 overflow-hidden md:grid-cols-12">
        {/* Lesson List (Left column) */}
        <aside className="space-y-2 overflow-y-auto md:col-span-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Curriculum Syllabus</h3>
          {CLASSROOM_LESSONS.map((l) => {
            const isCompleted = profile.completedQuizzes.includes(l.id);
            const isSelected = activeLesson.id === l.id;
            return (
              <button
                key={l.id}
                onClick={() => handleSelectLesson(l)}
                className={`flex w-full flex-col rounded-lg border p-3 text-left transition ${
                  isSelected
                    ? "border-cyan-400 bg-cyan-950/40 text-cyan-100"
                    : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cyan-400">{l.topic}</span>
                  {isCompleted && <CheckCircle className="size-4 text-emerald-400" />}
                </div>
                <h4 className="mt-1 text-sm font-bold">{l.title}</h4>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{l.duration}</span>
                  <span className="text-amber-400">+{l.xpReward} XP</span>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Lesson Content & Quiz (Right column) */}
        <main className="flex flex-col space-y-4 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900/80 p-6 md:col-span-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-cyan-950 px-2 py-0.5 text-[11px] font-bold uppercase text-cyan-300">
                {activeLesson.topic}
              </span>
              <span className="text-xs text-slate-400">Reward: {activeLesson.xpReward} XP</span>
            </div>
            <h2 className="mt-2 text-xl font-bold text-slate-100 sm:text-2xl">{activeLesson.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{activeLesson.summary}</p>
          </div>

          {/* Key Takeaways */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <BookOpen className="size-4" /> Key Scientific Takeaways
            </h4>
            <ul className="mt-2.5 space-y-1.5 text-xs text-slate-300">
              {activeLesson.keyPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Math / Physics Formula if applicable */}
          {activeLesson.formula && (
            <div className="rounded-lg border border-cyan-900/40 bg-cyan-950/20 p-4 text-center">
              <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">
                Mathematical Model
              </span>
              <div className="my-2 font-mono text-base font-bold text-cyan-200">
                {activeLesson.formula}
              </div>
              <p className="text-[11px] text-slate-400">{activeLesson.formulaNote}</p>
            </div>
          )}

          {/* Interactive Quiz Station */}
          <div className="mt-auto border-t border-slate-800 pt-5">
            <div className="flex items-center justify-between">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <HelpCircle className="size-4" /> Comprehension Check
              </h4>
              {isQuizDone && (
                <span className="rounded bg-emerald-950/60 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
                  Passed (+{activeLesson.xpReward} XP Earned)
                </span>
              )}
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-200">
              {activeLesson.quiz.question}
            </p>

            {/* Options */}
            <div className="mt-3 space-y-2">
              {activeLesson.quiz.options.map((opt, idx) => {
                const isCorrect = idx === activeLesson.quiz.correct;
                const isChosen = selectedOption === idx;
                let btnStyle = "border-slate-700 bg-slate-950/40 text-slate-300 hover:border-slate-600";

                if (quizSubmitted) {
                  if (isCorrect) {
                    btnStyle = "border-emerald-500 bg-emerald-950/40 text-emerald-200";
                  } else if (isChosen) {
                    btnStyle = "border-rose-500 bg-rose-950/40 text-rose-200";
                  }
                } else if (isChosen) {
                  btnStyle = "border-cyan-400 bg-cyan-950/50 text-cyan-200";
                }

                return (
                  <button
                    key={idx}
                    disabled={quizSubmitted}
                    onClick={() => setSelectedOption(idx)}
                    className={`flex w-full items-center justify-between rounded-lg border p-2.5 text-left text-xs transition ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {quizSubmitted && isCorrect && <CheckCircle className="size-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            {/* Feedback / Submit */}
            <div className="mt-4 flex items-center justify-between">
              {quizSubmitted ? (
                <div className="flex-1 mr-4 text-xs">
                  <strong className={selectedOption === activeLesson.quiz.correct ? "text-emerald-400" : "text-rose-400"}>
                    {selectedOption === activeLesson.quiz.correct ? "Correct! " : "Incorrect. "}
                  </strong>
                  <span className="text-slate-300">{activeLesson.quiz.explanation}</span>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400">Select an answer and submit for XP</div>
              )}

              {!quizSubmitted && (
                <Button
                  disabled={selectedOption === null}
                  onClick={handleQuizSubmit}
                  className="bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold"
                >
                  Submit Answer
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
