// Run with: node --test tests/launch-vehicles.test.mjs
// Vite loads the existing TypeScript model; no extra test dependency is needed.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const cacheDir = await mkdtemp(join(tmpdir(), "mission-forge-launch-tests-"));
const server = await createServer({
  configFile: false,
  cacheDir,
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true },
  appType: "custom",
});
after(async () => {
  await server.close();
  await rm(cacheDir, { recursive: true, force: true });
});
const { analyze, MISSIONS, ROUTES } = await server.ssrLoadModule("/src/lib/mission-sim.ts");
const { LAUNCH_VEHICLES, LAUNCH_EVENTS, normalizeLaunchVehicle } = await server.ssrLoadModule(
  "/src/lib/launch-vehicles.ts",
);
const design = {
  launchVehicle: "saturn-v",
  mission: "Mars",
  route: "safe",
  engine: "ion",
  engines: 1,
  tanks: 2,
  wings: 6,
  rtgs: 0,
  antennas: 2,
  shield: false,
  battery: true,
  instruments: ["camera"],
  fuel: 100,
};

test("switching launcher changes mass feasibility without changing spacecraft performance", () => {
  const saturn = analyze(design),
    sls = analyze({ ...design, launchVehicle: "sls-block-1" });
  assert.equal(saturn.canLaunch, true);
  assert.equal(sls.canLaunch, false);
  assert.ok(sls.issues.some((i) => i.tone === "danger" && i.text.includes("SLS Block 1")));
  for (const key of [
    "wet",
    "dry",
    "dv",
    "required",
    "days",
    "generation",
    "draw",
    "hazard",
    "science",
  ])
    assert.equal(saturn[key], sls[key]);
});

test("destination and route changes recalculate the simulated envelope for both vehicles", () => {
  for (const launchVehicle of Object.keys(LAUNCH_VEHICLES)) {
    for (const mission of Object.keys(MISSIONS)) {
      const safe = analyze({ ...design, launchVehicle, mission, route: "safe" });
      const fast = analyze({ ...design, launchVehicle, mission, route: "fast" });
      assert.ok(fast.launch.limitKg < safe.launch.limitKg);
      assert.ok(safe.launch.limitKg <= LAUNCH_VEHICLES[launchVehicle].lunarReferenceKg);
      assert.equal(safe.launch.status, "SIMULATED");
      assert.ok(Number.isFinite(safe.launch.limitKg) && safe.launch.limitKg > 0);
      for (const route of Object.keys(ROUTES))
        assert.equal(
          analyze({ ...design, launchVehicle, mission, route }).required,
          MISSIONS[mission].dv * ROUTES[route].dv,
        );
    }
    assert.ok(
      analyze({ ...design, launchVehicle, mission: "Mars" }).launch.limitKg <
        analyze({ ...design, launchVehicle, mission: "Moon" }).launch.limitKg,
    );
  }
});

test("the mass boundary is consistent and is never the old LEO threshold", () => {
  const base = { ...design, tanks: 4 };
  const a = analyze(base);
  const at = { ...base, fuel: ((a.launch.limitKg - a.dry) / 36000) * 100 };
  const under = analyze({ ...at, fuel: at.fuel - 0.01 });
  const over = analyze({ ...at, fuel: at.fuel + 0.01 });
  assert.ok(!under.issues.some((i) => i.text.includes("envelope exceeded")));
  assert.ok(over.issues.some((i) => i.text.includes("envelope exceeded")));
  assert.ok(a.launch.limitKg < 95000);
});

test("legacy and invalid IDs default to Saturn V, and vehicle references share one event timeline", () => {
  for (const value of [undefined, null, "legacy", "__proto__"])
    assert.equal(normalizeLaunchVehicle(value), "saturn-v");
  assert.equal(normalizeLaunchVehicle("sls-block-1"), "sls-block-1");
  assert.equal(LAUNCH_VEHICLES["sls-block-1"].model, null);
  assert.equal(LAUNCH_VEHICLES["saturn-v"].model, "/models/saturn-v.glb");
  assert.ok(
    LAUNCH_EVENTS.find((e) => e.key === "separation").at <
      LAUNCH_EVENTS.find((e) => e.key === "orbit").at,
  );
});
