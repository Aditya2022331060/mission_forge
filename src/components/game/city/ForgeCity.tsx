import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMissionStore } from "../../../stores/mission-store";
import { CITY_MATERIALS, createFaçadeBays } from "./city-materials";
import { RoadNetwork } from "./RoadNetwork";
import {
  SpaceCenterLobbyInterior,
  ClassroomInterior,
  LaboratoryInterior,
  RocketHangarInterior,
} from "./EnterableInteriors";
import { FORGE_CITY_DISTRICTS } from "./city-data";
export type { ZoneLocation } from "./city-data";
export { FORGE_CITY_DISTRICTS };

export function ForgeCity() {
  const { camera } = useThree();
  const playerPos = useRef(new THREE.Vector3(0, 0, 8));
  const playerVelocity = useRef(new THREE.Vector3(0, 0, 0));
  const keys = useRef<{ [k: string]: boolean }>({});
  const activeZone = useMissionStore((s) => s.activeCityZone);
  const setStore = useMissionStore((s) => s.set);
  const go = useMissionStore((s) => s.go);
  const say = useMissionStore((s) => s.say);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
      if (e.key === "e" || e.key === "E") {
        const curZone = FORGE_CITY_DISTRICTS.find((z) => {
          const d = playerPos.current.distanceTo(new THREE.Vector3(...z.pos));
          return d <= z.radius;
        });
        if (curZone) {
          if (curZone.targetPhase) {
            say(`Entering ${curZone.name}`, "ok");
            go(curZone.targetPhase);
          } else {
            say(`${curZone.name}: Advanced Research Campus Facility`, "info");
          }
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [go, say]);

  useFrame((_, delta) => {
    const speed = keys.current["shift"] ? 15 : 8.5;
    const moveDir = new THREE.Vector3();

    if (keys.current["w"] || keys.current["arrowup"]) moveDir.z -= 1;
    if (keys.current["s"] || keys.current["arrowdown"]) moveDir.z += 1;
    if (keys.current["a"] || keys.current["arrowleft"]) moveDir.x -= 1;
    if (keys.current["d"] || keys.current["arrowright"]) moveDir.x += 1;

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize();
      playerVelocity.current.lerp(moveDir.multiplyScalar(speed), 0.18);
    } else {
      playerVelocity.current.lerp(new THREE.Vector3(0, 0, 0), 0.22);
    }

    playerPos.current.addScaledVector(playerVelocity.current, delta);

    // Bounded city perimeters
    playerPos.current.x = Math.max(-50, Math.min(50, playerPos.current.x));
    playerPos.current.z = Math.max(-60, Math.min(32, playerPos.current.z));

    // Smooth camera follow with pleasant third-person angle
    const targetCamPos = new THREE.Vector3(
      playerPos.current.x,
      playerPos.current.y + 6.8,
      playerPos.current.z + 12.0
    );
    camera.position.lerp(targetCamPos, 0.12);
    camera.lookAt(playerPos.current.x, playerPos.current.y + 1.4, playerPos.current.z - 2.5);

    // Active zone detection
    let detectedZone: string | null = null;
    for (const z of FORGE_CITY_DISTRICTS) {
      const d = playerPos.current.distanceTo(new THREE.Vector3(...z.pos));
      if (d <= z.radius) {
        detectedZone = z.id;
        break;
      }
    }
    if (detectedZone !== activeZone) {
      setStore({ activeCityZone: detectedZone });
    }
  });

  return (
    <group>
      {/* 1. Cinematic Daytime Lighting & Sky Environment */}
      <color attach="background" args={["#0F172A"]} />
      <ambientLight intensity={0.55} color="#E0F2FE" />
      <directionalLight
        position={[35, 55, 30]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        color="#FFFFFF"
      />
      <directionalLight position={[-25, 30, -20]} intensity={0.4} color="#38BDF8" />

      {/* 2. City Pavement & Connected Road Networks */}
      <RoadNetwork />

      {/* 3. Central Plaza Monument & Wayfinding Signage */}
      <group position={[0, 0, 0]}>
        {/* Hologram Celestial Beacon */}
        <mesh position={[0, 3.2, 0]} material={CITY_MATERIALS.solarAtriumGlass}>
          <sphereGeometry args={[1.5, 32, 32]} />
        </mesh>
        <mesh position={[0, 1.2, 0]} material={CITY_MATERIALS.silverTitanium}>
          <cylinderGeometry args={[2.8, 3.4, 2.4, 32]} />
        </mesh>
      </group>

      {/* 4. DISTRICT 1: MISSION FORGE SPACE CENTER (Hero Landmark) */}
      <group position={[0, 0, -22]}>
        {/* Architectural Exterior Massing */}
        <mesh position={[0, 11, 0]} castShadow material={CITY_MATERIALS.whiteComposite}>
          <boxGeometry args={[22, 22, 16]} />
        </mesh>
        {/* Double-Height Glass Atrium Entrance */}
        <mesh position={[0, 5.5, 8.1]} material={CITY_MATERIALS.cyanCurtainGlass}>
          <boxGeometry args={[12, 11, 0.4]} />
        </mesh>

        {/* Enterable Space Center Lobby */}
        <SpaceCenterLobbyInterior position={[0, 0, 0]} />
      </group>

      {/* 5. DISTRICT 2: SPACE SCIENCE ACADEMY (Enterable Classroom) */}
      <group position={[-24, 0, -10]}>
        {/* Building Shell */}
        <mesh position={[0, 6, 0]} castShadow material={CITY_MATERIALS.whiteComposite}>
          <boxGeometry args={[16, 12, 16]} />
        </mesh>
        <mesh position={[0, 3.5, 8.1]} material={CITY_MATERIALS.cyanCurtainGlass}>
          <boxGeometry args={[6, 7, 0.4]} />
        </mesh>

        {/* Enterable Classroom Interior */}
        <ClassroomInterior position={[0, 0, 0]} />
      </group>

      {/* 6. DISTRICT 3: ASTRONAUT TRAINING FACILITY */}
      <group position={[24, 0, -10]}>
        {/* Rotunda Massing */}
        <mesh position={[0, 6, 0]} castShadow material={CITY_MATERIALS.silverTitanium}>
          <cylinderGeometry args={[8, 8.8, 12, 32]} />
        </mesh>
        <mesh position={[0, 3.5, 8.1]} material={CITY_MATERIALS.solarAtriumGlass}>
          <boxGeometry args={[5, 7, 0.4]} />
        </mesh>
      </group>

      {/* 7. DISTRICT 4: AEROSPACE RESEARCH CAMPUS & LABS */}
      <group position={[26, 0, 14]}>
        <mesh position={[0, 5, 0]} castShadow material={CITY_MATERIALS.whiteComposite}>
          <boxGeometry args={[18, 10, 16]} />
        </mesh>
        <LaboratoryInterior position={[0, 0, 0]} />
      </group>

      {/* 8. DISTRICT 5: ROCKET ASSEMBLY HANGAR (VIF) */}
      <group position={[-24, 0, 14]}>
        <mesh position={[0, 7.5, 0]} castShadow material={CITY_MATERIALS.darkAerospace}>
          <boxGeometry args={[26, 15, 24]} />
        </mesh>
        <RocketHangarInterior position={[0, 0, 0]} />
      </group>

      {/* 9. DISTRICT 6: ORBITAL LAUNCH COMPLEX 39X */}
      <group position={[0, 0, -48]}>
        {/* Launch Pad Pedestal */}
        <mesh position={[0, 2, 0]} castShadow receiveShadow material={CITY_MATERIALS.plazaConcrete}>
          <cylinderGeometry args={[12, 14, 4, 32]} />
        </mesh>
        {/* Red Launch Umbilical Tower */}
        <mesh position={[-6.5, 18, 0]} castShadow material={CITY_MATERIALS.hazardRed}>
          <boxGeometry args={[3, 36, 3]} />
        </mesh>
        {/* Heavy-Lift Vehicle Staged on Pad */}
        <mesh position={[0, 15, 0]} castShadow material={CITY_MATERIALS.whiteComposite}>
          <cylinderGeometry args={[1.5, 1.8, 24, 32]} />
        </mesh>
        <mesh position={[0, 29, 0]} material={CITY_MATERIALS.whiteComposite}>
          <coneGeometry args={[1.5, 4.5, 32]} />
        </mesh>
      </group>

      {/* 10. District Trigger Rings on Ground */}
      {FORGE_CITY_DISTRICTS.map((z) => (
        <group key={z.id} position={z.pos}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
            <ringGeometry args={[z.radius - 0.4, z.radius, 48]} />
            <meshBasicMaterial color={z.color} side={THREE.DoubleSide} transparent opacity={0.65} />
          </mesh>
        </group>
      ))}

      {/* 11. Third-Person Player Character Avatar */}
      <PlayerAvatar playerPos={playerPos} />
    </group>
  );
}

function PlayerAvatar({ playerPos }: { playerPos: React.MutableRefObject<THREE.Vector3> }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(playerPos.current);
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 8]}>
      {/* Sci-Fi Flight Suit Body */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <capsuleGeometry args={[0.35, 0.7, 8, 16]} />
        <meshStandardMaterial color="#0284C7" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Aerospace Helmet & Gold Visor */}
      <mesh position={[0, 1.95, 0]} castShadow>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.95, 0.2]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#F59E0B"
          roughness={0.1}
          metalness={0.9}
          emissive="#F59E0B"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Life Support Thruster Pack */}
      <mesh position={[0, 1.35, -0.3]} castShadow>
        <boxGeometry args={[0.4, 0.55, 0.2]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.7} />
      </mesh>
      {/* Player Ground Shadow Disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[0.55, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
