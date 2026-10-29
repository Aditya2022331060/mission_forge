# Mission Forge — Project Handover & State Documentation

> **Purpose:** This document provides an exhaustive, production-grade technical summary of the Mission Forge project, all recent architectural and visual changes, completed features, and the agreed roadmap for Videos, Navigation, and UI. Any developer or AI assistant can resume directly from this file.

---

## 1. Project Overview & Architecture

- **Project Name:** Mission Forge (Playable 3D Space Mission Educational Game)
- **Tech Stack:**
  - **Framework:** React 18, Vite, TypeScript
  - **3D Engine:** Three.js, `@react-three/fiber`, `@react-three/drei`
  - **State Management:** Single-screen unified store (`zustand` in `src/store/mission.store.ts`)
  - **Routing:** TanStack Router (`@tanstack/react-router`) with a single-screen canvas architecture where phases overlay on the active 3D canvas
  - **Localization:** `i18next` with 6 languages (en, bn, hi, es, ar, fr) in `src/locales/resources.ts`
  - **Styles:** Tailwind CSS + custom glassmorphic HUD in `src/styles.css`
  - **NASA Assets:** Locally cached in `public/textures/nasa-3d/` and `src/data/` (Blue Marble, LROC Moon, Cassini Saturn) to avoid runtime blocking.

---

## 2. Recent Accomplishments & Changes

### A. 3D Globe & Celestial Bodies (`src/components/game/Presentation.tsx`)
1. **Home Screen Earth Alignment:**
   - Shifted the rotating 3D Earth (`body === "Earth"` on menu) to `x = viewport.width * 0.13, y = 0.08`, with radius `2.10`.
   - Eliminated text collisions with `"Destination"`, `"Commander"`, and `"🎬 Learn · Video Academy"` action buttons.
   - Removed right-edge clipping while keeping Earth prominent and interactive.

2. **Moon 3D Reconstruction ("Choose a World"):**
   - **Issue:** Moon was distorted into an egg/oval shape with a dark projection caused by a flat 1:1 circular photo mapped onto a sphere.
   - **Fix:** Sourced NASA LROC 2K equirectangular map (`2048x1024`) saved to `public/textures/nasa-3d/moon.jpg` and `moon.webp`.
   - **Result:** 100% round, authentic 3D lunar sphere featuring Tycho, Oceanus Procellarum, and Sea of Tranquility without dark artifacts.

3. **Saturn & Rings Authentic Rendering ("Choose a World"):**
   - **Issue 1 (Black Rings):** The ring was using an uncolored alpha mask with dark grey RGB values (~14% albedo) and a standard PBR material. Because the ring is a flat plane tilted at ~26.7°, Three.js directional lighting computed a negative dot product, rendering the rings pitch-black outside the planet.
   - **Fix 1 (Cassini True-Color & Light Scattering):**
     - Sourced NASA Cassini natural-color ring profile (`public/textures/nasa-3d/saturn-rings.png`) with true albedo: creamy ivory B Ring (`#f8eed8`), sharp dark Cassini Division, warm beige A Ring (`#dfd2b8`), and translucent amber crepe C Ring.
     - Added custom polar UV mapping (`u = (r - inner) / (outer - inner)`) in `SaturnRings`.
     - Added `emissiveMap`, `emissive="#f7eed9"`, `emissiveIntensity=0.88`, and `depthWrite=false` to emulate forward/backward scattering of billions of water-ice crystals. Saturn's cloud bands show through the rings naturally.
   - **Issue 2 (Size & Screen Fitting):**
     - Scaled Saturn's globe (`radius: 0.98`) and rings (`inner: 1.16`, `outer: 2.22`).
     - **Overall Bounding Size:** Saturn along with its rings now occupies ~4.4 units in diameter, matching the exact visual footprint of **Moon** (`radius: 2.18`) and **Mars** (`radius: 2.18`).
     - Rings are kept completely static while Saturn's globe spins on its polar axis.
     - Positioned at `x = viewport.width * 0.16`, completely within the screen boundaries with zero right-side clipping.

---

### B. Video Academy & Cosmic Address
1. **Video V03 ("Our Address in the Universe"):**
   - Explains Earth's hierarchical cosmic address:
     $$\text{Earth} \to \text{Solar System} \to \text{Orion Arm (Spur)} \to \text{Milky Way Galaxy} \to \text{Local Group} \to \text{Virgo Supercluster} \to \text{Laniakea}$$
   - Includes interactive 3-question quiz with instant explanation feedback and badge award (`Cadet Cosmic Navigator`).
2. **Video Architecture:**
   - 3 Cadet Videos currently configured:
     - `v01`: Introduction to Mission Forge & Space Exploration
     - `v02`: Spacecraft Systems (Power, Propulsion, Thermal, Communications)
     - `v03`: Our Cosmic Address in the Universe
   - Accessible via:
     - Home page `🎬 Learn · Video Academy` button.
     - First-time Cadet Induction modal (`FirstTimeCadetIntro.tsx`).
     - Global navigation bar `Videos` tab.
     - In-city learning terminals in Central City Plaza (`CityLearningActivity.tsx`).

---

## 3. Active User Intent & Agreed Roadmap

The user outlined specific navigation and experience refinements to be completed step-by-step:

### 1. Navigation Flow & "Back to Home" Button
- [x] Home page serves as the initial landing stage when entering the app.
- [ ] **Universal "Back to Home" Button:** Ensure every screen, modal, and sub-phase (`missions`, `vehicle`, `brief`, `route`, `hangar`, `flight`, `report`, `city`) provides an unambiguous, visible `Back to Home` button so cadets never feel stuck.
- [ ] **Flight Plan Menu Tab:** When clicking the "Flight Plan" / "Explore Forge City" navigation, cleanly transition the user to Central City Plaza as the primary hub.

### 2. Video Academy & Learn Tab Consolidation
- [x] First video (V01) integration on Home screen and Cadet induction flow.
- [ ] **Learn Tab Video Suite:** Inside the "Learn" tab / Central City Plaza Academy, all 3 videos (V01, V02, V03) must be listed with:
  - Video player modal with clear captions.
  - Interactive quiz system attached to each video.
  - Badge tracking (persisted in `useMissionStore`).
  - Option to re-watch videos and re-take quizzes at any time without resetting game progress.

### 3. Choose a World Section
- [x] Moon 100% round with authentic NASA LROC equirectangular map.
- [x] Saturn rings true-color Cassini ivory/gold with translucent crepe ring and Cassini division.
- [x] Saturn + rings total size matched to Moon and Mars.
- [x] Rings kept static and fully inside the screen boundaries.
- [ ] Check Jupiter, Mars, and Ceres textures/lighting for consistency.

---

## 4. Key Files & Structure

| File Path | Description |
| :--- | :--- |
| `src/components/game/Presentation.tsx` | Main Three.js Canvas: 3D Earth, Moon, Mars, Ceres, Jupiter, Saturn with rings, lighting, camera controls. |
| `src/components/game/GameScreens.tsx` | UI Phase Overlays: Home, Destination selection (`missions`), Launch Vehicle, Route, etc. |
| `src/components/game/ReferenceHud.tsx` | Alternate reference HUD layout, navigation headers, and modal settings. |
| `src/components/game/city/CityOverlay.tsx` | Forge City Central Plaza 3D walkthrough & interactive district stations. |
| `src/components/game/city/CityLearningActivity.tsx`| In-city learning terminals, quizzes, and multimedia activities. |
| `src/components/game/video/FirstTimeCadetIntro.tsx`| Cadet induction video modal and academy launcher. |
| `src/store/mission.store.ts` | Central Zustand store: active phase (`menu`, `missions`, `vehicle`, etc.), active mission, active video, badges. |
| `src/locales/resources.ts` | Complete i18n text dictionaries (EN, BN, HI, ES, AR, FR). |
| `public/textures/nasa-3d/` | Local NASA textures: `earth-blue-marble.jpg`, `moon.jpg`, `saturn.jpg`, `saturn-rings.png`, etc. |

---

## 5. Development Instructions

### How to Run Locally
```bash
# Start Vite dev server
npm run dev
# The game runs on http://localhost:8080/
```

### TypeScript Validation
```bash
npx tsc --noEmit
```
*(Always ensure 0 errors before handing off).*

---

## 6. Handover Note for Incoming AI Assistant

> **Instructions for the AI Assistant:**
> 1. Do **NOT** rewrite published git history (connected to Lovable; see `AGENTS.md`).
> 2. Continue from **Section 3: Active User Intent & Agreed Roadmap**.
> 3. Priority #1 is the navigation flow (ensuring "Back to Home" is omnipresent and the Learn tab displays all 3 videos with their respective quizzes and badge systems).
> 4. Keep all state in `useMissionStore` and read UI strings via `t()` in `resources.ts`.
