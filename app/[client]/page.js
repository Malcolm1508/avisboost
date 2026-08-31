import { cookies } from "next/headers";
import {
  getClient, getTaps, getDailyTaps, getReviews, getPlan, getDailyRange,
  getGoal, getLastScanInfo,
} from "@/lib/db";
import { verifySession, cookieName } from "@/lib/auth";
import Shell from "./Shell";
import Responder from "./Responder";
import Analyzer from "./Analyzer";
import Login from "./Login";
import CountUp from "./CountUp";
import ReviewUpdate from "./ReviewUpdate";
import Plan from "./Plan";
import PostVisual from "./PostVisual";
import Activity from "./Activity";
import Goal from "./Goal";

export const dynamic = "force-dynamic";

const I = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

export default async function Dashboard({ params }) {
  const { client } = await params;
  const c = await getClient(client);

  if (!c) {
    return (
      <div className="hero"><div className="hero-inner">
        <div className="eyebrow"><span className="dot"></span>BoostRepu</div>
        <h1 className="hero-title">Tableau de bord introuvable</h1>
        <p className="hero-sub">Aucun établissement ne correspond à « {client} ».</p>
      </div></div>
    );
  }

  const jar = await cookies();
  const token = jar.get(cookieName(client))?.value;
  if (!verifySession(token, client)) return <Login client={client} name={c.name} />;

  // --- données de base
  const taps = await getTaps(client);
  const daily = await getDailyTaps(client, 14);
  const week = daily.slice(-7).reduce((s, d) => s + d.value, 0);
  const prevWeek = daily.slice(-14, -7).reduce((s, d) => s + d.value, 0);
  const today = daily.length ? daily[daily.length - 1].value : 0;

  const rev = await getReviews(client);
  const plan = await getPlan(client);
  const history = await getDailyRange(client, 365);
  const goal = await getGoal(client);
  const { lastActiveDate } = await getLastScanInfo(client, 60);

  let generated = 0, scansSince = 0, conversion = null;
  if (rev) {
    generated = Math.max(0, rev.current - rev.base);
    scansSince = Math.max(0, taps - rev.tapsAtBase);
    conversion = scansSince > 0 ? Math.min(100, Math.round((generated / scansSince) * 100)) : null;
  }

  // ============ CALCUL DES 4 FEATURES ============

  // Feature A — Rappel intelligent (scans vs avis cette semaine)
  const weekConv = week > 0 && rev ? Math.round((Math.max(0, generated) / week) * 100) : null;

  // Feature B — Carte qui dort (jours depuis dernier scan)
  let daysSinceScan = null;
  if (lastActiveDate) {
    const diff = Math.floor((Date.now() - new Date(lastActiveDate + "T12:00:00").getTime()) / 86400000);
    daysSinceScan = Math.max(0, diff);
  }
  const dormant = taps > 0 && daysSinceScan != null && daysSinceScan >= 7;

  // Feature D — rythme hebdo d'avis (pour estimer l'échéance de l'objectif)
  // approximation : avis générés répartis sur le nb de semaines de suivi
  let weeklyReviewRate = 0;
  if (rev && generated > 0 && rev.updatedAt) {
    weeklyReviewRate = Math.max(0.5, generated / Math.max(1, weeksSince(rev.updatedAt)));
  } else if (generated > 0) {
    weeklyReviewRate = Math.max(0.5, generated / 4);
  }

  // Feature E — Score fraîcheur (basé sur l'ancienneté de la dernière saisie d'avis)
  let freshness = null;
  if (rev && rev.updatedAt) {
    const dReview = Math.floor((Date.now() - new Date(rev.updatedAt + "T12:00:00").getTime()) / 86400000);
    freshness = { days: Math.max(0, dReview) };
  }

  const showCoaching = taps > 0 || (rev && rev.current > 0);

  return (
    <Shell clientId={client} name={c.name} address={c.address} logoUrl={c.logoUrl} isDemo={client === "demo"}>
      <div className="container pull-up">

        {/* ===== LIGNE DE KPIs ===== */}
        <div className="kpi-row reveal" id="tableau">
          <div className="kpi">
            <div className="kpi-ic violet"><svg viewBox="0 0 24 24"><path d="M3 12h3l2-6 4 12 3-9 2 3h4" {...I} /></svg></div>
            <div className="kpi-body"><div className="kpi-n"><CountUp value={taps} /></div><div className="kpi-l">Scans au total</div></div>
          </div>
          <div className="kpi">
            <div className="kpi-ic or"><svg viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M2 12h4M18 12h4" {...I} /><circle cx="12" cy="12" r="4" {...I} /></svg></div>
            <div className="kpi-body"><div className="kpi-n">{today}</div><div className="kpi-l">Aujourd'hui</div></div>
          </div>
          <div className="kpi">
            <div className="kpi-ic vert"><svg viewBox="0 0 24 24"><path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 17l-5.3 2.7 1.1-5.9-4.3-4.1 5.9-.8z" {...I} /></svg></div>
            <div className="kpi-body"><div className="kpi-n">{rev ? `+${generated}` : "—"}</div><div className="kpi-l">Avis générés</div></div>
          </div>
          <div className="kpi">
            <div className="kpi-ic blue"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...I} /><path d="M12 7v5l3.5 2" {...I} /></svg></div>
            <div className="kpi-body"><div className="kpi-n">{conversion != null ? `${conversion}%` : "—"}</div><div className="kpi-l">Conversion</div></div>
          </div>
        </div>

        {/* ===== HERO STAT ===== */}
        <div className="card hero-stat reveal">
          <div>
            <div className="hero-stat-num"><CountUp value={taps} /></div>
            <div className="hero-stat-label">scans de votre carte au total</div>
          </div>
          <div className="hero-stat-side">
            <div className="hero-chip"><span className="n">{week}</span><span className="l">7 derniers jours</span>
              {prevWeek > 0 && <span className={"delta " + (week >= prevWeek ? "up" : "down")}>{week >= prevWeek ? "▲" : "▼"} {Math.abs(Math.round(((week - prevWeek) / prevWeek) * 100))}%</span>}
            </div>
            <div className="hero-chip"><span className="n">{today}</span><span className="l">aujourd'hui</span></div>
          </div>
          {taps === 0 && <p className="footnote" style={{ width: "100%" }}>Votre carte est prête. Posez-la à côté de votre caisse : les premiers scans apparaîtront ici.</p>}
        </div>

        {/* ===== ZONE COACHING (4 features) ===== */}
        {showCoaching && (
          <>
            <div className="section-head reveal">
              <h2 className="section-title">Votre coaching réputation</h2>
              <p className="section-sub">Ce que vos chiffres vous disent, et quoi faire cette semaine.</p>
            </div>

            <div className="grid cols-2">

              {/* D — Objectif */}
              <div className="card coach reveal" id="objectif">
                <div className="coach-head">
                  <div className="coach-ic violet"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...I} /><circle cx="12" cy="12" r="4" {...I} /><path d="M12 2v3M12 19v3" {...I} /></svg></div>
                  <div><h3 className="coach-title">Objectif d'avis</h3><p className="coach-sub">Fixez un cap, suivez la progression</p></div>
                </div>
                <Goal initialTarget={goal} current={rev ? rev.current : 0} weeklyRate={weeklyReviewRate} />
              </div>

              {/* B — Carte qui dort */}
              <div className={"card coach reveal" + (dormant ? " coach-alert" : "")} id="activite-carte">
                <div className="coach-head">
                  <div className={"coach-ic " + (dormant ? "red" : "vert")}>
                    <svg viewBox="0 0 24 24"><path d="M3 12h3l2-6 4 12 3-9 2 3h4" {...I} /></svg>
                  </div>
                  <div><h3 className="coach-title">État de votre carte</h3><p className="coach-sub">Est-elle encore active ?</p></div>
                </div>
                {daysSinceScan == null ? (
                  <p className="coach-msg">Aucun scan encore enregistré. Posez la carte bien en vue sur votre comptoir.</p>
                ) : dormant ? (
                  <p className="coach-msg coach-msg-alert">
                    ⚠️ Votre carte n'a pas été scannée depuis <b>{daysSinceScan} jours</b>. Elle est peut-être mal placée, cachée, ou déplacée. Remettez-la à côté de la caisse, là où le client attend.
                  </p>
                ) : (
                  <p className="coach-msg coach-msg-ok">
                    ✓ Votre carte est active — dernier scan il y a {daysSinceScan === 0 ? "moins d'un jour" : `${daysSinceScan} jour${daysSinceScan > 1 ? "s" : ""}`}. Continuez comme ça.
                  </p>
                )}
              </div>

              {/* A — Rappel intelligent */}
              <div className="card coach reveal" id="rappel">
                <div className="coach-head">
                  <div className="coach-ic blue"><svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" {...I} /><path d="M13.7 21a2 2 0 0 1-3.4 0" {...I} /></svg></div>
                  <div><h3 className="coach-title">Rappel de la semaine</h3><p className="coach-sub">Vos scans transformés en avis</p></div>
                </div>
                {week === 0 ? (
                  <p className="coach-msg">Pas encore de scan cette semaine. Un petit mot à vos clients au moment de payer fait toute la différence.</p>
                ) : weekConv != null && weekConv < 30 ? (
                  <p className="coach-msg">
                    Cette semaine : <b>{week} scans</b> mais peu d'avis en face. Beaucoup scannent sans aller au bout. Pensez à leur dire un mot d'encouragement — « ça nous aide beaucoup » — pendant qu'ils ont le téléphone en main.
                  </p>
                ) : (
                  <p className="coach-msg coach-msg-ok">
                    Belle semaine : <b>{week} scans</b>{weekConv != null ? <>, avec une bonne conversion en avis</> : null}. Vos clients jouent le jeu, continuez.
                  </p>
                )}
              </div>

              {/* E — Score fraîcheur */}
              <div className="card coach reveal" id="fraicheur">
                <div className="coach-head">
                  <div className={"coach-ic " + (freshness && freshness.days > 21 ? "or" : "vert")}>
                    <svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 3 2 5 2 7h10c0-2 2-4 2-7a7 7 0 0 0-7-7z" {...I} /><path d="M9 22h6" {...I} /></svg>
                  </div>
                  <div><h3 className="coach-title">Fraîcheur de votre fiche</h3><p className="coach-sub">Google favorise les fiches actives</p></div>
                </div>
                {!freshness ? (
                  <p className="coach-msg">Renseignez votre nombre d'avis pour suivre la fraîcheur de votre fiche.</p>
                ) : freshness.days > 21 ? (
                  <p className="coach-msg coach-msg-alert">
                    Votre dernière mise à jour d'avis date de <b>{freshness.days} jours</b>. Une fiche qui bouge peu recule dans Google. Sollicitez quelques avis cette semaine pour la relancer.
                  </p>
                ) : (
                  <p className="coach-msg coach-msg-ok">
                    ✓ Votre fiche est fraîche — mise à jour il y a {freshness.days} jour{freshness.days > 1 ? "s" : ""}. C'est exactement ce que Google valorise.
                  </p>
                )}
              </div>

            </div>
          </>
        )}

        {/* ===== PERFORMANCE + ACTIVITÉ ===== */}
        <div className="section-head reveal">
          <h2 className="section-title">Vos performances</h2>
        </div>

        <div className="grid cols-2">
          <div className="card reveal" id="conversion">
            <div className="card-head">
              <div><h2 className="card-title">Performance de votre carte</h2><p className="card-hint">Combien de vos scans deviennent des avis</p></div>
              <span className="tag">Conversion</span>
            </div>
            {rev ? (
              <div className="donut-row">
                <div className="donut" style={{ "--pct": conversion ?? 0 }}>
                  <div className="donut-in">
                    <div className="donut-n">{conversion != null ? `${conversion}%` : "—"}</div>
                    <div className="donut-l">de vos scans<br />deviennent des avis</div>
                  </div>
                </div>
                <div className="donut-side">
                  <div className="metric"><div className="metric-icon"><svg viewBox="0 0 24 24"><path d="M3 12h3l2-6 4 12 3-9 2 3h4" {...I} /></svg></div><div><div className="metric-n">{scansSince}</div><div className="metric-l">Scans suivis</div></div></div>
                  <div className="metric"><div className="metric-icon vert"><svg viewBox="0 0 24 24"><path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 17l-5.3 2.7 1.1-5.9-4.3-4.1 5.9-.8z" {...I} /></svg></div><div><div className="metric-n">+{generated}</div><div className="metric-l">Avis générés</div></div></div>
                  <div className="metric"><div className="metric-icon or"><svg viewBox="0 0 24 24"><path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 17l-5.3 2.7 1.1-5.9-4.3-4.1 5.9-.8z" {...I} /></svg></div><div><div className="metric-n">{rev.current}</div><div className="metric-l">Avis Google au total</div></div></div>
                </div>
              </div>
            ) : (
              <p className="empty-state">Renseignez votre nombre d'avis Google actuel ci-dessous pour activer le suivi de conversion.</p>
            )}
            <ReviewUpdate current={rev ? rev.current : ""} />
          </div>

          <div className="card reveal" id="activite">
            <div className="card-head"><div><h2 className="card-title">Activité</h2><p className="card-hint">Vos scans dans le temps</p></div></div>
            <Activity data={history} />
          </div>
        </div>

        {/* ===== OUTILS IA ===== */}
        <div className="section-head reveal">
          <h2 className="section-title">Vos outils</h2>
          <p className="section-sub">L'assistant qui vous fait gagner du temps.</p>
        </div>

        <div className="card reveal" id="analyse">
          <div className="card-head"><div><h2 className="card-title">Analyse &amp; Insights</h2><p className="card-hint">Les thèmes qui reviennent et vos axes d'amélioration</p></div><span className="tag">Assistant IA</span></div>
          <Analyzer businessName={c.name} />
        </div>

        <div className="card reveal" id="plan">
          <div className="card-head"><div><h2 className="card-title">Plan d'action</h2><p className="card-hint">Vos priorités concrètes, basées sur vos avis et vos chiffres</p></div><span className="tag">Assistant IA</span></div>
          <Plan initialPlan={plan} />
        </div>

        <div className="card reveal" id="repondre">
          <div className="card-head"><div><h2 className="card-title">Répondre à un avis</h2><p className="card-hint">Collez l'avis reçu, validez la réponse proposée.</p></div><span className="tag">Assistant IA</span></div>
          <Responder businessName={c.name} defaultTone={c.tone || ""} />
        </div>

        <div className="card reveal" id="visuel">
          <div className="card-head"><div><h2 className="card-title">Créer un visuel à partir d'un avis</h2><p className="card-hint">Une image prête à poster (Insta, Facebook, story) + les légendes</p></div><span className="tag">Studio</span></div>
          <PostVisual businessName={c.name} logoUrl={c.logoUrl} />
        </div>

      </div>
    </Shell>
  );
}

function weeksSince(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  if (isNaN(d.getTime())) return 4;
  const w = (Date.now() - d.getTime()) / (7 * 86400000);
  return Math.max(1, Math.round(w));
}
