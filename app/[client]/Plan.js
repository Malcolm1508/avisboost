"use client";
import { useState } from "react";

export default function Plan() {
  const [reviews, setReviews] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true); setError(""); setData(null);
    try {
      const client = decodeURIComponent(window.location.pathname.split("/").filter(Boolean)[0] || "");
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client, reviews }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.detail ? `${j.error} (${j.detail})` : (j.error || "Erreur"));
      setData(j.plan);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const dot = (n) => (["rouge", "orange", "vert"].includes(n) ? n : "orange");

  return (
    <div>
      <div className="field">
        <label className="label">Vos avis récents (facultatif mais conseillé)</label>
        <textarea
          className="textarea"
          value={reviews}
          onChange={(e) => setReviews(e.target.value)}
          placeholder="Collez quelques avis récents pour un plan plus précis…"
        />
        <p className="footnote">Le plan tient déjà compte de vos scans et de votre taux de conversion. Ajoutez des avis pour l'affiner.</p>
      </div>

      <button className="btn btn-primary btn-block btn-icon" onClick={generate} disabled={loading}>
        {loading ? "Génération…" : (
          <>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            Générer mon plan d'action
          </>
        )}
      </button>

      {error && <p className="err">{error}</p>}

      {data && (
        <div className="analysis">
          {data.focus && (
            <div className="focus-box"><b>Priorité n°1 :</b> {data.focus}</div>
          )}

          {data.semaine && data.semaine.length > 0 && (
            <div className="asec">
              <div className="asec-head"><span className="adot axe"></span>Cette semaine</div>
              {data.semaine.map((a, i) => (
                <div className="prio" key={i}>
                  <span className={"prio-dot " + dot(a.niveau)}></span>
                  <div className="prio-main">
                    <div className="prio-action">{a.action}</div>
                    {a.pourquoi && <div className="prio-why">{a.pourquoi}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {data.mois && data.mois.length > 0 && (
            <div className="asec">
              <div className="asec-head"><span className="adot pos"></span>Ce mois-ci</div>
              <ul className="axes">
                {data.mois.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
