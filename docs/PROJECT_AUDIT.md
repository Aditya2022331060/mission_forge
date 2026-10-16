# MISSION FORGE — PROJECT AUDIT
**Date:** October 16, 2026  
**Project:** Mission Forge (Challenge 13: Space Mission Design Game)  
**Team:** Team Ghost Hunter  
**Event:** NASA Space Apps Challenge 2026 — Bangladesh  

---

## 1. Executive Summary & Repository Status
Mission Forge is an educational space mission design application built with React 19, Vite, TanStack Router/Start, Tailwind CSS v4, and Three.js / React Three Fiber (`@react-three/fiber` & `@react-three/drei`).

- **TypeScript Compilation:** Clean (0 errors via `npx tsc --noEmit`).
- **Production Build:** Clean (`vite build` & Nitro server bundle pass with code 0).
- **Core Simulator:** Tsiolkovsky rocket equation, Keplerian orbital mechanics, power/mass budgets, and hazard resolution.
- **Visuals:** R3F rendering with 14 authentic NASA 3D models (`.glb`), Draco compression support, and procedural space bodies.

---

## 2. Technology Stack & Environment
| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | React / React DOM | ^19.2.0 | Reactive component rendering |
| **Build & Dev Tooling** | Vite / Rolldown | 8.1.5 / 1.2.1 | Ultra-fast bundling |
| **Full-Stack / SSR** | TanStack Start & Nitro | 1.168.35 / 3.0.260603-beta | Cloudflare & Vercel deployment engine |
| **Routing** | TanStack React Router | 1.170.18 | Type-safe declarative client routing |
| **3D Engine** | Three.js | ^0.186.0 | WebGL rendering |
| **React 3D Bridge** | @react-three/fiber | ^9 | Declarative Three.js scene graphs |
| **3D Helpers** | @react-three/drei | ^10 | Camera controls, Draco, GLTF loaders, environments |
| **State Management** | Zustand | ^5.0.15 | Mission state & local persistence (`mission-forge-v3`) |
| **Styling & Design** | Tailwind CSS v4 | ^4.2.1 | Modern utility styling |
| **Icons** | Lucide React | ^0.575.0 | Clean aerospace UI iconography |
| **Localization** | i18next & react-i18next | ^26.4.2 / ^17.0.15 | Multi-language support (EN, BN, HI, ES, AR, FR) |

---

## 3. NASA 3D Asset Inventory (`public/models/`)
All 14 models have been downloaded, verified, and mapped in `src/lib/nasa-3d-registry.ts`:
1. `saturn-v.glb` (927 KB) — Apollo Saturn V Moon Rocket
2. `apollo-lunar-module.glb` (716 KB) — Apollo LM Eagle
3. `iss.glb` (477 KB) — International Space Station
4. `mro.glb` (2.65 MB) — Mars Reconnaissance Orbiter
5. `viking-lander.glb` (1.85 MB) — Viking Mars Lander
6. `ingenuity.glb` (2.02 MB) — Mars Helicopter Ingenuity
7. `dawn.glb` (927 KB) — Dawn Spacecraft (Vesta / Ceres)
8. `galileo.glb` (248 KB) — Galileo Jupiter Orbiter
9. `cassini-huygens.glb` (1.66 MB) — Cassini-Huygens Saturn Orbiter
10. `voyager-probe.glb` (286 KB) — Voyager 1 & 2 Interstellar Probes
11. `hubble.glb` (1.69 MB) — Hubble Space Telescope
12. `parker-solar-probe.glb` (444 KB) — Parker Solar Probe
13. `deep-space-1.glb` (935 KB) — Deep Space 1 (Ion Propulsion)
14. `asteroid-bennu.glb` (330 KB) — OSIRIS-REx Bennu Target

---

## 4. Scientific Engine & Calculations
- **Tsiolkovsky Rocket Equation:**
  $$\Delta v = I_{sp} \cdot g_0 \cdot \ln\left(\frac{m_{wet}}{m_{dry}}\right)$$
  Validated with physical boundaries ($m_{wet} > m_{dry} > 0$).
- **Power Budgets:**
  Inverse-square solar decay ($P_{gen} = P_0 / r_{AU}^2$) + constant RTG decay ($200\text{ W}$ each).
- **Communication Latency:**
  $t_{delay} = \frac{2 \cdot d_{AU} \cdot 1.496\times 10^8\text{ km}}{c}$.
- **Mass Budget Accounting:**
  Dry mass + Propellant tank mass + Science instruments mass + Power mass + Shield mass.

---

## 5. NASA API & Data Source Status
- **NASA JPL Horizons API:** `LIVE` / `CACHED` (queried server-side via `nasa.functions.ts` for ephemerides; static fallback for offline mode).
- **NASA DONKI:** Space weather hazard verification (CME, Solar Flare radiation).
- **NASA NeoWs:** Near-Earth Asteroid trajectory & close encounter parameters.
- **NASA NSSDCA Planetary Fact Sheet:** `VERIFIED_STATIC` (planetary gravity, AU, orbital periods, atmospheres).
- **NASA 3D Resources:** `VERIFIED_STATIC` (authentic NASA public domain 3D models).
