# Mission Forge

An interactive, scientifically transparent, browser-based space mission design and simulation game: build a spacecraft, plan orbital trajectories, launch in 3D, and simulate real astronautical physics.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/Aditya2022331060/mission_forge)
[![🚀 Play Mission Forge](https://img.shields.io/badge/🚀%20Play%20Now-mission--forge--ochre.vercel.app-0b3d91.svg?style=for-the-badge)](https://mission-forge-ochre.vercel.app)
[![NASA Space Apps](https://img.shields.io/badge/NASA%20Space%20Apps-2026-blue.svg)](https://www.spaceappschallenge.org/)

---

### Team Information

**Team Name:** Team Ghost Hunter  
**Project:** Mission Forge  
**Challenge:** Challenge 13 — Space Mission Design Game  
**Event:** NASA Space Apps Challenge 2026 — Bangladesh  

| Member | Role |
| --- | --- |
| **Arefin Khan Siam** | Team Lead |
| **Melita Mehzabin Neha** | Technical Expert |
| **Angkon Roy** | Technical Expert |
| **Taspiha Tabassum** | UI/UX + Backend |
| **Rizvi Hasan** | Graphics Designer |

**Team Size:** 5 Members

---

## Judge Quick Start

**Live URL:** [https://mission-forges.vercel.app](https://mission-forges.vercel.app) *(Best experienced on desktop or landscape on tablets/mobile)*

### 60-Second Demo Path
1. **Home:** Review live APOD and space telemetry, click **Start Mission**, choose **Mars** (or Europa / Titan / Moon).
2. **Objective & Route:** Select mission profile (Surface Sample Return, Orbital Survey, or Deep Probe) and choose trajectory (Hohmann Transfer vs Fast Insertion).
3. **Subsystems:** Allocate budget, fuel (Hydrolox / Methalox / Xenon), power (Solar Arrays vs RTG), high-gain comms dish, and scientific instrument payloads.
4. **Hangar (3D):** Toggle between modular procedural spacecraft and official NASA 3D flight hardware (Curiosity, Ingenuity, Cassini, Bennu).
5. **GO/NO-GO Poll:** Experience live space weather diagnostics (polls live NASA DONKI solar flare data; holds launch on X/M-class flares).
6. **Launch & Flight:** Execute SLS Block 1 staged launch sequence, manage deep space flight, and respond to dynamic space debris hazard pop-ups.
7. **Landing & Report:** Watch destination-specific Entry, Descent, and Landing (EDL) and review the comprehensive scientific return debrief.

---

## The Problem

Designing interplanetary space missions requires rigorous trade-offs between vehicle mass, propellant fraction, electrical power, communication latency, and planetary hazard risks. Students and science enthusiasts rarely get to see how these interconnected decisions influence each other in real-time.

---

## Our Solution

**Mission Forge** places players in the role of Flight Directors and Aerospace Engineers. The application bridges open government space data and game design into a seamless 23-phase mission lifecycle:

$$\text{Briefing} \longrightarrow \text{Design \& Build} \longrightarrow \text{Trajectory Planning} \longrightarrow \text{Launch} \longrightarrow \text{Cruise \& Rescue} \longrightarrow \text{Landing \& Debrief}$$

The **Tsiolkovsky Rocket Equation** and the **Inverse-Square Law of Solar Radiation** mathematically dictate whether a spacecraft can reach its destination and operate its payloads.

---

## Key Features

- **9 Solar System Destinations:** Earth, Moon, Mars, Mercury, Europa, Titan, Ceres, Jupiter, and Saturn with authentic planetary gravities, scale heights, and surface environments.
- **Official NASA 3D Resources:** 11 flight-proven spacecraft 3D models (`.glb`) and 8 authentic planetary cylindrical surface maps (`.webp`/`.jpg`) sourced directly from NASA Centers (JPL-Caltech, GSFC, JSC, Langley).
- **Tsiolkovsky Rocket Equation Engine:** Live dynamic calculation of $\Delta v = I_{\text{sp}} \cdot g_0 \cdot \ln(m_{\text{wet}} / m_{\text{dry}})$ with authentic propulsion systems (Hydrolox RL10, Methalox Raptor, Xenon Ion NSTAR, Hall Thruster HERMeS).
- **Multi-Agency Open Data Platform:** Comprehensive catalog and discovery engine for NASA and all 17 Space Apps Challenge 2026 partner space agencies (ESA, JAXA, CSA, DLR, UKSA, ISRO, ASI, CNES, and more).
- **Flight Director GO/NO-GO Launch Poll:** Actively evaluates real-time space weather using NASA DONKI flare telemetry; holds launch if geomagnetic solar storms are detected.
- **Real-Time Astronomical Calculations:** Real distances and speed-of-light communications delay ($t_{\text{delay}} = d / c$) computed live via NASA JPL Horizons ephemerides.
- **3D Staged Launch & Flight:** SLS Block 1 staged ascent (SRB jettison, Core Stage MECO, orbital insertion), 6-DOF docking rendezvous, and atmospheric entry.
- **Failure & Recovery Architecture:** Non-lethal contingency diagnostics in the `rescue` phase teaching real aerospace problem-solving (e.g., Apollo 13 / SOHO recovery).
- **Interactive Science Data Center:** Deep exploration suite for APOD, NeoWs asteroids, DSCOVR EPIC, Mars Rover imagery, JPL SBDB, and Sentry impact risk.

---

## NASA & International Data Sources

All external data queries route through server functions with graceful fallback to labeled cached archives (`DEMO DATA` badge rendered during offline or rate-limited states).

| Source | Agency | Dataset / Functionality | Game Play Impact | Live / Fallback |
| :--- | :--- | :--- | :--- | :--- |
| **NASA DONKI** | NASA GSFC | Real-time solar flare (FLR) events | **Holds launch poll on X/M-class solar storms** | Live, Cached baseline |
| **JPL Horizons** | NASA JPL | Heliocentric planet coordinate vectors | **Computes live distance & light-delay latency** | Live, Keplerian model |
| **NASA NeoWs** | NASA / CNEOS | Near-Earth Object approach tracking | Populates real-time debris hazard field in LEO | Live, Cached catalog |
| **JPL SBDB** | NASA JPL | Asteroid 101955 Bennu orbital parameters | Governs intercept $\Delta v$ for deep-space sample run | Live, Cached baseline |
| **NASA 3D Resources**| NASA Centers | 11 Spacecraft models & 8 Planet maps | **Renders physical 3D meshes and PBR textures** | Local bundled (`public/`) |
| **DSCOVR EPIC** | NASA GSFC | Full-disc natural color Earth imagery | Live Earth telemetry view during launch insertion | Live, DSCOVR archive |
| **Mars Rover Photos** | NASA JPL | Curated Perseverance / Curiosity imagery | Surface reconnaissance in Mars landing briefing | Live, Curated archive |
| **NASA APOD** | NASA | Daily Astronomy Picture & metadata | Daily astronomical briefing in Main Menu | Live, Cached archive |
| **17 Partner Agencies**| ESA, JAXA, etc.| Portals, STAC APIs, and open catalogs | Multi-agency exploration in Data Center Modal | Discovered / Cataloged |

---

## Technology Stack

- **Frontend Framework:** React 19, TanStack Start v1 (SSR and Server Functions), Vite 8.1
- **3D Graphics & Simulation:** Three.js (r186), `@react-three/fiber` (v9), `@react-three/drei` (v10)
- **State Management:** Zustand v5 with 23 operational mission lifecycle phases
- **Styling & UI:** Tailwind CSS v4, Lucide Icons, Radix UI Primitives, Glassmorphism design system
- **Deployment & Serverless:** Vercel Build Output API v3 with Nitro serverless engine
- **Internationalization:** i18next supporting multilingual mission interfaces

---

## Local Development Setup

### Prerequisites
- Node.js 20+ installed
- npm (or bun)

### Quick Start
```bash
# Clone the repository
git clone https://github.com/arefinkhansiam/mission-forges.git
cd mission-forges

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run local development server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

```bash
# Verify TypeScript strict type check
npx tsc --noEmit

# Test production build
npm run build

# Preview production build locally
npm run preview
```

---

## Environment Variables

| Variable | Scope | Purpose |
| :--- | :--- | :--- |
| `NASA_API_KEY` | Server-Side Only | NASA Open API key (falls back gracefully to `DEMO_KEY` if empty) |
| `VITE_SUPABASE_URL` | Client & Server | Backend Supabase database URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Client & Server | Supabase anonymous publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-Side Only | Secret key used for database telemetry caching |

---

## AI Usage Disclosure

AI-assisted tools were utilized during the development of Mission Forge for code optimization, debugging, mathematical verification of physics models, and documentation drafting in accordance with NASA Space Apps Challenge AI guidelines.

The entire team reviewed, validated, and tested all code, equations, and visual assets, maintaining complete responsibility and ownership of the final product. Full prompt logs and disclosures are transparently documented in [AI_USE.md](./AI_USE.md).

---

## Attribution & Disclaimer

Mission Forge is an educational game created for the **NASA Space Apps Challenge 2026**. NASA and JPL data/services are utilized in accordance with open government data guidelines. This project is an independent submission and is not an official NASA product, nor is it endorsed by NASA.

---

## License

Source code is released under the [MIT License](LICENSE). NASA 3D models, textures, and public imagery remain under their respective public domain / open government licenses.
