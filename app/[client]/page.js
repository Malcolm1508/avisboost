import { getClient, getTaps, getDailyTaps } from "@/lib/db";
import Responder from "./Responder";

export const dynamic = "force-dynamic";

export default async function Dashboard({ params, searchParams }) {
  const { client } = await params;
  const sp = await searchParams;
  const c = await getClient(client);

  if (!c) {
    return (
      <>
        <div className="hero"><div className="hero-inner">
          <div className="eyebrow"><span className="dot"></span>AvisBoost</div>
          <h1 className="hero-title">Tableau de bord introuvable</h1>
          <p className="hero-sub">Aucun établissement ne correspond à « {client} ».</p>
        </div></div>
      </>
    );
  }

  if (c.pin && sp?.pin !== c.pin) {
    return (
      <>
        <div className="hero"><div className="hero-inner">
          <div className="eyebrow"><span className="dot"></span>AvisBoost</div>
          <h1 className="hero-title">Accès protégé</h1>
          <p className="hero-sub">Ajoutez votre code à la fin de l'adresse : ?pin=VOTRE_CODE</p>
        </div></div>
      </>
    );
  }

  const taps = await getTaps(client);
  const daily = await getDailyTaps(client, 14);
  const max = Math.max(1, ...daily.map((d) => d.value));
  const week = daily.slice(-7).reduce((s, d) => s + d.value, 0);
  const today = daily.length ? daily[daily.length - 1].value : 0;

  return (
    <>
      <div className="hero">
        <div className="hero-inner">
          <div className="eyebrow"><span className="dot"></span>AvisBoost · Tableau de bord</div>
          <h1 className="hero-title">{c.name}</h1>
          <p className="hero-sub">Le suivi de vos avis Google, en direct — et un assistant pour répondre en quelques secondes.</p>
        </div>
      </div>

      <div className="container pull-up">
        <div className="card stat-card">
          <div className="stat-top">
            <span className="stat-num">{taps}</span>
            <span className="stat-label">scans de votre carte au total</span>
          </div>
          <div className="stat-chips">
            <div className="chip gold">
              <span className="n">{today}</span>
              <span className="l">aujourd'hui</span>
            </div>
            <div className="chip">
              <span className="n">{week}</span>
              <span className="l">7 derniers jours</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h2 className="card-title">Activité</h2>
              <p className="card-hint">Scans par jour sur les 14 derniers jours</p>
            </div>
            <span className="tag">14 j</span>
          </div>
          <div className="chart">
            <div className="chart-bars">
              {daily.map((d, i) => (
                <div key={d.label} className={"bar" + (i === daily.length - 1 ? " today" : "")}>
                  <span className="bar-val">{d.value}</span>
                  <div className="bar-fill" style={{ height: `${(d.value / max) * 100}%`, animationDelay: `${i * 35}ms` }}></div>
                  <span className="bar-label">{d.label}</span>
                </div>
              ))}
            </div>
            <p className="chart-foot">Chaque scan correspond à un client dirigé vers votre page d'avis Google.</p>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h2 className="card-title">Répondre à un avis</h2>
              <p className="card-hint">Collez l'avis reçu, validez la réponse proposée.</p>
            </div>
            <span className="tag">Assistant IA</span>
          </div>
          <Responder businessName={c.name} defaultTone={c.tone || ""} />
        </div>
      </div>
    </>
  );
}
