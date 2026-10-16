import { useMissionStore } from "../../stores/mission-store";
import { CITY_ZONES } from "./ForgeCityScene";
import { Button } from "../ui/button";
import { Compass, GraduationCap, Trophy, Zap, ChevronRight } from "lucide-react";

export function CityOverlay() {
  const activeZoneId = useMissionStore((s) => s.activeCityZone);
  const profile = useMissionStore((s) => s.profile);
  const go = useMissionStore((s) => s.go);
  const activeZone = CITY_ZONES.find((z) => z.id === activeZoneId);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Header Bar */}
      <header className="flex items-start justify-between gap-4">
        {/* Left: City Title & Location */}
        <div className="pointer-events-auto rounded-xl border border-cyan-500/30 bg-slate-950/70 p-3 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 text-cyan-400">
            <Compass className="size-4 animate-spin-slow" />
            <span className="text-[11px] font-bold uppercase tracking-widest">
              FORGE CITY CENTRAL SECTOR
            </span>
          </div>
          <h2 className="mt-0.5 text-base font-extrabold text-slate-100 sm:text-lg">
            Earth Ground Command Hub
          </h2>
          <p className="text-[11px] text-slate-400">
            {activeZone ? activeZone.name : "Free Exploration Plaza"}
          </p>
        </div>

        {/* Right: Trainee Profile Card & Quick Actions */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="rounded-xl border border-cyan-500/30 bg-slate-950/70 px-4 py-2.5 shadow-lg backdrop-blur-md text-right">
            <div className="flex items-center justify-end gap-1.5 text-amber-400 text-xs font-bold">
              <Trophy className="size-3.5" />
              <span>{profile.rank}</span>
            </div>
            <div className="mt-0.5 flex items-center justify-end gap-2 text-[11px]">
              <span className="text-cyan-300 font-mono font-bold">{profile.xp} XP</span>
              <span className="text-slate-500">|</span>
              <span className="text-emerald-400 font-mono font-bold">
                ${(profile.credits / 1000000).toFixed(1)}M Credits
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => go("menu")}
            className="border-slate-700 bg-slate-900/80 text-xs text-slate-300 hover:text-white"
          >
            Classic Menu
          </Button>
        </div>
      </header>

      {/* Movement Controls Hint */}
      <div className="pointer-events-auto self-start rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-[11px] text-slate-400 backdrop-blur-sm">
        <span className="font-semibold text-slate-200">Controls:</span> Use{" "}
        <kbd className="rounded bg-slate-800 px-1 py-0.5 text-cyan-300 font-mono">W</kbd>
        <kbd className="rounded bg-slate-800 px-1 py-0.5 text-cyan-300 font-mono">A</kbd>
        <kbd className="rounded bg-slate-800 px-1 py-0.5 text-cyan-300 font-mono">S</kbd>
        <kbd className="rounded bg-slate-800 px-1 py-0.5 text-cyan-300 font-mono">D</kbd> or Arrow Keys to walk.
        Hold <kbd className="rounded bg-slate-800 px-1 py-0.5 text-cyan-300 font-mono">Shift</kbd> to sprint.
      </div>

      {/* Bottom Zone Interaction Prompt (When near a building) */}
      <footer className="flex flex-col items-center">
        {activeZone ? (
          <div className="pointer-events-auto flex max-w-md animate-bounce-subtle items-center justify-between gap-4 rounded-2xl border border-cyan-400/60 bg-cyan-950/80 p-4 shadow-[0_0_30px_rgba(0,229,255,0.25)] backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeZone.icon}</span>
              <div>
                <h3 className="text-sm font-bold text-slate-100">{activeZone.name}</h3>
                <p className="text-[11px] text-cyan-200">{activeZone.sub}</p>
              </div>
            </div>
            <Button
              onClick={() => {
                if (activeZone.targetPhase) {
                  go(activeZone.targetPhase as never);
                }
              }}
              className="bg-cyan-400 font-bold text-slate-950 hover:bg-cyan-300"
            >
              Press <span className="mx-1 rounded bg-slate-950 px-1.5 py-0.5 text-cyan-300 text-xs">E</span> Enter
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </div>
        ) : (
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/60 px-4 py-2 text-xs text-slate-400 backdrop-blur-sm">
            <span>Walk toward any facility (Space Center, Academy, Launchpad, Hangar) to interact.</span>
          </div>
        )}

        {/* Quick Nav Bar */}
        <div className="pointer-events-auto mt-4 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 p-1.5 backdrop-blur-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => go("classroom")}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-cyan-400"
          >
            <GraduationCap className="size-3.5 text-emerald-400" />
            Science Academy
          </Button>
          <div className="h-4 w-px bg-slate-800" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => go("training")}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-amber-400"
          >
            <Zap className="size-3.5 text-amber-400" />
            Training Facility
          </Button>
          <div className="h-4 w-px bg-slate-800" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => go("missions")}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-cyan-400"
          >
            🚀 Mission Control
          </Button>
          <div className="h-4 w-px bg-slate-800" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => go("build")}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-orange-400"
          >
            🔧 NASA Hangar
          </Button>
        </div>
      </footer>
    </div>
  );
}
