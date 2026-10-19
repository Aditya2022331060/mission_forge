# Launch vehicle selection and model limits

Saturn V and SLS Block 1 share one registry (`src/lib/launch-vehicles.ts`). Selection is part of `Design` and the existing persisted mission store. Existing saves default to Saturn V to match the previously rendered launcher; invalid or missing saved IDs normalize to that default. Craft presets do not overwrite the launcher.

## Reference data and units

- Saturn V: **approximately 45,000 kg toward the Moon**, a rounded educational benchmark corresponding to about 50 US short tons (about 45,359 kg). NASA's educational vehicle history: https://www.nasa.gov/learning-resources/for-kids-and-students/what-was-the-saturn-v-5-8/ . This is not a configuration-independent maximum; Apollo mission mass and published vehicle ratings vary.
- SLS **Block 1**, not Block 1B or Block 2: **27,000 kg toward the Moon**, the rounded lower benchmark for NASA's description of more than 27 metric tonnes. NASA SLS reference: https://www.nasa.gov/reference/space-launch-system/ . This is a lunar-injection reference, not a payload-to-lunar-surface rating.

These are historical/design reference benchmarks, not live measurements. Source URLs are exposed in the selector. The environment's egress policy returned HTTP 403 when attempting to re-fetch NASA pages during this implementation, so current source wording was not independently rechecked here. The rounding and conservative use are intentional; review the linked references before making claims about actual launch performance.

No low-Earth-orbit payload rating is applied as lunar or interplanetary payload capacity. The old fixed 95,000 kg SLS-to-LEO threshold has been removed from all consumers, including the City Training activity and legacy HUD components.

## SIMULATED destination-and-route envelope

The repository has no verified C3-versus-payload curves, launch-window solver, staging simulation, adapter/fairing constraints or vehicle-specific lunar/interplanetary performance maps. It therefore cannot certify delivery to any selected destination.

The shared teaching rule is:

```
relative demand = min(1, Moon base mission delta-v / selected mission-and-route delta-v)
modeled wet-mass envelope (kg) = floor(lunar reference payload (kg) × relative demand)
```

The base mission delta-v and route multipliers come from the existing game. This ratio is a **game rule**, not the rocket equation, an empirical launch-performance curve, or a physical trajectory solution. Even Moon/fast-route results are labeled SIMULATED because the mission budgets include arrival maneuvers and do not isolate launcher injection energy. The model deliberately makes harder modeled routes require a lighter spacecraft without inventing supposedly verified destination payload ratings.

The spacecraft still supplies its **entire existing LEO-to-target delta-v budget**. No launcher upper-stage delta-v or delivered velocity is credited. This is a conservative gameplay abstraction, not a coupled launcher/spacecraft trajectory design; it does not claim that real vehicles both inject the payload and require it to repeat that injection. All feasibility, readiness, report and City Training mass checks consume the same calculated envelope. A mass GO only means the teaching envelope is satisfied; propulsion, power and other checks still apply. Existing risk acknowledgment behavior is retained.

## Visuals and narration

Both supplied image paths were checked against the repository:

- `/assets/launch-vehicles/SATURN_V_IMAGE.webp`
- `/assets/launch-vehicles/SLS_IMAGE.jpg`

Saturn V uses the existing `/models/saturn-v.glb` ascent model. There is **no SLS 3D launch model** in this checkout. SLS uses its own labeled 2D reference image animated with the existing ascent group; it never renders the Saturn V launcher mesh. Countdown, flames, smoke, camera motion and the parking-orbit spacecraft scene remain shared cinematic effects.

A shared event timeline drives both narration and the HUD: Saturn V uses F-1/S-IC/S-II/S-IVB terminology; SLS uses RS-25/solid boosters/core/ICPS. Time, altitude and speed are compressed illustrative values, not vehicle-specific telemetry. The spacecraft shown after deployment is the selected mission spacecraft, not a launcher model.

The existing payload spacecraft selection, engine, tank, power and route controls remain separate from launch vehicle selection. The selected launcher and its simulated capability are recorded in the debrief.

## Regression checks

Run `node --test tests/launch-vehicles.test.mjs` for the model matrix: vehicle switching, all supported destinations/routes, mass boundaries, unchanged spacecraft performance, and legacy ID defaults. It uses the existing Vite dependency and an isolated temporary cache; it adds no dependency or lockfile changes.

Run `node_modules/.bin/tsc --noEmit` and `npm run build` for type and production validation. Browser validation should also select each vehicle in the planning screen and hangar, reload to check persistence, compare destination/route limits, and follow both selections through preflight, ignition, orbit, flight, arrival and debrief. For SLS, verify that the Saturn V mesh is never requested and the photo is labeled as a 2D reference. Check both supplied-image failure states as well.
