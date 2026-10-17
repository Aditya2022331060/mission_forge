import * as THREE from "three";
import { CITY_MATERIALS } from "./city-materials";

/**
 * 1. Space Center Main Lobby Interior
 * Reception desk, digital mission monitors, large glass walls, seating
 */
export function SpaceCenterLobbyInterior({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Floor & Ceiling */}
      <mesh position={[0, 0.05, 0]} receiveShadow material={CITY_MATERIALS.plazaConcrete}>
        <boxGeometry args={[18, 0.1, 14]} />
      </mesh>
      <mesh position={[0, 6.95, 0]} material={CITY_MATERIALS.darkAerospace}>
        <boxGeometry args={[18, 0.1, 14]} />
      </mesh>

      {/* Back Wall with Large Screen Displays */}
      <mesh position={[0, 3.5, -6.9]} receiveShadow material={CITY_MATERIALS.darkAerospace}>
        <boxGeometry args={[17.8, 6.8, 0.2]} />
      </mesh>
      {/* Flight Operations Center Main Display Wall */}
      <mesh position={[0, 4.2, -6.7]} material={CITY_MATERIALS.solarAtriumGlass}>
        <boxGeometry args={[10, 3.8, 0.1]} />
      </mesh>

      {/* Curved Reception / Flight Director Console */}
      <group position={[0, 0, -2]}>
        <mesh position={[0, 0.65, 0]} castShadow material={CITY_MATERIALS.silverTitanium}>
          <cylinderGeometry args={[2.5, 2.7, 1.2, 32, 1, false, 0, Math.PI]} />
        </mesh>
        <mesh position={[0, 1.28, 0]} material={CITY_MATERIALS.darkAerospace}>
          <cylinderGeometry args={[2.6, 2.8, 0.08, 32, 1, false, 0, Math.PI]} />
        </mesh>
      </group>

      {/* Modular Seating Lounges */}
      {[-5, 5].map((xOffset) => (
        <group key={`lounge-${xOffset}`} position={[xOffset, 0, 1]}>
          <mesh position={[0, 0.35, 0]} castShadow material={CITY_MATERIALS.darkAerospace}>
            <boxGeometry args={[3.2, 0.6, 1.2]} />
          </mesh>
          <mesh position={[0, 0.8, -0.5]} material={CITY_MATERIALS.silverTitanium}>
            <boxGeometry args={[3.2, 0.7, 0.2]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * 2. Space Science Classroom Interior
 * Student desks, instructor podium, interactive solar system display
 */
export function ClassroomInterior({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Floor */}
      <mesh position={[0, 0.05, 0]} receiveShadow material={CITY_MATERIALS.whiteComposite}>
        <boxGeometry args={[14, 0.1, 14]} />
      </mesh>

      {/* Front Presentation Wall */}
      <mesh position={[0, 2.8, -6.8]} material={CITY_MATERIALS.solarAtriumGlass}>
        <boxGeometry args={[8.5, 3.8, 0.1]} />
      </mesh>

      {/* Instructor Podium */}
      <mesh position={[0, 0.65, -4.5]} castShadow material={CITY_MATERIALS.darkAerospace}>
        <boxGeometry args={[1.6, 1.2, 0.9]} />
      </mesh>

      {/* Student Desks (3 Rows) */}
      {[-2, 0.5, 3.0].map((zRow, rIdx) => (
        <group key={`row-${rIdx}`} position={[0, 0, zRow]}>
          {[-3.5, 0, 3.5].map((xCol, cIdx) => (
            <group key={`desk-${rIdx}-${cIdx}`} position={[xCol, 0, 0]}>
              <mesh position={[0, 0.5, 0]} castShadow material={CITY_MATERIALS.silverTitanium}>
                <boxGeometry args={[2.0, 0.08, 0.9]} />
              </mesh>
              {/* Desk Legs */}
              <mesh position={[-0.9, 0.25, 0]} material={CITY_MATERIALS.gantrySteel}>
                <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
              </mesh>
              <mesh position={[0.9, 0.25, 0]} material={CITY_MATERIALS.gantrySteel}>
                <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

/**
 * 3. Research Laboratory Interior
 * Clean-room benches, experiment racks, technical analysis units
 */
export function LaboratoryInterior({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Floor */}
      <mesh position={[0, 0.05, 0]} receiveShadow material={CITY_MATERIALS.plazaConcrete}>
        <boxGeometry args={[16, 0.1, 14]} />
      </mesh>

      {/* Central Clean-Room Experiment Island */}
      <mesh position={[0, 0.55, 0]} castShadow material={CITY_MATERIALS.silverTitanium}>
        <boxGeometry args={[7, 1.0, 2.5]} />
      </mesh>
      {/* Glass Isolation Hood */}
      <mesh position={[0, 1.45, 0]} material={CITY_MATERIALS.cyanCurtainGlass}>
        <boxGeometry args={[5.5, 0.8, 1.8]} />
      </mesh>

      {/* Equipment Racks & Wall Terminals */}
      {[-6.5, 6.5].map((xPos) => (
        <group key={`rack-${xPos}`} position={[xPos, 0, 0]}>
          <mesh position={[0, 2.5, 0]} castShadow material={CITY_MATERIALS.darkAerospace}>
            <boxGeometry args={[1.2, 4.8, 8]} />
          </mesh>
          <mesh position={[xPos > 0 ? -0.65 : 0.65, 2.8, 0]} material={CITY_MATERIALS.illuminatedWindow}>
            <boxGeometry args={[0.08, 1.5, 4]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * 4. Rocket Engineering Hangar Interior
 * High ceilings, structural steel trusses, rocket staging cradle
 */
export function RocketHangarInterior({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Heavy Duty Concrete Floor */}
      <mesh position={[0, 0.05, 0]} receiveShadow material={CITY_MATERIALS.asphaltRoad}>
        <boxGeometry args={[24, 0.1, 22]} />
      </mesh>

      {/* High-Bay Structural Overhead Gantry Beams */}
      {[-7, 0, 7].map((zBeam) => (
        <group key={`truss-${zBeam}`} position={[0, 9.5, zBeam]}>
          <mesh material={CITY_MATERIALS.warningYellow}>
            <boxGeometry args={[23.8, 0.6, 0.8]} />
          </mesh>
          <mesh position={[-11.5, -4.5, 0]} material={CITY_MATERIALS.gantrySteel}>
            <boxGeometry args={[0.8, 9.0, 0.8]} />
          </mesh>
          <mesh position={[11.5, -4.5, 0]} material={CITY_MATERIALS.gantrySteel}>
            <boxGeometry args={[0.8, 9.0, 0.8]} />
          </mesh>
        </group>
      ))}

      {/* Central Rocket Fuselage Assembly Cradle */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.4, 0]} material={CITY_MATERIALS.gantrySteel}>
          <boxGeometry args={[6, 0.7, 14]} />
        </mesh>
        {/* Support Stanchions */}
        {[-4, 0, 4].map((zStanch) => (
          <mesh key={`stanch-${zStanch}`} position={[0, 1.2, zStanch]} material={CITY_MATERIALS.warningYellow}>
            <cylinderGeometry args={[2.2, 2.5, 0.9, 32, 1, false, 0, Math.PI]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
