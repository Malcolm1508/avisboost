import { cookies } from "next/headers";
import { getClient, getTaps, getDailyTaps, getReviews, getPlan, getDailyRange } from "@/lib/db";
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

export const dynamic = "force-dynamic";

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

  const taps = await getTaps(client);
  const daily = await getDailyTaps(client, 14);
  const week = daily.slice(-7).reduce((s, d) => s + d.value, 0);
  const today = daily.length ? daily[daily.length - 1].value : 0;

  const rev = await getReviews(client);
  const plan = await getPlan(client);
  const history = await getDailyRange(client, 365);

  let generated = 0, scansSince = 0, conversion = null;
  if (rev) {
    generated = Math.max(0, rev.current - rev.base);
    scansSince = Math.max(0, taps - rev.tapsAtBase);
    conversion = scansSince > 0 ? Math.min(100, Math.round((generated / scansSince) * 100)) : null;
  }

  const I = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

  return (
    <Shell clientId={client} name={c.name} address={c.address} logoUrl={c.logoUrl} isDemo={client === "demo"}>
      <div className="container pull-up">

        {/* Bandeau des 3 indicateurs */}
        <div className="stat-strip reveal" id="tableau">
          <div className="strip-item">
            <div className="strip-icon violet">
              <svg viewBox="0 0 24 24"><path d="M3 12h3l2-6 4 12 3-9 2 3h4" {...I} /></svg>
            </div>
            <div>
              <div className="strip-n"><CountUp value={taps} /></div>
              <div className="strip-l">Scans de votre carte</div>
            </div>
          </div>
          <div className="strip-item">
            <div className="strip-icon vert">
              <svg viewBox="0 0 24 24"><path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 17l-5.3 2.7 1.1-5.9-4.3-4.1 5.9-.8z" {...I} /></svg>
            </div>
            <div>
              <div className="strip-n">{rev ? `+${generated}` : "—"}</div>
              <div className="strip-l">Avis générés</div>
            </div>
          </div>
          <div className="strip-item">
            <div className="strip-icon or">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...I} /><path d="M12 7v5l3.5 2" {...I} /></svg>
            </div>
            <div>
              <div className="strip-n">{conversion != null ? `${conversion}%` : "—"}</div>
              <div className="strip-l">Taux de conversion</div>
            </div>
          </div>
        </div>

        {/* Compteur principal */}
        <div className="card stat-card reveal">
          <div className="stat-top">
            <span className="stat-num"><CountUp value={taps} /></span>
            <span className="stat-label">scans de votre carte au total</span>
          </div>
          <div className="stat-chips">
            <div className="chip gold"><span className="n">{today}</span><span className="l">aujourd'hui</span></div>
            <div className="chip"><span className="n">{week}</span><span className="l">7 derniers jours</span></div>
          </div>
          {taps === 0 && (
            <p className="footnote">
              Votre carte est prête. Posez-la à côté de votre caisse : les premiers scans apparaîtront ici.
            </p>
          )}
        </div>

        <div className="grid cols-2">

          {/* Conversion */}
          <div className="card reveal" id="conversion">
            <div className="card-head">
              <div>
                <h2 className="card-title">Performance de votre carte</h2>
                <p className="card-hint">Combien de vos scans se transforment en avis</p>
              </div>
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
                  <div className="metric">
                    <div className="metric-icon"><svg viewBox="0 0 24 24"><path d="M3 12h3l2-6 4 12 3-9 2 3h4" {...I} /></svg></div>
                    <div><div className="metric-n">{scansSince}</div><div className="metric-l">Scans suivis</div></div>
                  </div>
                  <div className="metric">
                    <div className="metric-icon vert"><svg viewBox="0 0 24 24"><path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 17l-5.3 2.7 1.1-5.9-4.3-4.1 5.9-.8z" {...I} /></svg></div>
                    <div><div className="metric-n">+{generated}</div><div className="metric-l">Avis générés</div></div>
                  </div>
                  <div className="metric">
                    <div className="metric-icon or"><svg viewBox="0 0 24 24"><path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 17l-5.3 2.7 1.1-5.9-4.3-4.1 5.9-.8z" {...I} /></svg></div>
                    <div><div className="metric-n">{rev.current}</div><div className="metric-l">Avis Google au total</div></div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="empty-state">
                Renseignez votre nombre d'avis Google actuel ci-dessous pour activer le suivi de conversion.
              </p>
            )}

            <ReviewUpdate current={rev ? rev.current : ""} />
          </div>

          {/* Activité */}
          <div className="card reveal" id="activite">
            <div className="card-head">
              <div>
                <h2 className="card-title">Activité</h2>
                <p className="card-hint">Vos scans dans le temps</p>
              </div>
            </div>
            <Activity data={history} />
          </div>
        </div>

        {/* Analyse */}
        <div className="card reveal" id="analyse">
          <div className="card-head">
            <div>
              <h2 className="card-title">Analyse &amp; Insights</h2>
              <p className="card-hint">Les thèmes qui reviennent et vos axes d'amélioration</p>
            </div>
            <span className="tag">Assistant IA</span>
          </div>
          <Analyzer businessName={c.name} />
        </div>

        {/* Plan */}
        <div className="card reveal" id="plan">
          <div className="card-head">
            <div>
              <h2 className="card-title">Plan d'action</h2>
              <p className="card-hint">Vos priorités concrètes, basées sur vos avis et vos chiffres</p>
            </div>
            <span className="tag">Assistant IA</span>
          </div>
          <Plan initialPlan={plan} />
        </div>

        {/* Réponses */}
        <div className="card reveal" id="repondre">
          <div className="card-head">
            <div>
              <h2 className="card-title">Répondre à un avis</h2>
              <p className="card-hint">Collez l'avis reçu, validez la réponse proposée.</p>
            </div>
            <span className="tag">Assistant IA</span>
          </div>
          <Responder businessName={c.name} defaultTone={c.tone || ""} />
        </div>

        {/* Studio */}
        <div className="card reveal" id="visuel">
          <div className="card-head">
            <div>
              <h2 className="card-title">Créer un visuel à partir d'un avis</h2>
              <p className="card-hint">Une image prête à poster (Insta, Facebook, story) + les légendes</p>
            </div>
            <span className="tag">Studio</span>
          </div>
          <PostVisual businessName={c.name} logoUrl={c.logoUrl} />
        </div>

      </div>
    </Shell>
  );
}
