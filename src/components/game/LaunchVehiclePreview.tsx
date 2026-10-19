import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { PerspectiveCamera, Vector3 } from "three";
import { useTranslation } from "react-i18next";
import { useMissionStore } from "../../stores/mission-store";
import { LAUNCH_VEHICLES, type LaunchVehicleId } from "../../lib/launch-vehicles";
import { LaunchVehicleImage } from "./LaunchVehicleSelector";
import { Nasa3DModel } from "./Nasa3DModel";
import { SceneControls } from "./Presentation";

// Preview assets deliberately do not replace the separate cinematic launch assets.
const MODELS: Record<LaunchVehicleId, string> = {
  "saturn-v": "/assets/launch-vehicles/model/saturn_v_rocket.glb",
  "sls-block-1": "/assets/launch-vehicles/model/sls_artemis_rocket.glb",
};
type Result = { vehicle: LaunchVehicleId; state: "loading" | "ready" | "error" } | null;
const ModeContext = createContext<{
  hangar: boolean;
  setHangar: Dispatch<SetStateAction<boolean>>;
  stage: RefObject<HTMLDivElement | null>;
} | null>(null);
const LoadContext = createContext<{
  result: Result;
  setResult: Dispatch<SetStateAction<Result>>;
  attempt: number;
  retry: () => void;
} | null>(null);

export function LaunchPreviewProvider({ children }: { children: ReactNode }) {
  const [hangar, setHangar] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<Result>(null);
  const [attempt, setAttempt] = useState(0);
  const mode = useMemo(() => ({ hangar, setHangar, stage }), [hangar]);
  const load = useMemo(
    () => ({
      result,
      setResult,
      attempt,
      retry: () => {
        setResult(null);
        setAttempt((n) => n + 1);
      },
    }),
    [result, attempt],
  );
  return (
    <ModeContext.Provider value={mode}>
      <LoadContext.Provider value={load}>{children}</LoadContext.Provider>
    </ModeContext.Provider>
  );
}

export function useLaunchPreviewMode() {
  const context = useContext(ModeContext);
  if (!context) throw new Error("Launch preview requires LaunchPreviewProvider");
  return context;
}
function useLoad() {
  const context = useContext(LoadContext);
  if (!context) throw new Error("Launch preview requires LaunchPreviewProvider");
  return context;
}

export function LaunchVehiclePreviewPanel() {
  const { t } = useTranslation();
  const vehicle = useMissionStore((s) => s.launchVehicle);
  const { stage } = useLaunchPreviewMode();
  const { result, retry } = useLoad();
  const state = result?.vehicle === vehicle ? result.state : "loading";
  return (
    <div
      ref={stage}
      className="mf-launch-preview"
      data-preview-vehicle={vehicle}
      data-preview-status={state}
      aria-label={t("launchVehicle.preview.title", { vehicle: LAUNCH_VEHICLES[vehicle].name })}
    >
      <h2>{LAUNCH_VEHICLES[vehicle].name}</h2>
      <p role="status" className="mf-launch-preview-status">
        {t(`launchVehicle.preview.${state}`)}
      </p>
      {state === "error" && (
        <div className="mf-launch-preview-fallback">
          <LaunchVehicleImage key={vehicle} vehicle={vehicle} />
          <button onClick={retry}>{t("launchVehicle.preview.retry")}</button>
        </div>
      )}
      {state === "ready" && (
        <footer>
          <p>{t("launchVehicle.preview.hint")}</p>
          <SceneControls />
        </footer>
      )}
    </div>
  );
}

export function LaunchVehiclePreviewScene() {
  const vehicle = useMissionStore((s) => s.launchVehicle);
  const { stage } = useLaunchPreviewMode();
  const { result, setResult, attempt } = useLoad();
  const state = result?.vehicle === vehicle ? result.state : "loading";
  const { camera, size } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const home = useRef(new Vector3());
  const onLoad = useCallback(() => setResult({ vehicle, state: "ready" }), [vehicle, setResult]);
  const onError = useCallback(() => setResult({ vehicle, state: "error" }), [vehicle, setResult]);

  // Keep one full-screen canvas. Shift its projection to the center of the DOM
  // preview pane, leaving the selector unobscured. Logical offsets also work in
  // the game's existing rotated portrait viewport.
  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera) || !stage.current) return;
    const pane = stage.current;
    setElement(pane);
    const root = pane.closest<HTMLElement>(".mf-game-viewport");
    if (!root) return;
    const previousFov = camera.fov;
    const frame = () => {
      const width = root.clientWidth,
        height = root.clientHeight;
      if (!width || !height || !pane.clientWidth || !pane.clientHeight) return;
      let x = 0,
        y = 0,
        node: HTMLElement | null = pane;
      while (node && node !== root) {
        x += node.offsetLeft;
        y += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      const usableHeight = Math.max(80, pane.clientHeight - 150);
      camera.fov = 40;
      camera.setViewOffset(
        width,
        height,
        width / 2 - (x + pane.clientWidth / 2),
        height / 2 - (y + pane.clientHeight / 2),
        width,
        height,
      );
      const halfFov = (camera.fov * Math.PI) / 360;
      // Nasa3DModel normalizes the longest dimension to 6 world units. A sphere
      // of radius 3.15 encloses either supplied upright rocket at any rotation.
      const fit = Math.min(
        (Math.tan(halfFov) * usableHeight) / height,
        (Math.tan(halfFov) * pane.clientWidth) / height,
      );
      const distance = (3.15 / Math.max(fit, 0.01)) * 1.1;
      home.current.set(0, 0, distance);
      camera.position.copy(home.current);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      if (controls.current) {
        controls.current.target.set(0, 0, 0);
        controls.current.minDistance = distance * 0.65;
        controls.current.maxDistance = distance * 2;
        controls.current.update();
      }
    };
    frame();
    const observer = new ResizeObserver(frame);
    observer.observe(pane);
    observer.observe(root);
    const action = (event: Event) => {
      const control = controls.current;
      if (!control) return;
      const value = (event as CustomEvent<string>).detail;
      if (value === "reset") {
        frame();
        return;
      }
      const offset = camera.position.clone().sub(control.target);
      if (value === "left" || value === "right")
        offset.applyAxisAngle(new Vector3(0, 1, 0), value === "left" ? -0.25 : 0.25);
      else if (value === "in" || value === "out")
        offset
          .multiplyScalar(value === "in" ? 0.85 : 1.15)
          .clampLength(control.minDistance, control.maxDistance);
      else return;
      camera.position.copy(control.target).add(offset);
      control.update();
    };
    window.addEventListener("mf-camera", action);
    return () => {
      observer.disconnect();
      window.removeEventListener("mf-camera", action);
      camera.clearViewOffset();
      camera.fov = previousFov;
      camera.updateProjectionMatrix();
    };
  }, [camera, size.width, size.height, stage, vehicle]);

  // The controls bind only to the preview DOM pane, not to the selector or city.
  useEffect(() => {
    controls.current?.update();
  }, [element]);
  return (
    <>
      <color attach="background" args={["#091321"]} />
      <ambientLight intensity={1.3} />
      <directionalLight position={[4, 6, 7]} intensity={3} color="#fff3df" />
      <directionalLight position={[-4, 2, -3]} intensity={2} color="#9bcfff" />
      {state !== "error" && (
        <Nasa3DModel
          key={`${vehicle}-${attempt}`}
          modelUrl={MODELS[vehicle]}
          targetSize={6}
          autoRotate={false}
          onLoad={onLoad}
          onError={onError}
        />
      )}
      {element && (
        <OrbitControls
          ref={controls}
          domElement={element}
          makeDefault
          enablePan={false}
          enableDamping
          minDistance={home.current.length() * 0.65}
          maxDistance={home.current.length() * 2}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(Math.PI * 2) / 3}
          target={[0, 0, 0]}
        />
      )}
    </>
  );
}
