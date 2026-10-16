# MISSION FORGE — ASSET MANIFEST & LICENSES
**Team Ghost Hunter | NASA Space Apps Challenge 2026**

This document details all 3D assets, textures, and media used in Mission Forge, including origin, license, and modifications.

---

## 1. NASA 3D Models (`public/models/*.glb`)
All NASA 3D models were downloaded from official NASA repositories (**NASA 3D Resources** / **NASA Science 3D Resources**).  
NASA-created media is generally in the public domain and not protected by copyright within the United States.

| Asset File | Target Object | Original Source | License | Optimization / Pipeline |
|---|---|---|---|---|
| `saturn-v.glb` | Saturn V Apollo Moon Rocket | NASA 3D Resources | NASA Public Domain | Draco compressed, transformed upright |
| `apollo-lunar-module.glb` | Apollo Lunar Module Eagle | NASA 3D Resources | NASA Public Domain | Draco compressed, normalized scale |
| `iss.glb` | International Space Station | NASA 3D Resources | NASA Public Domain | Draco compressed, scale balanced |
| `mro.glb` | Mars Reconnaissance Orbiter | NASA 3D Resources | NASA Public Domain | Draco compressed |
| `viking-lander.glb` | Viking Mars Lander | NASA 3D Resources | NASA Public Domain | Draco compressed |
| `ingenuity.glb` | Mars Helicopter Ingenuity | NASA / JPL-Caltech | NASA Public Domain | Draco compressed |
| `dawn.glb` | Dawn Asteroid Explorer | NASA / JPL-Caltech | NASA Public Domain | Draco compressed |
| `galileo.glb` | Galileo Jupiter Orbiter | NASA / JPL-Caltech | NASA Public Domain | Draco compressed |
| `cassini-huygens.glb` | Cassini-Huygens Saturn Orbiter | NASA / JPL-Caltech / ESA | NASA Public Domain | Draco compressed |
| `voyager-probe.glb` | Voyager 1 & 2 Probes | NASA / JPL-Caltech | NASA Public Domain | Draco compressed |
| `hubble.glb` | Hubble Space Telescope | NASA / STScI | NASA Public Domain | Draco compressed |
| `parker-solar-probe.glb` | Parker Solar Probe | NASA / JHU-APL | NASA Public Domain | Draco compressed |
| `deep-space-1.glb` | Deep Space 1 (Ion Drive) | NASA / JPL-Caltech | NASA Public Domain | Draco compressed |
| `asteroid-bennu.glb` | Near-Earth Asteroid Bennu | NASA / OSIRIS-REx Team | NASA Public Domain | Draco compressed |

---

## 2. Environments & Procedural Elements
- **Forge City Hub:** Built using procedural Three.js geometries, PBR standard materials, sci-fi modular architecture, and ambient emissive shaders to ensure 60 FPS performance on standard laptop GPUs.
- **Planetary Meshes & Shaders:** Three.js high-subdivision spheres with PBR textures and procedural atmospheric halos (Moon, Mars, Earth, Ceres, Jupiter, Saturn).

---

## 3. Audio & SFX
- **Launch Ignition & Engine Rumble:** Synthesized Web Audio API white-noise + low-pass resonant filter & NASA Audio Archive public domain sounds.
- **User Audio Controls:** Mute toggle and volume sliders available in the HUD and Options menu; no autoplay audio on initial page load.
