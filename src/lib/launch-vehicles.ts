/** Shared launcher identity and lunar reference benchmarks. See docs/launch-vehicles.md.
 * No LEO payload rating is used as a lunar/interplanetary payload rating.
 */
export type LaunchVehicleId = "saturn-v" | "sls-block-1";
export const DEFAULT_LAUNCH_VEHICLE: LaunchVehicleId = "saturn-v";

export const LAUNCH_VEHICLES = {
  "saturn-v": {
    name: "Saturn V",
    image: "/assets/launch-vehicles/SATURN_V_IMAGE.webp",
    model: "/models/saturn-v.glb",
    // Rounded educational benchmark: about 50 US short tons toward the Moon.
    lunarReferenceKg: 45_000,
    source:
      "https://www.nasa.gov/learning-resources/for-kids-and-students/what-was-the-saturn-v-5-8/",
  },
  "sls-block-1": {
    name: "SLS Block 1",
    image: "/assets/launch-vehicles/SLS_IMAGE.jpg",
    model: null,
    // NASA Block 1 benchmark: more than 27 metric tonnes toward the Moon.
    lunarReferenceKg: 27_000,
    source: "https://www.nasa.gov/reference/space-launch-system/",
  },
} as const;

export function normalizeLaunchVehicle(value: unknown): LaunchVehicleId {
  return value === "sls-block-1" || value === "saturn-v" ? value : DEFAULT_LAUNCH_VEHICLE;
}

/** SIMULATED teaching envelope, not a C3/launch-window payload solution.
 * Scale a documented lunar reference by the game's relative route delta-v demand.
 * Spacecraft still supplies its FULL existing LEO-to-target budget; launcher upper
 * stage delta-v is intentionally not credited. This conservative abstraction keeps
 * the existing spacecraft model and must never be sold as actual mission capability.
 */
export function launchCapability(id: LaunchVehicleId, requiredDv: number, lunarBaseDv: number) {
  const vehicle = LAUNCH_VEHICLES[normalizeLaunchVehicle(id)];
  const factor = Math.min(1, lunarBaseDv / requiredDv);
  return {
    vehicle,
    limitKg: Math.floor(vehicle.lunarReferenceKg * factor),
    factor,
    status: "SIMULATED" as const,
  };
}

/** Same compressed event timeline drives the HUD and narration for either launcher. */
export const LAUNCH_EVENTS = [
  { at: 2, key: "fuel" },
  { at: 3.4, key: "ignition" },
  { at: 10, key: "liftoff" },
  { at: 18, key: "separation" },
  { at: 25, key: "upper" },
  { at: 28, key: "orbit" },
  { at: 29, key: "deploy" },
] as const;
