import { useTranslation } from "react-i18next";
import { LAUNCH_EVENTS, LAUNCH_VEHICLES } from "../../lib/launch-vehicles";
import { LaunchVehicleImage } from "./LaunchVehicleSelector";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Html, Lightformer, OrbitControls, Sparkles, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Nasa3DModel } from "./Nasa3DModel";
import { Surface, useReducedMotion } from "./Presentation";
import type { OrbitControls as OrbitControlType } from "three-stdlib";
import { BODIES } from "../../lib/nasa-data";
import { landingStages, MISSIONS, type Design } from "../../lib/mission-sim";
import { designOf, useMissionStore } from "../../stores/mission-store";
import { Flame, Spacecraft, getMissionModel } from "./Spacecraft";
import { rt, useTick } from "./runtime";

function Studio() {
  return (
    <Environment resolution={128}>
      <Lightformer intensity={2.5} position={[0, 6, 2]} scale={[10, 4, 1]} color="#cfe6ff" />
      <Lightformer intensity={1.2} position={[-6, 1, -2]} rotation-y={Math.PI / 2} scale={[12, 2, 1]} color="#5b8fd6" />
      <Lightformer intensity={0.8} position={[6, 0, 2]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} color="#ffd9a8" />
    </Environment>
  );
}

// ---------- Hangar / build ----------
export function BuildScene() {
  const s = useMissionStore();
  const d = designOf(s);
  const reduced = useReducedMotion();
  const controls = useRef<OrbitControlType>(null);
  const ref = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useEffect(() => {
    const reset = () => {
      camera.position.set(4.8, 2.8, 6.8);
      controls.current?.target.set(0.35, -0.25, 0);
      controls.current?.update();
    };
    reset();
    const move = (event: Event) => {
      const action = (event as CustomEvent<string>).detail,
        c = controls.current;
      if (!c) return;
      if (action === "reset") {
        reset();
        return;
      }
      const offset = camera.position.clone().sub(c.target);
      if (action === "left" || action === "right")
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), action === "left" ? -0.25 : 0.25);
      else offset.multiplyScalar(action === "in" ? 0.85 : 1.15).clampLength(4, 12);
      camera.position.copy(c.target).add(offset);
      c.update();
    };
    window.addEventListener("mf-camera", move);
    return () => window.removeEventListener("mf-camera", move);
  }, [camera]);

  return (
    <>
      <color attach="background" args={["#090e16"]} />
      <fog attach="fog" args={["#090e16", 16, 35]} />
      <Studio />
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 3]} intensity={3.2} color="#fff3e3" />
      <directionalLight position={[-5, 1, -3]} intensity={2} color="#9ac9e0" />

      {/* Primary Authentic NASA Spacecraft Model for the selected mission */}
      <group ref={ref} rotation-z={0.12}>
        <Spacecraft design={d} deploy={1} targetSize={3.2} />
      </group>

      <gridHelper args={[28, 28, "#293443", "#151e2a"]} position-y={-2.42} />
      <mesh position-y={-2.4} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[4, 64]} />
        <meshStandardMaterial color="#0a1a33" metalness={0.8} roughness={0.35} />
      </mesh>
      <mesh position-y={-2.39} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[2.6, 2.64, 96]} />
        <meshBasicMaterial color="#5aaeff" />
      </mesh>
      <OrbitControls
        ref={controls}
        makeDefault
        enablePan={false}
        autoRotate={!reduced && s.phase === "craft"}
        autoRotateSpeed={0.35}
        minDistance={4}
        maxDistance={14}
        target={[0.35, -0.25, 0]}
      />
    </>
  );
}

// ---------- Launch (Authentic NASA Saturn V + 3D Earth + ISS) ----------
const LIFTOFF = 10,
  SRB_SEP = 18,
  CORE_SEP = 25,
  ORBIT = 28;

export const launchProfile = (t: number) => {
  const real = Math.max(0, t - LIFTOFF) * 20,
    f = Math.min(1, real / 480);
  return { altKm: 162 * Math.pow(f, 1.6), velKms: 7.8 * Math.pow(f, 1.3), real };
};

function Pad() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    g.fillStyle = "#3f5a32";
    g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 400; i++) {
      g.fillStyle = `rgba(${40 + Math.random() * 30},${70 + Math.random() * 40},40,0.5)`;
      g.fillRect(Math.random() * 256, Math.random() * 256, 6, 6);
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(40, 40);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.01}>
        <planeGeometry args={[800, 800]} />
        <meshStandardMaterial map={tex} roughness={1} />
      </mesh>
      <mesh position-y={0.4}>
        <boxGeometry args={[8, 0.8, 8]} />
        <meshStandardMaterial color="#8a8d90" roughness={0.9} />
      </mesh>
      <group position={[-2.8, 0, 0]}>
        {Array.from({ length: 16 }, (_, i) => (
          <mesh key={i} position-y={1 + i * 0.9}>
            <boxGeometry args={[1.2, 0.06, 1.2]} />
            <meshStandardMaterial color="#6b6f73" />
          </mesh>
        ))}
        {[
          [-0.6, -0.6],
          [0.6, -0.6],
          [-0.6, 0.6],
          [0.6, 0.6],
        ].map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x!, 8, z!]}>
            <boxGeometry args={[0.08, 15, 0.08]} />
            <meshStandardMaterial color="#5d6166" />
          </mesh>
        ))}
      </group>
      <mesh position={[40, 6, -60]}>
        <boxGeometry args={[14, 12, 10]} />
        <meshStandardMaterial color="#d9d9d4" />
      </mesh>
    </group>
  );
}

export function LaunchScene() {
  const { t: translate } = useTranslation();
  useTick(10);
  const reduced = useReducedMotion();
  const s = useMissionStore();
  const d = designOf(s);
  const vehicle = LAUNCH_VEHICLES[s.launchVehicle];
  const stack = useRef<THREE.Group>(null);
  const orion = useRef<THREE.Group>(null);
  const { camera, scene } = useThree();
  const sky = useMemo(() => ({ a: new THREE.Color("#7fb2e6"), b: new THREE.Color("#01040c"), c: new THREE.Color() }), []);
  const said = useRef(new Set<string>());

  useEffect(() => {
    rt.launchT = 0;
    said.current.clear();
    camera.position.set(10, 5, 16);
  }, [camera]);

  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    rt.launchT += dt;
    const t = rt.launchT;
    const st = useMissionStore.getState();
    const once = (k: string, msg: string, tone: "info" | "ok" | "warn" = "info") => {
      if (!said.current.has(k)) {
        said.current.add(k);
        st.say(msg, tone);
      }
    };

    for (const event of LAUNCH_EVENTS) {
      if (t > event.at) once(event.key, translate(`launchVehicle.events.${st.launchVehicle}.${event.key}`), event.key === "ignition" ? "warn" : "ok");
    }

    const inOrbit = t > ORBIT;
    const lt = Math.max(0, t - LIFTOFF);
    const y = 0.35 * lt * lt;
    const alt = Math.min(1, y / 300);

    sky.c.copy(sky.a).lerp(sky.b, alt);
    scene.background = inOrbit ? sky.b : sky.c;
    scene.fog = inOrbit ? null : new THREE.Fog(sky.c, 60, 400 + y);
    rt.thrust = t > LIFTOFF - 6.6 && t < CORE_SEP ? 1 : 0;

    if (stack.current) {
      stack.current.visible = !inOrbit;
      stack.current.position.y = y;
      stack.current.rotation.z = -Math.min(0.4, lt * lt * 0.0012);
    }

    if (orion.current) {
      orion.current.visible = inOrbit;
    }

    const shake = !reduced && rt.thrust ? (t < LIFTOFF + 6 ? 0.09 : 0.035) : 0;
    if (!inOrbit && stack.current) {
      const target = stack.current.position.clone().add(new THREE.Vector3(0, 7, 0));
      const want = t < LIFTOFF ? new THREE.Vector3(10, 5, 17) : target.clone().add(new THREE.Vector3(9 + lt * 0.2, -3, 15));
      camera.position.lerp(want, 1 - Math.exp(-2 * dt));
      camera.position.x += (Math.random() - 0.5) * shake;
      camera.position.y += (Math.random() - 0.5) * shake;
      camera.lookAt(target);
    } else if (orion.current) {
      camera.position.lerp(new THREE.Vector3(4.2, 1.8, 6.2), 1 - Math.exp(-2 * dt));
      camera.lookAt(0, 0, 0);
      rt.launchT = Math.min(rt.launchT, ORBIT + 60);
    }
  });

  const deploy = Math.max(0, Math.min(1, (rt.launchT - ORBIT - 1) / 4));

  return (
    <>
      <color attach="background" args={["#7fb2e6"]} />
      <hemisphereLight args={["#cfe6ff", "#3f5a32", 0.9]} />
      <directionalLight position={[30, 50, 20]} intensity={2.6} color="#fff1d8" />
      <Studio />
      <Stars radius={300} depth={50} count={3500} factor={6} fade />

      {/* Ground Launchpad */}
      <group>{rt.launchT < ORBIT && <Pad />}</group>

      {/* Authentic NASA Saturn V Rocket Ascent Stack */}
      <group ref={stack}>
        <group position-y={8}>
          {vehicle.model ? <Nasa3DModel modelUrl={vehicle.model} targetSize={15} autoRotate={false} /> : rt.launchT < ORBIT && (
            <Html center transform sprite distanceFactor={12}>
              <figure className="mf-launch-photo" data-launch-visual={s.launchVehicle}>
                <LaunchVehicleImage key={s.launchVehicle} vehicle={s.launchVehicle} />
                <figcaption>{translate(`launchVehicle.visual.${s.launchVehicle}`)}</figcaption>
              </figure>
            </Html>
          )}
        </group>

        {/* F-1 Engine Cluster Exhaust Plume */}
        {rt.thrust > 0 && (
          <group position-y={0.5}>
            <Flame power={rt.thrust} y={0} length={9} radius={0.85} />
            <Sparkles count={200} scale={[4, 8, 4]} position-y={-3} size={25} speed={4} color="#ffaa33" />
          </group>
        )}

        {/* Launchpad ignition smoke */}
        {rt.launchT > LIFTOFF - 3 && rt.launchT < LIFTOFF + 8 && (
          <Sparkles count={150} scale={[14, 4, 14]} position-y={0.8} size={28} speed={2} color="#e8e0d6" opacity={0.8} />
        )}
      </group>

      {/* Orbit Insertion: 3D Earth Globe + Authentic Spacecraft + ISS */}
      <group ref={orion} visible={false}>
        {/* Rotating 3D Blue Marble Earth */}
        <group position={[0, -18, -10]} rotation-y={rt.launchT * 0.04}>
          <Surface body="Earth" radius={15} />
        </group>
        {/* Atmospheric Blue Glow */}
        <mesh position={[0, -18, -10]} scale={1.025}>
          <sphereGeometry args={[15, 48, 24]} />
          <meshBasicMaterial color="#7fc0ff" transparent opacity={0.22} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* Authentic NASA Spacecraft Deployed in Orbit */}
        <group rotation-z={0.3} position={[0, 0, 0]}>
          <Spacecraft design={d} deploy={deploy} targetSize={2.8} />
        </group>

        {/* Authentic 3D International Space Station (ISS) in background LEO */}
        <group position={[6, 3, -5]} rotation={[0.3, 0.8, 0.2]}>
          <Nasa3DModel modelUrl="/models/iss.glb" targetSize={3.8} autoRotate={true} rotationSpeed={0.15} />
        </group>
      </group>
    </>
  );
}

// ---------- Rescue rendezvous / docking with International Space Station (ISS) ----------
export function DockingScene() {
  useTick(10);
  const s = useMissionStore();
  const d = designOf(s);
  const rescue = useRef<THREE.Group>(null);
  const target = useRef<THREE.Group>(null);
  const rescueDesign = useMemo<Design>(
    () => ({
      ...d,
      engine: "chemical",
      engines: 1,
      tanks: 2,
      wings: 4,
      rtgs: 0,
      antennas: 2,
      shield: false,
      battery: true,
      instruments: [],
    }),
    [d]
  );
  const { camera } = useThree();
  const said = useRef(new Set<string>());

  useEffect(() => {
    rt.launchT = 0;
    said.current.clear();
    camera.position.set(7, 3, 8);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    rt.launchT = Math.min(24, rt.launchT + dt);
    const t = rt.launchT;
    const st = useMissionStore.getState();
    const once = (k: string, m: string) => {
      if (!said.current.has(k)) {
        said.current.add(k);
        st.say(m, "ok");
      }
    };

    if (t > 0.5) once("a", "Rendezvous radar locked: International Space Station (ISS)");
    if (t > 6) once("b", "Approaching ISS Harmony docking port — matching orbital velocity");
    if (t > 11) once("c", "Soft capture confirmed — hard-docked to ISS");
    if (t > 13) once("d", "Canadarm robotic repair and component diagnostics in progress");
    if (t >= 24) {
      once("e", "Orbital repairs complete — avionics, fuel valves and power restored!");
      if (!st.rescued) st.set({ rescued: true });
    }

    const spin = Math.max(0, 1 - t / 8);
    if (target.current) target.current.rotation.y += dt * 0.1 * spin;
    if (rescue.current) rescue.current.position.y = 2.0 + Math.max(0, 9 - t) * 1.3;
  });

  const repairing = rt.launchT > 13 && rt.launchT < 24;

  return (
    <>
      <color attach="background" args={["#010308"]} />
      <Stars radius={120} depth={50} count={4500} factor={4} fade />
      <Studio />
      <ambientLight intensity={0.25} />
      <directionalLight position={[8, 5, 6]} intensity={2.8} color="#fff4e0" />

      {/* 3D Earth Globe Rotating in LEO Background */}
      <group position={[-5, -15, -20]} rotation-y={rt.launchT * 0.03}>
        <Surface body="Earth" radius={15} />
      </group>
      <mesh position={[-5, -15, -20]} scale={1.02}>
        <sphereGeometry args={[15, 48, 24]} />
        <meshBasicMaterial color="#7fc0ff" transparent opacity={0.2} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Authentic NASA 3D International Space Station (Target Docking Station) */}
      <group ref={target} position={[0, 0, 0]}>
        <Nasa3DModel modelUrl="/models/iss.glb" targetSize={4.6} autoRotate={false} />
      </group>

      {/* Approaching NASA Spacecraft */}
      <group ref={rescue} rotation-z={Math.PI}>
        <Spacecraft design={rescueDesign} deploy={1} variant="rescue" thrust={rt.launchT < 10 ? 0.35 : 0} targetSize={2.2} />
      </group>

      {/* Robotic Arm Repair Sparkles */}
      {repairing && (
        <Sparkles count={80} scale={[1.6, 1.6, 1.6]} position={[0.4, 0.2, 0.4]} size={8} speed={3.5} color="#ffd48a" />
      )}

      <OrbitControls makeDefault enablePan={false} minDistance={3} maxDistance={18} />
    </>
  );
}

// ---------- Landing / probe entry with Authentic NASA Landers ----------
export function LandingScene() {
  useTick(10);
  const s = useMissionStore();
  const d = designOf(s);
  const body = BODIES[MISSIONS[s.mission].body];
  const stages = landingStages(body.id);
  const lander = useRef<THREE.Group>(null);
  const chute = useRef<THREE.Group>(null);

  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const g = c.getContext("2d")!;
    g.fillStyle = body.color;
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 900; i++) {
      g.fillStyle = i % 3 ? body.color2 : "#ffffff";
      g.globalAlpha = 0.05 + Math.random() * 0.15;
      g.beginPath();
      g.arc(Math.random() * 512, Math.random() * 512, 1 + Math.random() * 18, 0, 7);
      g.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(12, 12);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [body]);

  const gas = body.atmosphere === "gas";
  const terrain = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(260, 260, 72, 72);
    const positions = geometry.getAttribute("position");
    if (positions) {
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i),
          y = positions.getY(i);
        const edge = THREE.MathUtils.smoothstep(Math.hypot(x, y), 6, 35);
        positions.setZ(i, edge * (Math.sin(x * 0.055 + 1) * Math.cos(y * 0.072) * 5 + Math.sin(x * 0.14 + y * 0.09) * 1.5));
      }
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  useEffect(() => () => {
    tex.dispose();
    terrain.dispose();
  }, [tex, terrain]);

  const skyCol =
    body.atmosphere === "none" ? "#010206" : gas ? body.color2 : body.id === "Mars" ? "#c79a72" : "#8ab8e6";
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(8, 6, 12);
  }, [camera]);

  useFrame(({ clock }, raw) => {
    const dt = Math.min(raw, 0.05),
      st = useMissionStore.getState();
    const f = st.landing / stages.length;
    const want = gas ? 30 - f * 40 : 40 * (1 - f) + 0.55 * (f >= 1 ? 1 : 0);
    const g = lander.current;
    if (!g) return;
    g.position.y = THREE.MathUtils.damp(g.position.y, Math.max(gas ? -20 : 0.55, want), 1.5, dt);
    g.rotation.z = Math.sin(clock.elapsedTime * 0.7) * 0.03 * (1 - f);
    const name = stages[st.landing - 1] ?? "";
    if (chute.current)
      chute.current.visible = name.startsWith("Parachute") || ((stages[st.landing] ?? "").startsWith("Heat") && st.landing > 2 && gas);
    rt.thrust = /Powered|Braking|Terminal|Deorbit/.test(name) ? 1 : 0;
    camera.position.lerp(new THREE.Vector3(g.position.x + 7, g.position.y + 3, g.position.z + 10), 1 - Math.exp(-1.5 * dt));
    camera.lookAt(g.position);
  });

  return (
    <>
      <color attach="background" args={[skyCol]} />
      <fog attach="fog" args={[skyCol, 20, gas ? 90 : 220]} />
      {body.atmosphere === "none" && <Stars radius={150} depth={40} count={3000} factor={4} fade />}
      <hemisphereLight args={[skyCol, body.color2, 0.8]} />
      <directionalLight position={[20, 30, 10]} intensity={2.4} color="#fff1dc" />
      {gas ? (
        [0, -12, -24].map((y, i) => (
          <mesh key={y} position-y={y} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[400, 400]} />
            <meshStandardMaterial
              map={tex}
              transparent
              opacity={0.55 + i * 0.15}
              color={i % 2 ? body.color : "#f4e4c8"}
            />
          </mesh>
        ))
      ) : (
        <>
          <mesh rotation-x={-Math.PI / 2} geometry={terrain}>
            <meshStandardMaterial map={tex} roughness={1} />
          </mesh>
          {Array.from({ length: 40 }, (_, i) => (
            <mesh
              key={i}
              position={[Math.sin(i * 12.9) * 40, 0.2, Math.cos(i * 7.3) * 40]}
              scale={0.3 + (i % 5) * 0.3}
            >
              <dodecahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color={body.color2} roughness={1} />
            </mesh>
          ))}
        </>
      )}

      {/* Authentic NASA 3D Lander (Viking for Mars, Apollo LM for Moon, Dawn for Ceres, Galileo for Jupiter) */}
      <group ref={lander} position-y={40}>
        <Spacecraft design={d} variant="lander" thrust={rt.thrust} targetSize={2.4} />
        <group ref={chute} position-y={3.2} visible={false}>
          <mesh>
            <sphereGeometry args={[2, 24, 12, 0, Math.PI * 2, 0, 1.2]} />
            <meshStandardMaterial color="#f4f4f4" side={THREE.DoubleSide} />
          </mesh>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <mesh
              key={i}
              position={[Math.cos(i) * 0.9, -1.4, Math.sin(i) * 0.9]}
              rotation-z={Math.cos(i) * 0.4}
            >
              <cylinderGeometry args={[0.01, 0.01, 3]} />
              <meshBasicMaterial color="#ddd" />
            </mesh>
          ))}
        </group>
      </group>

      {s.landing >= stages.length && !gas && (
        <Sparkles count={80} scale={[5, 1, 5]} position-y={0.4} size={10} color={body.color} />
      )}
    </>
  );
}
