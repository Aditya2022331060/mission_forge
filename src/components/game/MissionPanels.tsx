import { LaunchCapabilitySummary } from "./LaunchVehicleSelector";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Check, AlertTriangle, RefreshCcw, Rocket } from "lucide-react";
import { analyze, finalScore, fmt } from "../../lib/mission-sim";
import { designOf, useMissionStore } from "../../stores/mission-store";
import { GoPoll } from "./GoPoll";
import { rt } from "./runtime";
import { Button } from "../ui/button";

export function ReadinessPanel() {
  const s = useMissionStore(), a = analyze(designOf(s));
  const { t } = useTranslation();
  const [ready, setReady] = useState(false);
  const fixes = [
    { show: a.wet > a.launch.limitKg, label: "fixMass", phase: "build" as const },
    { show: a.dvMargin < 0.1, label: "fixFuel", phase: "fuel" as const },
    { show: a.powerMargin < 0.15, label: "fixPower", phase: "power" as const },
    { show: s.antennas < 2, label: "fixComms", phase: "comms" as const },
    { show: a.hazard > 0.3 && !s.shield, label: "fixShield", phase: "comms" as const },
    { show: a.science === 0, label: "fixScience", phase: "instruments" as const },
  ].filter(f => f.show);
  return <aside className="mf-operation-panel mf-readiness">
    <p className="gm-kicker">{t("exp.preflight")}</p>
    <h1>{t("exp.checkTitle")}</h1>
    <div className={`mf-verdict ${a.canLaunch ? "is-go" : "is-warning"}`}>
      {a.canLaunch ? <Check /> : <AlertTriangle />}<div><strong>{t(a.canLaunch ? "exp.ready" : "exp.atRisk")}</strong><p>{t("ui.game.readiness")} {a.readiness} / 100 · {t("ui.flow.gameEstimate")}</p></div>
    </div>
    <div className="mf-metric-pair"><span>{t("ui.game.mass")}<b>{fmt(a.wet)} kg</b></span><span>{t("exp.reserve")}<b>{(a.dv - a.required).toFixed(2)} km/s</b></span></div>
    {fixes.length > 0 && <section className="mf-fixes"><h2>{t("exp.improve")}</h2>{fixes.map(f => <button key={f.label} onClick={() => s.go(f.phase)}><span>{t(`exp.${f.label}`)}</span><ArrowRight size={16} /></button>)}</section>}
    <LaunchCapabilitySummary /><GoPoll onReady={setReady} />
    <footer className="mf-panel-actions"><Button variant="secondary" onClick={() => s.go("build")}><ArrowLeft />{t("ui.game.hangar")}</Button><Button disabled={!ready} onClick={() => { rt.launchT = 0; s.go("launch"); }}><Rocket />{t(a.canLaunch ? "exp.launch" : "ui.flow.launchRisk")}</Button></footer>
  </aside>;
}

export function MissionReport() {
  const s = useMissionStore(), d = designOf(s), a = analyze(d), sc = finalScore(d, s.outcome, s.rescued, s.landingErrors);
  const { t } = useTranslation();
  const result = s.outcome?.failed ? (s.rescued ? "recovered" : "lost") : "success";
  return <div className="mf-report-layout">
    <section className="mf-report-hero"><p className="gm-kicker">{t("exp.debrief")}</p><h1>{t(`exp.${result}`)}</h1><p>{t(`exp.destinations.${s.mission}.name`)} · {a.days} {t("exp.days")}</p><div className="mf-score"><strong>{sc.total}</strong><span>/ 100<br />{t("ui.flow.gameEstimate")}</span></div></section>
    <aside className="mf-operation-panel mf-report-panel"><p className="gm-kicker">{t("exp.report")}</p><h2>{t("exp.choicesMatter")}</h2>
      <section className="mf-launch-report"><h3>{t("launchVehicle.debrief")}: {a.launch.vehicle.name}</h3><LaunchCapabilitySummary /></section><div className="mf-report-scores">{(["objective", "science", "safety", "resources", "landing"] as const).map(key => <div key={key}><span>{t(`exp.score_${key}`)}</span><b>{sc[key]}</b><meter min={0} max={100} value={sc[key]} aria-label={t(`exp.score_${key}`)} /></div>)}</div>
      <div className="mf-lessons">
        <article><span>01</span><div><h3>{t("exp.reserve")}: {(a.dv - a.required).toFixed(2)} km/s</h3><p>{t(a.dvMargin < 0.1 ? "exp.lessonFuelLow" : "exp.lessonFuelGood")}</p></div></article>
        <article><span>02</span><div><h3>{t("exp.decision")}: {s.outcome ? t(`exp.choice_${s.outcome.choice}`) : t("exp.noEncounter")}</h3><p>{t(s.outcome?.failed ? "exp.lessonHazardBad" : "exp.lessonHazardGood")}</p></div></article>
        <article><span>03</span><div><h3>{t("exp.sequenceErrors", { count: s.landingErrors })}</h3><p>{t(s.landingErrors ? "exp.lessonLandingBad" : "exp.lessonLandingGood")}</p></div></article>
      </div>
      <p className="mf-science-note">{t("exp.reportNote")}</p>
      <footer className="mf-panel-actions"><Button variant="secondary" onClick={() => s.newRun("missions")}>{t("exp.newDestination")}</Button><Button onClick={() => s.newRun("build")}><RefreshCcw />{t("exp.retry")}</Button></footer>
    </aside>
  </div>;
}
