import * as THREE from "three";
import { CITY_MATERIALS } from "./city-materials";

/**
 * Procedural Road & Pavement Network
 * Connects Central Plaza, Space Center, Research Campus, Hangar, and Spaceport
 */
export function RoadNetwork() {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main North-South Central Boulevard (Plaza -> Space Center -> Launch Complex) */}
      {/* Roadbed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -18]} receiveShadow>
        <planeGeometry args={[14, 90]} />
        <primitive object={CITY_MATERIALS.asphaltRoad} attach="material" />
      </mesh>
      {/* Road Centerline Dashes */}
      {Array.from({ length: 18 }).map((_, i) => (
        <mesh
          key={`dash-ns-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.03, 20 - i * 5]}
        >
          <planeGeometry args={[0.3, 2.5]} />
          <primitive object={CITY_MATERIALS.roadMarking} attach="material" />
        </mesh>
      ))}
      {/* Sidewalks (West & East) */}
      <mesh position={[-7.75, 0.12, -18]} receiveShadow>
        <boxGeometry args={[1.5, 0.24, 90]} />
        <primitive object={CITY_MATERIALS.curbStone} attach="material" />
      </mesh>
      <mesh position={[7.75, 0.12, -18]} receiveShadow>
        <boxGeometry args={[1.5, 0.24, 90]} />
        <primitive object={CITY_MATERIALS.curbStone} attach="material" />
      </mesh>

      {/* 2. East-West Avenues (Connecting Research Campus & Rocket Hangar) */}
      {/* South Avenue (z = 12) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 12]} receiveShadow>
        <planeGeometry args={[95, 12]} />
        <primitive object={CITY_MATERIALS.asphaltRoad} attach="material" />
      </mesh>
      {/* Mid Avenue (z = -12) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -12]} receiveShadow>
        <planeGeometry args={[95, 12]} />
        <primitive object={CITY_MATERIALS.asphaltRoad} attach="material" />
      </mesh>

      {/* East-West Dashed Markings */}
      {Array.from({ length: 18 }).map((_, i) => (
        <mesh
          key={`dash-ew1-${i}`}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          position={[-42 + i * 5, 0.03, 12]}
        >
          <planeGeometry args={[0.3, 2.5]} />
          <primitive object={CITY_MATERIALS.roadMarking} attach="material" />
        </mesh>
      ))}

      {/* 3. Central Plaza Pedestrian Pavement (Around Coordinate Origin) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} receiveShadow>
        <planeGeometry args={[36, 36]} />
        <primitive object={CITY_MATERIALS.plazaConcrete} attach="material" />
      </mesh>

      {/* Landscaping Green Belts / Parks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-25, 0.025, 0]} receiveShadow>
        <planeGeometry args={[20, 18]} />
        <primitive object={CITY_MATERIALS.campusGreen} attach="material" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[25, 0.025, 0]} receiveShadow>
        <planeGeometry args={[20, 18]} />
        <primitive object={CITY_MATERIALS.campusGreen} attach="material" />
      </mesh>

      {/* Street Light Posts with Warm Lighting Pools */}
      {[-24, -12, 0, 12, 24].map((zPos, idx) => (
        <group key={`light-ns-${idx}`}>
          {/* West Post */}
          <group position={[-8.8, 0, zPos]}>
            <mesh position={[0, 3, 0]}>
              <cylinderGeometry args={[0.08, 0.12, 6, 8]} />
              <primitive object={CITY_MATERIALS.silverTitanium} attach="material" />
            </mesh>
            <mesh position={[0.6, 5.8, 0]}>
              <boxGeometry args={[1.2, 0.15, 0.3]} />
              <primitive object={CITY_MATERIALS.darkAerospace} attach="material" />
            </mesh>
            <mesh position={[1.0, 5.68, 0]}>
              <boxGeometry args={[0.4, 0.08, 0.22]} />
              <meshBasicMaterial color="#38BDF8" />
            </mesh>
          </group>

          {/* East Post */}
          <group position={[8.8, 0, zPos]}>
            <mesh position={[0, 3, 0]}>
              <cylinderGeometry args={[0.08, 0.12, 6, 8]} />
              <primitive object={CITY_MATERIALS.silverTitanium} attach="material" />
            </mesh>
            <mesh position={[-0.6, 5.8, 0]}>
              <boxGeometry args={[1.2, 0.15, 0.3]} />
              <primitive object={CITY_MATERIALS.darkAerospace} attach="material" />
            </mesh>
            <mesh position={[-1.0, 5.68, 0]}>
              <boxGeometry args={[0.4, 0.08, 0.22]} />
              <meshBasicMaterial color="#38BDF8" />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}
