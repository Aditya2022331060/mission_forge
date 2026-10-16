# MISSION FORGE — IMPLEMENTATION PLAN
**Team Ghost Hunter | NASA Space Apps Challenge 2026**

---

## 1. High-Level Objective
Transform Mission Forge from a flow-based sequence into an integrated, immersive, playable 3D experience where:
1. The player can walk around **Forge City** (Plaza, Space Center, Classroom, Training Center, Rocket Assembly Hangar, Launch Pad, Science Lab, Planetary Vis).
2. The player can talk to NPCs (Commander, Instructor, Engineer, Scientist) and open interactive terminals.
3. The player attends the **Classroom**, completes interactive space science lessons and quizzes to earn XP.
4. The player enters the **Astronaut Training Center** to run physics and trade-off simulations.
5. The player enters **Mission Control** to configure missions, allocate budgets, and verify constraints.
6. The player enters the **Assembly Hangar** to inspect authentic NASA spacecraft models.
7. The player triggers the **Launch Sequence** with countdown, particle effects, and transit to orbit/destination.
8. The player completes destination exploration (e.g. Moon Reconnaissance / Lunar Landing) and views verified scientific mission reports.

---

## 2. Phase-by-Phase Roadmap

### Phase A: Architecture & Audit (Completed)
- Clean production build and TypeScript validation.
- Inventory 14 authentic NASA 3D models.
- Document verified NASA API & static data sources.

### Phase B: 3D Forge City World & Character Controller
- Implement `ForgeCityScene.tsx` with:
  - Navigable pedestrian plaza with futuristic architectural structures.
  - Interactive landmark zones: Space Center, Classroom, Training Gym, Mission Control, Assembly Hangar, Launch Complex, Research Lab, Anti-Gravity Transit Station.
  - Third-person player controller with WASD/Arrow key movement, smooth camera follow, and proximity interaction markers.
  - Visual prompts: `[E] Enter Space Center`, `[E] Open Classroom`, `[E] Launch Pad`.

### Phase C: Space Center Interiors & Learning Modules
- **Space Science Classroom:**
  - 10 interactive lessons (Orbital mechanics, Tsiolkovsky equation, Solar power decay, Delta-v budgets, Planetary atmospheres, etc.).
  - Interactive quiz system with immediate feedback, explanations, and XP rewards.
- **Astronaut Training Station:**
  - Mini-simulations: Reaction wheels, fuel vs payload trade-offs, heat-shield entry angles.

### Phase D: Mission Control & Dynamic Budget Management
- Dynamic budget engine:
  - Fictional credits ($1.5M, $2.5M, $4.0M tiers).
  - Allocation breakdown: Launch Vehicle, Propellant, Instruments, Shielding, Contingency Reserve.
  - Real-time over-budget rejection and feasibility warnings.
- Seamless connection between Forge City and the existing verified physics simulator.

### Phase E: Rocket Assembly & Launch Pad Transition
- Interactive Hangar with selectable NASA 3D models (Saturn V, Apollo LM, Orion, MRO, Viking, Cassini, Voyager).
- Launch Complex with countdown audio-visual sequence, camera shake, and staged ascent to orbit.

### Phase F: Deep Space & Surface Exploration
- Earth Orbit (ISS docking).
- Moon / Mars surface descent and instrument deployment.
- Science data logging with provenance badges (NASA JPL Horizons, DONKI, NeoWs, NSSDCA).

---

## 3. Preservation Guarantee
All existing components (`Stages.tsx`, `Spacecraft.tsx`, `Nasa3DModel.tsx`, `nasa-data.ts`, `mission-sim.ts`, `nasa.functions.ts`) will be maintained and connected directly to the Forge City world loop.
