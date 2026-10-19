import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ImageOff } from "lucide-react";
import { LAUNCH_VEHICLES, type LaunchVehicleId } from "../../lib/launch-vehicles";
import { analyze, fmt } from "../../lib/mission-sim";
import { designOf, useMissionStore } from "../../stores/mission-store";

export function LaunchVehicleImage({ vehicle }: { vehicle: LaunchVehicleId }) {
  const { t } = useTranslation();
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div
      className="mf-launch-image-fallback"
      role="img"
      aria-label={t(`launchVehicle.alt.${vehicle}`)}
    >
      <ImageOff aria-hidden="true" />
      <span>{t("launchVehicle.imageFallback")}</span>
    </div>
  ) : (
    <img
      src={LAUNCH_VEHICLES[vehicle].image}
      alt={t(`launchVehicle.alt.${vehicle}`)}
      onError={() => setFailed(true)}
    />
  );
}

export function LaunchCapabilitySummary() {
  const { t } = useTranslation();
  const s = useMissionStore(),
    a = analyze(designOf(s));
  return (
    <section className="mf-launch-capability" aria-live="polite">
      <strong>
        {t("launchVehicle.model", {
          vehicle: a.launch.vehicle.name,
          destination: t(`exp.destinations.${s.mission}.name`),
          mass: fmt(a.wet),
          limit: fmt(a.launch.limitKg),
        })}
      </strong>
      <p className={a.wet > a.launch.limitKg ? "mf-bad" : "mf-ok"}>
        {t(`launchVehicle.${a.wet > a.launch.limitKg ? "exceeds" : "fits"}`)}
      </p>
      <details>
        <summary>{t("launchVehicle.assumptions")}</summary>
        <p>{t("launchVehicle.assumption")}</p>
      </details>
    </section>
  );
}

export function LaunchVehicleSelector() {
  const { t } = useTranslation();
  const selected = useMissionStore((s) => s.launchVehicle),
    set = useMissionStore((s) => s.set);
  return (
    <section className="mf-launch-selector" aria-label={t("launchVehicle.choose")}>
      <h2>{t("launchVehicle.choose")}</h2>
      <div className="mf-launch-choices">
        {(Object.keys(LAUNCH_VEHICLES) as LaunchVehicleId[]).map((id) => {
          const vehicle = LAUNCH_VEHICLES[id];
          return (
            <article key={id} className={selected === id ? "is-selected" : ""}>
              <LaunchVehicleImage vehicle={id} />
              <button
                type="button"
                aria-label={vehicle.name}
                aria-pressed={selected === id}
                onClick={() => set({ launchVehicle: id })}
              >
                <strong>{vehicle.name}</strong>
                {selected === id && <Check aria-label={t("launchVehicle.selected")} />}
              </button>
              <p>{t(`launchVehicle.descriptions.${id}`)}</p>
              <p>{t("launchVehicle.reference", { mass: fmt(vehicle.lunarReferenceKg) })}</p>
              <a href={vehicle.source} target="_blank" rel="noreferrer">
                {t("launchVehicle.source")}
              </a>
            </article>
          );
        })}
      </div>
      <LaunchCapabilitySummary />
    </section>
  );
}
