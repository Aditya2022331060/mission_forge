# MISSION FORGE — VERIFIED DATA SOURCES
**Project:** Mission Forge | **Team:** Team Ghost Hunter  
**NASA Space Apps Challenge 2026**

This document establishes the verified source hierarchy for all scientific data, ephemerides, space weather, orbital mechanics, and assets used in Mission Forge.

---

## 1. Classification Standards
Every dataset or endpoint within Mission Forge is labeled with one of the following statuses:
- **`LIVE`**: The client or server executes an active HTTP request to an official API and updates real-time state.
- **`CACHED`**: Data fetched from an official API, stored temporarily for performance, offline resilience, or rate-limit compliance.
- **`VERIFIED_STATIC`**: Authoritative scientific tables (e.g. NASA NSSDCA, JPL Horizons constants) embedded directly in the application code.
- **`DERIVED`**: Computed values calculated from verified physical formulas (e.g. Tsiolkovsky Rocket Equation, Keplerian elements).
- **`GAME_ESTIMATE`**: Simplified educational approximations designed for gameplay clarity (e.g. abstracted budget credits, generalized hazard likelihood).
- **`PROCEDURAL`**: Synthesized meshes, textures, or particle effects.
- **`UNAVAILABLE`**: Endpoints or sources that failed to respond or are under maintenance.

---

## 2. Verified Data Source Catalog

| # | Data Source | Organization | Official URL | Dataset / API | Mission Forge Implementation | Evidence / Code File | Status |
|---|---|---|---|---|---|---|---|
| 1 | **JPL Horizons On-Line Ephemeris System** | NASA / JPL | `https://ssd.jpl.nasa.gov/horizons/` | Horizons REST API | Ephemerides, planetary coordinates, light-time, solar distances | `src/lib/nasa.functions.ts` (`fetchHorizonsEphemeris`) | `LIVE` / `CACHED` |
| 2 | **DONKI (Space Weather Database Of Notifications, Knowledge, Information)** | NASA GSFC / CCMC | `https://ccmc.gsfc.nasa.gov/tools/DONKI/` | Coronal Mass Ejection & Solar Flare API | Solar flare alert feed, space weather radiation hazard calculations | `src/lib/nasa.functions.ts` (`fetchDonkiSpaceWeather`) | `LIVE` / `CACHED` |
| 3 | **NeoWs (Near Earth Object Web Service)** | NASA / JPL | `https://api.nasa.gov/neo/` | Asteroid Close Approach & Hazard Feed | Asteroid encounter hazard mechanics, orbital distance risk models | `src/lib/nasa.functions.ts` (`fetchNeoWsAsteroids`) | `LIVE` / `CACHED` |
| 4 | **NSSDCA Planetary Fact Sheets** | NASA Goddard Space Flight Center | `https://nssdc.gsfc.nasa.gov/planetary/factsheet/` | Planetary Physical & Orbital Tables | Body masses, radii, surface gravity ($g$), orbital periods, atmosphere classification | `src/lib/nasa-data.ts` (`BODIES`) | `VERIFIED_STATIC` |
| 5 | **NASA 3D Resources** | NASA | `https://github.com/nasa/NASA-3D-Resources` & `https://science.nasa.gov/3d-resources/` | Public Domain 3D Spacecraft Models | Interactive 3D models: Saturn V, Apollo LM, ISS, MRO, Viking, Ingenuity, Cassini, Voyager, Dawn, Galileo, Bennu, Parker | `src/lib/nasa-3d-registry.ts`, `public/models/*.glb` | `VERIFIED_STATIC` |
| 6 | **Tsiolkovsky Rocket Equation & Propulsion Specs** | NASA SP-8110 / Rocketdyne / Aerojet Rocketdyne | `https://ntrs.nasa.gov/` | Liquid & Ion Propulsion Specific Impulse Data | RL10 chemical engine ($I_{sp}=450\text{s}$), NSTAR Ion engine ($I_{sp}=3100\text{s}$), $\Delta v$ simulation engine | `src/lib/mission-sim.ts` (`analyze`, `ENGINES`) | `DERIVED` |
| 7 | **NASA APOD (Astronomy Picture of the Day)** | NASA / MTU | `https://api.nasa.gov/planetary/apod` | APOD API | Classroom educational media feed and astronomical visual library | `src/lib/nasa.functions.ts` (`fetchApod`) | `LIVE` / `CACHED` |
| 8 | **NASA Solar System Exploration** | NASA SMD | `https://science.nasa.gov/solar-system/` | Planetary Science Mission Summaries | Mission history, target body characteristics, milestone data | `src/lib/mission-registry.ts` (`REAL_MISSION_PRESETS`) | `VERIFIED_STATIC` |

---

## 3. Disclaimers & Honesty Policy
- **Fictional Game Elements:** Forge City, the Anti-Gravity Transit System, and in-game funding credits (MF Credits) are clearly categorized as speculative science-fiction and educational game mechanics.
- **No Hallucinated Accreditations:** Mission Forge is an independent submission by Team Ghost Hunter for NASA Space Apps Challenge 2026 and does not claim official NASA flight endorsement.
