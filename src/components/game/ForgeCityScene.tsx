import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMissionStore } from "../../stores/mission-store";
import { Text } from "@react-three/drei";

export interface ZoneTrigger {
  id: string;
  name: string;
  sub: string;
  pos: [number, number, number];
  radius: number;
  color: string;
  targetPhase?: string;
  icon: string;
}

export const CITY_ZONES: ZoneTrigger[] = [
  {
    id: "space-center",
    name: "Mission Forge Space Center",
    sub: "Mission Control & Launch Planning Desk",
    pos: [0, 0, -18],
    radius: 5.5,
    color: "#00E5FF",
    targetPhase: "missions",
    icon: "🚀",
  },
  {
    id: "classroom",
    name: "Space Science Academy",
    sub: "Attend Orbital Physics & Mission Lectures",
    pos: [-24, 0, -8],
    radius: 4.8,
    color: "#69F0AE",
    targetPhase: "classroom",
    icon: "📚",
  },
  {
    id: "training",
    name: "Astronaut Training Facility",
    sub: "Reaction Wheels, G-Forces & Staging Drills",
    pos: [24, 0, -8],
    radius: 4.8,
    color: "#FFD700",
    targetPhase: "training",
    icon: "⚡",
  },
  {
    id: "hangar",
    name: "Rocket Assembly Hangar",
    sub: "Authentic NASA 3D Hardware Integration",
    pos: [-22, 0, 16],
    radius: 5.0,
    color: "#FF9100",
    targetPhase: "build",
    icon: "🔧",
  },
  {
    id: "launchpad",
    name: "Orbital Launch Complex 39X",
    sub: "Saturn V / SLS Heavy-Lift Pad",
    pos: [0, 0, -42],
    radius: 6.0,
    color: "#FF5252",
    targetPhase: "check",
    icon: "🔥",
  },
  {
    id: "antigrav",
    name: "Anti-Gravity Mag-Transit Station",
    sub: "High-Speed Transit (Fictional Future Tech)",
    pos: [22, 0, 16],
    radius: 4.5,
    color: "#E040FB",
    icon: "🚝",
  },
];

export function ForgeCityScene() {
  const { camera } = useThree();
  const playerPos = useRef(new THREE.Vector3(0, 0, 8));
  const playerVelocity = useRef(new THREE.Vector3(0, 0, 0));
  const keys = useRef<{ [k: string]: boolean }>({});
  const activeZone = useMissionStore((s) => s.activeCityZone);
  const setStore = useMissionStore((s) => s.set);
  const go = useMissionStore((s) => s.go);
  const say = useMissionStore((s) => s.say);

  // Keyboard controls listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
      if (e.key === "e" || e.key === "E") {
        // Trigger interaction with active zone
        const curZone = CITY_ZONES.find((z) => {
          const d = playerPos.current.distanceTo(new THREE.Vector3(...z.pos));
          return d <= z.radius;
        });
        if (curZone) {
          if (curZone.targetPhase) {
            say(`Entering ${curZone.name}`, "ok");
            go(curZone.targetPhase as never);
          } else {
            say(`${curZone.name}: Future Expansion (Speculative Fictional Tech)`, "info");
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
    // Player movement
    const speed = keys.current["shift"] ? 14 : 8;
    const moveDir = new THREE.Vector3();

    if (keys.current["w"] || keys.current["arrowup"]) moveDir.z -= 1;
    if (keys.current["s"] || keys.current["arrowdown"]) moveDir.z += 1;
    if (keys.current["a"] || keys.current["arrowleft"]) moveDir.x -= 1;
    if (keys.current["d"] || keys.current["arrowright"]) moveDir.x += 1;

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize();
      playerVelocity.current.lerp(moveDir.multiplyScalar(speed), 0.15);
    } else {
      playerVelocity.current.lerp(new THREE.Vector3(0, 0, 0), 0.2);
    }

    playerPos.current.addScaledVector(playerVelocity.current, delta);

    // World boundary clamping
    playerPos.current.x = Math.max(-48, Math.min(48, playerPos.current.x));
    playerPos.current.z = Math.max(-55, Math.min(30, playerPos.current.z));

    // Smooth camera follow
    const targetCamPos = new THREE.Vector3(
      playerPos.current.x,
      playerPos.current.y + 6.5,
      playerPos.current.z + 11.5
    );
    camera.position.lerp(targetCamPos, 0.1);
    camera.lookAt(playerPos.current.x, playerPos.current.y + 1.2, playerPos.current.z - 2);

    // Zone detection
    let detectedZone: string | null = null;
    for (const z of CITY_ZONES) {
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
      {/* Sky & Ambient Sci-Fi Lighting */}
      <color attach="background" args={["#030712"]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[20, 40, 20]} intensity={1.2} castShadow color="#E0F2FE" />
      <pointLight position={[0, 15, -15]} intensity={2.5} color="#00E5FF" distance={60} />
      <pointLight position={[-24, 10, -8]} intensity={1.8} color="#69F0AE" distance={40} />
      <pointLight position={[24, 10, -8]} intensity={1.8} color="#FFD700" distance={40} />
      <pointLight position={[0, 25, -42]} intensity={3.0} color="#FF5252" distance={70} />

      {/* Main Ground Plaza (PBR Reflective Tile Grid) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -10]} receiveShadow>
        <planeGeometry args={[110, 110]} />
        <meshStandardMaterial color="#0A0E17" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Decorative Grid Lines */}
      <gridHelper args={[110, 55, "#00E5FF", "#1E293B"]} position={[0, 0.01, -10]} />

      {/* Central Plaza Monument / Hologram Sphere */}
      <group position={[0, 2.5, 0]}>
        <mesh>
          <sphereGeometry args={[1.6, 32, 32]} />
          <meshStandardMaterial color="#00E5FF" wireframe emissive="#00E5FF" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0, -2.4, 0]}>
          <cylinderGeometry args={[2.8, 3.2, 0.4, 32]} />
          <meshStandardMaterial color="#1E293B" roughness={0.5} metalness={0.8} />
        </mesh>
      </group>

      {/* 3D Buildings & Landmarks */}
      {/* 1. Space Center Main Tower */}
      <group position={[0, 0, -24]}>
        <mesh position={[0, 8, 0]}>
          <boxGeometry args={[14, 16, 12]} />
          <meshStandardMaterial color="#0F172A" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Luminous entrance arch */}
        <mesh position={[0, 3, 6.1]}>
          <boxGeometry args={[6, 6, 0.4]} />
          <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.8} />
        </mesh>
        <Text position={[0, 14, 6.2]} fontSize={0.9} color="#FFFFFF" anchorX="center" anchorY="middle">
          MISSION FORGE SPACE CENTER
        </Text>
      </group>

      {/* 2. Space Science Classroom */}
      <group position={[-24, 0, -8]}>
        <mesh position={[0, 5, 0]}>
          <boxGeometry args={[12, 10, 12]} />
          <meshStandardMaterial color="#0B132B" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 2.5, 6.1]}>
          <boxGeometry args={[4.5, 5, 0.3]} />
          <meshStandardMaterial color="#69F0AE" emissive="#69F0AE" emissiveIntensity={0.7} />
        </mesh>
        <Text position={[0, 9, 6.2]} fontSize={0.75} color="#69F0AE" anchorX="center" anchorY="middle">
          SCIENCE ACADEMY
        </Text>
      </group>

      {/* 3. Astronaut Training Center */}
      <group position={[24, 0, -8]}>
        <mesh position={[0, 5, 0]}>
          <cylinderGeometry args={[6.5, 7, 10, 32]} />
          <meshStandardMaterial color="#111827" metalness={0.75} roughness={0.35} />
        </mesh>
        <mesh position={[0, 2.5, 6.6]}>
          <boxGeometry args={[4, 5, 0.3]} />
          <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.7} />
        </mesh>
        <Text position={[0, 9, 6.8]} fontSize={0.75} color="#FFD700" anchorX="center" anchorY="middle">
          TRAINING CENTER
        </Text>
      </group>

      {/* 4. Assembly Hangar */}
      <group position={[-22, 0, 16]}>
        <mesh position={[0, 6, 0]}>
          <boxGeometry args={[14, 12, 14]} />
          <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 3.5, 7.1]}>
          <boxGeometry args={[7, 7, 0.3]} />
          <meshStandardMaterial color="#FF9100" emissive="#FF9100" emissiveIntensity={0.6} />
        </mesh>
        <Text position={[0, 10.5, 7.2]} fontSize={0.75} color="#FF9100" anchorX="center" anchorY="middle">
          ROCKET HANGAR
        </Text>
      </group>

      {/* 5. Launch Complex 39X Tower & Gantry */}
      <group position={[0, 0, -42]}>
        {/* Launch Pad Base */}
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[10, 12, 3, 32]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Red Launch Umbilical Tower */}
        <mesh position={[-5, 14, 0]}>
          <boxGeometry args={[2.5, 26, 2.5]} />
          <meshStandardMaterial color="#EF4444" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Simplified Rocket on Pad */}
        <mesh position={[0, 12, 0]}>
          <cylinderGeometry args={[1.2, 1.4, 18, 32]} />
          <meshStandardMaterial color="#F8FAFC" metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[0, 22, 0]}>
          <coneGeometry args={[1.2, 3.5, 32]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.3} roughness={0.3} />
        </mesh>
        <Text position={[0, 26, 0]} fontSize={1.1} color="#FF5252" anchorX="center" anchorY="middle">
          LAUNCH COMPLEX 39X
        </Text>
      </group>

      {/* 6. Anti-Gravity Mag-Transit Station */}
      <group position={[22, 0, 16]}>
        <mesh position={[0, 4.5, 0]}>
          <boxGeometry args={[11, 9, 10]} />
          <meshStandardMaterial color="#1E1B4B" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Floating Ring Portal */}
        <mesh position={[0, 4.5, 5.2]} rotation={[0, 0, 0]}>
          <torusGeometry args={[2.4, 0.35, 16, 48]} />
          <meshStandardMaterial color="#E040FB" emissive="#E040FB" emissiveIntensity={0.8} />
        </mesh>
        <Text position={[0, 8.5, 5.3]} fontSize={0.7} color="#E040FB" anchorX="center" anchorY="middle">
          ANTI-GRAVITY TRANSIT
        </Text>
      </group>

      {/* Render Zone Trigger Rings */}
      {CITY_ZONES.map((zone) => (
        <group key={zone.id} position={zone.pos}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
            <ringGeometry args={[zone.radius - 0.4, zone.radius, 48]} />
            <meshBasicMaterial color={zone.color} side={THREE.DoubleSide} transparent opacity={0.65} />
          </mesh>
        </group>
      ))}

      {/* Player Character Avatar (Sci-Fi Trainee) */}
      <PlayerMesh playerPos={playerPos} />
    </group>
  );
}

function PlayerMesh({ playerPos }: { playerPos: React.MutableRefObject<THREE.Vector3> }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(playerPos.current);
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 8]}>
      {/* Torso & Flight Suit */}
      <mesh position={[0, 1.25, 0]}>
        <capsuleGeometry args={[0.35, 0.7, 8, 16]} />
        <meshStandardMaterial color="#0284C7" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Helmet & Visor */}
      <mesh position={[0, 1.95, 0]}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.95, 0.2]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#F59E0B" roughness={0.1} metalness={0.9} emissive="#F59E0B" emissiveIntensity={0.3} />
      </mesh>
      {/* Thruster Backpack */}
      <mesh position={[0, 1.35, -0.3]}>
        <boxGeometry args={[0.4, 0.55, 0.2]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.7} />
      </mesh>
      {/* Shadow Disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.55, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.45} />
      </mesh>
    </group>
  );
}
