# GITCITY REPOSITORY AUDIT & FORGE CITY INTEGRATION PLAN

**Date:** October 17, 2026  
**Reference Repository:** [ethanplusai/gitcity.co](https://github.com/ethanplusai/gitcity.co)  
**Target Project:** Mission Forge (Team Ghost Hunter, NASA Space Apps Challenge 2026)  
**License of Reference:** MIT License (Copyright 2026 ethanplusai)

---

## 1. Executive Inspection & Analysis of GitCity

### What GitCity Actually Is
GitCity is a full 3D procedurally massed city engine built on **Three.js** inside a Next.js full-stack app. It converts GitHub repositories into 3D city blocks where:
- Repositories become neighborhoods.
- Directories become urban blocks and courts.
- Source files become buildings with multi-bay architectural facades, limestone/concrete/brickwork materials, interior glazed windows with night glow, roof structures (louvers, HVAC units, terrace penthouses), pedestrian pavement courses, and road corridors.

### Rendering Architecture & Techniques
- **Shared Material Library:** PBR standard materials using shared palettes (limestone `#bcb6a8`, curtain glass `#64777c`, slate roofing, asphalt roadways).
- **Geometric Modularity:** Facade bays, entrance portals, street curbs, lane markings, and light pools.
- **Performance Budgeting:** Direct rendering, instance batching (`mergeGeometries`), and bounded DPR to protect mobile and laptop GPUs.
- **Camera & Scale:** Player eye level normalized against human scale ($0.58\text{ units}$ eye vs $0.78\text{ storey}$).

---

## 2. Integration Strategy for Mission Forge

Instead of importing GitCity's heavy Next.js / PostgreSQL / GitHub OAuth backend into Mission Forge's TanStack Start / React 19 app, we **adapt and port GitCity's sophisticated 3D urban architectural generation and lighting principles** directly into Mission Forge's native Three.js / React Three Fiber stack.

### Visual Identity for Forge City
- **Aerospace Research Campus Aesthetic:**
  - Crisp white, silver, and titanium composite panels.
  - Deep aerospace blue and cyan-tinted architectural glazing (`#00E5FF`, `#38BDF8`).
  - Polished concrete plazas, paved pedestrian walkways, road networks with curbs and lane markings.
  - Realistic daytime lighting: Sun directional key light with soft shadow mapping, atmospheric skybox, and warm interior window glow.

### The 6 Key Districts:
1. **Central City Plaza:** Pedestrian spawn hub with city monument, wayfinding signage, decorative landscaping, and direct vista toward the Space Center.
2. **Mission Forge Space Center:** Hero architectural landmark with a grand illuminated double-height glass atrium, entrance rotunda, and enterable lobby.
3. **Research Campus:** Clean modular laboratory and aerospace engineering blocks with connected elevated skybridges.
4. **Rocket Engineering Zone:** Industrial assembly hangars, high-bay gantry cranes, heavy equipment staging, and wide service roads.
5. **Spaceport & Launch Pad Complex:** Orbital launch pad with red umbilical tower, flame trench, and Saturn V / heavy-lift integration.
6. **Civic & Academy District:** Enterable classroom and training facilities, landscaped green parks, and futuristic mag-transit lines.

### Enterable Interiors:
1. **Space Center Main Lobby:** Reception desk, digital mission monitors, large floor-to-ceiling glass windows, and seating.
2. **Space Science Classroom:** Student desks, instructor podium, large holographic projection screens, and orbital diagrams.
3. **Research Laboratory:** Clean-room benches, experiment racks, analysis consoles, and sample containers.
4. **Rocket Assembly Hangar:** Heavy overhead gantry beams, tool racks, rocket fuselage assembly cradle, and high clearance.

---

## 3. Preservation of Existing Features
- **Zero Regression on Mission Simulator:** All existing flight scenes (`Universe.tsx`, `Stages.tsx`, `Spacecraft.tsx`), NASA 3D models (`public/models/*.glb`), and mission planning workflows remain 100% intact and functional.
- Forge City serves as the primary explorable 3D ground world that seamlessly bridges the player into missions and training.
