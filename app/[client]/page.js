import { getClient, getTaps, getDailyTaps } from "@/lib/db";
import Responder from "./Responder";

export const dynamic = "force-dynamic";

export default async function Dashboard({ params, searchParams }) {
  const { client } = await params;
  const sp = await searchParams;
  const c = await getClient(client);

  if (!c) {
    return (
      <main className="wrap">
        <h1>Tableau de bord introuvable</h1>
        <p className="sub">Aucun établissement ne correspond à « {client} ».</p>
      </main>
    );
  }

  // Protection par code PIN (optionnelle, définie à la création du client)
  if (c.pin && sp?.pin !== c.pin) {
    return (
      <main className="wrap">
        <h1>Accès protégé</h1>
        <p className="sub">Ajoute ton code à la fin de l'adresse : <span className="mono">?pin=TON_CODE</span></p>
      </main>
    );
  }

  const taps = await getTaps(client);
  const daily = await getDailyTaps(client, 14);
  const max = Math.max(1, ...daily.map((d) => d.value));

  return (
    <main className="wrap">
      <span className="pill">Tableau de bord</span>
      <h1 style={{ marginTop: 8 }}>{c.name}</h1>
      <p className="sub">Suivi de vos avis Google en temps réel.</p>

      <div className="card">
        <div className="stat">
          <span className="big">{taps}</span>
          <span className="lbl">scans de la carte au total</span>
        </div>
        <h2>14 derniers jours</h2>
        <div className="bars">
          {daily.map((d) => (
            <div key={d.label} className="b" style={{ height: `${(d.value / max) * 100}%` }}>
              <span>{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Répondre à un avis (assistant IA)</h2>
        <p className="footnote">Collez l'avis reçu, l'assistant vous propose une réponse à valider.</p>
        <Responder businessName={c.name} defaultTone={c.tone || ""} />
      </div>
    </main>
  );
}
