import type { Phase } from "../../../stores/mission-store";

export interface ZoneLocation {
  id: string;
  name: string;
  sub: string;
  pos: [number, number, number];
  radius: number;
  color: string;
  targetPhase?: Phase;
  icon: string;
}

export const FORGE_CITY_DISTRICTS: ZoneLocation[] = [
  {
    id: "space-center",
    name: "Mission Forge Space Center",
    sub: "Main Architectural Landmark & Flight Operations",
    pos: [0, 0, -22],
    radius: 6.5,
    color: "#00E5FF",
    targetPhase: "missions",
    icon: "🚀",
  },
  {
    id: "classroom",
    name: "Space Science Academy",
    sub: "Astrodynamics Classroom & Interactive Solar Vis",
    pos: [-24, 0, -10],
    radius: 5.5,
    color: "#69F0AE",
    targetPhase: "classroom",
    icon: "📚",
  },
  {
    id: "training",
    name: "Astronaut Training Facility",
    sub: "Human Spaceflight & Reaction Wheel Drills",
    pos: [24, 0, -10],
    radius: 5.5,
    color: "#FFD700",
    targetPhase: "training",
    icon: "⚡",
  },
  {
    id: "research-lab",
    targetPhase: "research",
    name: "Aerospace Research Laboratories",
    sub: "Lunar Regolith Analysis & Materials Testing",
    pos: [26, 0, 14],
    radius: 5.5,
    color: "#38BDF8",
    icon: "🔬",
  },
  {
    id: "hangar",
    name: "Rocket Assembly Hangar (VIF)",
    sub: "Vehicle Integration & NASA 3D Hardware",
    pos: [-24, 0, 14],
    radius: 6.0,
    color: "#FF9100",
    targetPhase: "build",
    icon: "🔧",
  },
  {
    id: "launchpad",
    name: "Orbital Launch Complex 39X",
    sub: "Heavy-Lift Pad, Umbilical Tower & Gantry",
    pos: [0, 0, -48],
    radius: 7.0,
    color: "#FF5252",
    targetPhase: "check",
    icon: "🔥",
  },
];
