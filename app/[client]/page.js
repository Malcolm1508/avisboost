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

  // --- données
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

  // --- features coaching
  const weekConv = week > 0 && rev ? Math.round((Math.max(0, generated) / week) * 100) : null;

  let daysSinceScan = null;
  if (lastActiveDate) {
    const diff = Math.floor((Date.now() - new Date(lastActiveDate + "T12:00:00").getTime()) / 86400000);
    daysSinceScan = Math.max(0, diff);
  }
  const dormant = taps > 0 && daysSinceScan != null && daysSinceScan >= 7;

  let weeklyReviewRate = 0;
  if (rev && generated > 0 && rev.updatedAt) {
    weeklyReviewRate = Math.max(0.5, generated / Math.max(1, weeksSince(rev.updatedAt)));
  } else if (generated > 0) {
    weeklyReviewRate = Math.max(0.5, generated / 4);
  }

  let freshness = null;
  if (rev && rev.updatedAt) {
    const dReview = Math.floor((Date.now() - new Date(rev.updatedAt + "T12:00:00").getTime()) / 86400000);
    freshness = { days: Math.max(0, dReview) };
  }

  const weekDelta = prevWeek > 0 ? Math.round(((week - prevWeek) / prevWeek) * 100) : null;

  // ============================================================
  //  ONGLET 1 — VUE D'ENSEMBLE
  // ============================================================
  const overview = (
    <>
      {/* Hero stat */}
      <div className="dcard hero-stat">
        <div className="hero-stat-main">
          <div className="hero-stat-num"><CountUp value={taps} /></div>
          <div className="hero-stat-label">scans de votre carte au total</div>
        </div>
        <div className="hero-stat-chips">
          <div className="hchip">
            <span className="hchip-n">{week}</span>
            <span className="hchip-l">7 derniers jours</span>
            {weekDelta != null && <span className={"hchip-d " + (weekDelta >= 0 ? "up" : "down")}>{weekDelta >= 0 ? "▲" : "▼"} {Math.abs(weekDelta)}%</span>}
          </div>
          <div className="hchip"><span className="hchip-n">{today}</span><span className="hchip-l">aujourd'hui</span></div>
        </div>
        {taps === 0 && <p className="dnote">Votre carte est prête. Posez-la à côté de votre caisse : les premiers scans apparaîtront ici.</p>}
      </div>

      {/* 3 KPIs */}
      <div className="kgrid">
        <div className="dcard kpi2">
          <div className="kpi2-ic vert"><svg viewBox="0 0 24 24"><path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 17l-5.3 2.7 1.1-5.9-4.3-4.1 5.9-.8z" {...I} /></svg></div>
          <div><div className="kpi2-n">{rev ? `+${generated}` : "—"}</div><div className="kpi2-l">Avis générés</div></div>
        </div>
        <div className="dcard kpi2">
          <div className="kpi2-ic blue"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...I} /><path d="M12 7v5l3.5 2" {...I} /></svg></div>
          <div><div className="kpi2-n">{conversion != null ? `${conversion}%` : "—"}</div><div className="kpi2-l">Conversion</div></div>
        </div>
        <div className="dcard kpi2">
          <div className="kpi2-ic or"><svg viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M2 12h4M18 12h4" {...I} /><circle cx="12" cy="12" r="4" {...I} /></svg></div>
          <div><div className="kpi2-n">{rev ? rev.current : "—"}</div><div className="kpi2-l">Avis Google</div></div>
        </div>
      </div>

      {/* Conversion + Activité */}
      <div className="dcard" id="conversion">
        <div className="dcard-head">
          <div><h2 className="dcard-title">Performance de votre carte</h2><p className="dcard-hint">Combien de vos scans deviennent des avis</p></div>
          <span className="dtag">Conversion</span>
        </div>
        {rev ? (
          <div className="donut-row">
            <div className="donut" style={{ "--pct": conversion ?? 0 }}>
              <div className="donut-in"><div className="donut-n">{conversion != null ? `${conversion}%` : "—"}</div><div className="donut-l">de vos scans<br />deviennent des avis</div></div>
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

      <div className="dcard" id="activite">
        <div className="dcard-head"><div><h2 className="dcard-title">Activité</h2><p className="dcard-hint">Vos scans dans le temps</p></div></div>
        <Activity data={history} />
      </div>
    </>
  );

  // ============================================================
  //  ONGLET 2 — AVIS & RÉPONSES
  // ============================================================
  const reviews = (
    <>
      <div className="dcard">
        <div className="dcard-head"><div><h2 className="dcard-title">Analyse &amp; Insights</h2><p className="dcard-hint">Les thèmes qui reviennent et vos axes d'amélioration</p></div><span className="dtag">Assistant IA</span></div>
        <Analyzer businessName={c.name} />
      </div>
      <div className="dcard">
        <div className="dcard-head"><div><h2 className="dcard-title">Répondre à un avis</h2><p className="dcard-hint">Collez l'avis reçu, validez la réponse proposée</p></div><span className="dtag">Assistant IA</span></div>
        <Responder businessName={c.name} defaultTone={c.tone || ""} />
      </div>
      <div className="dcard">
        <div className="dcard-head"><div><h2 className="dcard-title">Plan d'action</h2><p className="dcard-hint">Vos priorités concrètes de la semaine</p></div><span className="dtag">Assistant IA</span></div>
        <Plan initialPlan={plan} />
      </div>
    </>
  );

  // ============================================================
  //  ONGLET 3 — STUDIO
  // ============================================================
  const studio = (
    <div className="dcard">
      <div className="dcard-head"><div><h2 className="dcard-title">Studio visuel</h2><p className="dcard-hint">Transformez un avis en image prête à poster</p></div><span className="dtag">Studio</span></div>
      <PostVisual businessName={c.name} logoUrl={c.logoUrl} />
    </div>
  );

  // ============================================================
  //  ONGLET 4 — COACHING
  // ============================================================
  const showEmpty = taps === 0 && !(rev && rev.current > 0);
  const coaching = (
    <>
      <div className="dsection">
        <h2 className="dsection-title">Votre coaching réputation</h2>
        <p className="dsection-sub">Ce que vos chiffres vous disent, et quoi faire cette semaine.</p>
      </div>

      {showEmpty && (
        <div className="dcard"><p className="empty-state">Vos conseils personnalisés apparaîtront ici dès les premiers scans et la saisie de votre nombre d'avis.</p></div>
      )}

      <div className="cgrid">
        {/* Objectif */}
        <div className="dcard coach">
          <div className="coach-head">
            <div className="coach-ic violet"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...I} /><circle cx="12" cy="12" r="4" {...I} /><path d="M12 2v3M12 19v3" {...I} /></svg></div>
            <div><h3 className="coach-title">Objectif d'avis</h3><p className="coach-sub">Fixez un cap, suivez la progression</p></div>
          </div>
          <Goal initialTarget={goal} current={rev ? rev.current : 0} weeklyRate={weeklyReviewRate} />
        </div>

        {/* Carte qui dort */}
        <div className={"dcard coach" + (dormant ? " coach-alert" : "")}>
          <div className="coach-head">
            <div className={"coach-ic " + (dormant ? "red" : "vert")}><svg viewBox="0 0 24 24"><path d="M3 12h3l2-6 4 12 3-9 2 3h4" {...I} /></svg></div>
            <div><h3 className="coach-title">État de votre carte</h3><p className="coach-sub">Est-elle encore active ?</p></div>
          </div>
          {daysSinceScan == null ? (
            <p className="coach-msg">Aucun scan encore enregistré. Posez la carte bien en vue sur votre comptoir.</p>
          ) : dormant ? (
            <p className="coach-msg coach-msg-alert">⚠️ Votre carte n'a pas été scannée depuis <b>{daysSinceScan} jours</b>. Elle est peut-être mal placée ou cachée. Remettez-la à côté de la caisse.</p>
          ) : (
            <p className="coach-msg coach-msg-ok">✓ Votre carte est active — dernier scan il y a {daysSinceScan === 0 ? "moins d'un jour" : `${daysSinceScan} jour${daysSinceScan > 1 ? "s" : ""}`}. Continuez comme ça.</p>
          )}
        </div>

        {/* Rappel de la semaine */}
        <div className="dcard coach">
          <div className="coach-head">
            <div className="coach-ic blue"><svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" {...I} /><path d="M13.7 21a2 2 0 0 1-3.4 0" {...I} /></svg></div>
            <div><h3 className="coach-title">Rappel de la semaine</h3><p className="coach-sub">Vos scans transformés en avis</p></div>
          </div>
          {week === 0 ? (
            <p className="coach-msg">Pas encore de scan cette semaine. Un petit mot à vos clients au moment de payer fait toute la différence.</p>
          ) : weekConv != null && weekConv < 30 ? (
            <p className="coach-msg">Cette semaine : <b>{week} scans</b> mais peu d'avis en face. Pensez à encourager vos clients — « ça nous aide beaucoup » — pendant qu'ils ont le téléphone en main.</p>
          ) : (
            <p className="coach-msg coach-msg-ok">Belle semaine : <b>{week} scans</b>. Vos clients jouent le jeu, continuez.</p>
          )}
        </div>

        {/* Fraîcheur */}
        <div className="dcard coach">
          <div className="coach-head">
            <div className={"coach-ic " + (freshness && freshness.days > 21 ? "or" : "vert")}><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 3 2 5 2 7h10c0-2 2-4 2-7a7 7 0 0 0-7-7z" {...I} /><path d="M9 22h6" {...I} /></svg></div>
            <div><h3 className="coach-title">Fraîcheur de votre fiche</h3><p className="coach-sub">Google favorise les fiches actives</p></div>
          </div>
          {!freshness ? (
            <p className="coach-msg">Renseignez votre nombre d'avis pour suivre la fraîcheur de votre fiche.</p>
          ) : freshness.days > 21 ? (
            <p className="coach-msg coach-msg-alert">Votre dernière mise à jour date de <b>{freshness.days} jours</b>. Une fiche qui bouge peu recule dans Google. Sollicitez quelques avis cette semaine.</p>
          ) : (
            <p className="coach-msg coach-msg-ok">✓ Votre fiche est fraîche — mise à jour il y a {freshness.days} jour{freshness.days > 1 ? "s" : ""}. C'est ce que Google valorise.</p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <Shell
      clientId={client} name={c.name} address={c.address} logoUrl={c.logoUrl} isDemo={client === "demo"}
      tabs={{ overview, reviews, studio, coaching }}
    />
  );
}

function weeksSince(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  if (isNaN(d.getTime())) return 4;
  const w = (Date.now() - d.getTime()) / (7 * 86400000);
  return Math.max(1, Math.round(w));
}
