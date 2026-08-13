"use client";
import { useState } from "react";

export default function Plan({ initialPlan }) {
  const [reviews, setReviews] = useState("");
  const [plan, setPlan] = useState(initialPlan || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showGen, setShowGen] = useState(!initialPlan);

  function clientId() {
    return decodeURIComponent(window.location.pathname.split("/").filter(Boolean)[0] || "");
  }

  async function generate() {
    if (plan && !window.confirm("Générer un nouveau plan remplacera le plan actuel et sa progression. Continuer ?")) return;
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/plan/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client: clientId(), reviews }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.detail ? `${j.error} (${j.detail})` : (j.error || "Erreur"));
      setPlan(j.plan); setShowGen(false); setReviews("");
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }

  async function toggle(type, index) {
    setPlan((prev) => {
      const p = JSON.parse(JSON.stringify(prev));
      p[type][index].done = !p[type][index].done;
      return p;
    });
    try {
      await fetch("/api/plan/toggle", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client: clientId(), type, index }),
      });
    } catch (e) { /* resync au prochain chargement */ }
  }

  const total = plan ? (plan.semaine.length + plan.mois.length) : 0;
  const done = plan ? (plan.semaine.filter((x) => x.done).length + plan.mois.filter((x) => x.done).length) : 0;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const dotClass = (n) => (["rouge", "orange", "vert"].includes(n) ? n : "orange");

  return (
    <div>
      {plan && (
        <>
          <div className="progress-row">
            <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }}></div></div>
            <span className="progress-label">{done}/{total} fait</span>
          </div>

          {plan.focus && <div className="focus-box" style={{ marginTop: 14 }}><b>Priorité n°1 :</b> {plan.focus}</div>}

          {plan.semaine.length > 0 && (
            <div className="asec" style={{ marginTop: 18 }}>
              <div className="asec-head"><span className="adot axe"></span>Cette semaine</div>
              {plan.semaine.map((a, i) => (
                <button type="button" className={"task" + (a.done ? " done" : "")} key={i} onClick={() => toggle("semaine", i)}>
                  <span className="check">{a.done ? "✓" : ""}</span>
                  <span className={"prio-dot " + dotClass(a.niveau)} style={{ marginTop: 8 }}></span>
                  <span className="task-main">
                    <span className="task-action">{a.action}</span>
                    {a.pourquoi && <span className="task-why">{a.pourquoi}</span>}
                  </span>
                </button>
              ))}
            </div>
          )}

          {plan.mois.length > 0 && (
            <div className="asec" style={{ marginTop: 14 }}>
              <div className="asec-head"><span className="adot pos"></span>Ce mois-ci</div>
              {plan.mois.map((m, i) => (
                <button type="button" className={"task" + (m.done ? " done" : "")} key={i} onClick={() => toggle("mois", i)}>
                  <span className="check">{m.done ? "✓" : ""}</span>
                  <span className="task-main"><span className="task-action">{m.text}</span></span>
                </button>
              ))}
            </div>
          )}

          <button className="btn btn-ghost btn-block" style={{ marginTop: 16 }} onClick={() => setShowGen((v) => !v)}>
            {showGen ? "Annuler" : "Générer un nouveau plan"}
          </button>
        </>
      )}

      {showGen && (
        <div style={{ marginTop: plan ? 14 : 0 }}>
          <div className="field">
            <label className="label">Vos avis récents (facultatif mais conseillé)</label>
            <textarea className="textarea" value={reviews} onChange={(e) => setReviews(e.target.value)}
              placeholder="Collez quelques avis récents pour un plan plus précis…" />
            <p className="footnote">Le plan tient déjà compte de vos scans et de votre taux de conversion.</p>
          </div>
          <button className="btn btn-primary btn-block btn-icon" onClick={generate} disabled={loading}>
            {loading ? "Génération…" : (
              <>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                {plan ? "Remplacer le plan" : "Générer mon plan d'action"}
              </>
            )}
          </button>
        </div>
      )}

      {error && <p className="err">{error}</p>}
    </div>
  );
}
