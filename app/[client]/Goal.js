"use client";
import { useState } from "react";

export default function Goal({ initialTarget, current, weeklyRate }) {
  const [target, setTarget] = useState(initialTarget || null);
  const [editing, setEditing] = useState(!initialTarget);
  const [val, setVal] = useState(initialTarget ? String(initialTarget) : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    const n = Math.max(0, Math.floor(Number(val) || 0));
    if (n <= (current || 0)) {
      setError(`Choisissez un objectif supérieur à votre nombre d'avis actuel (${current || 0}).`);
      return;
    }
    setLoading(true); setError("");
    try {
      const client = decodeURIComponent(window.location.pathname.split("/").filter(Boolean)[0] || "");
      const res = await fetch("/api/goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client, target: n }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Erreur");
      setTarget(n); setEditing(false);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }

  if (editing) {
    return (
      <div>
        <label className="label">Votre objectif d'avis Google</label>
        <div className="row2" style={{ marginTop: 0 }}>
          <input className="input" type="number" min={(current || 0) + 1} value={val}
            onChange={(e) => setVal(e.target.value)} placeholder="Ex : 100"
            style={{ flex: 2, minWidth: 140 }} />
          <button className="btn btn-primary" onClick={save} disabled={loading || val === ""}
            style={{ flex: 1, minWidth: 120 }}>
            {loading ? "…" : "Définir"}
          </button>
        </div>
        {error && <p className="err">{error}</p>}
        {initialTarget && (
          <button className="pill" style={{ marginTop: 10, cursor: "pointer", border: 0 }}
            onClick={() => { setEditing(false); setError(""); }}>Annuler</button>
        )}
      </div>
    );
  }

  const cur = current || 0;
  const pct = Math.min(100, Math.round((cur / target) * 100));
  const remaining = Math.max(0, target - cur);
  const reached = remaining === 0;

  // estimation de l'échéance
  let eta = null;
  if (!reached && weeklyRate > 0) {
    const weeks = Math.ceil(remaining / weeklyRate);
    const d = new Date(); d.setDate(d.getDate() + weeks * 7);
    eta = d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  }

  return (
    <div>
      <div className="goal-top">
        <div>
          <span className="goal-current">{cur}</span>
          <span className="goal-target"> / {target} avis</span>
        </div>
        <span className="goal-pct">{pct}%</span>
      </div>
      <div className="goal-bar"><div className="goal-fill" style={{ width: `${pct}%` }} /></div>
      {reached ? (
        <p className="goal-msg goal-done">🎉 Objectif atteint, bravo ! Fixez-en un nouveau pour continuer.</p>
      ) : (
        <p className="goal-msg">
          Il vous manque <b>{remaining} avis</b>.
          {eta ? <> À votre rythme actuel, vous y serez vers le <b>{eta}</b>.</>
               : <> Collectez quelques avis pour voir une estimation de date.</>}
        </p>
      )}
      <button className="pill" style={{ marginTop: 12, cursor: "pointer", border: 0 }}
        onClick={() => { setVal(String(target)); setEditing(true); }}>
        Modifier l'objectif
      </button>
    </div>
  );
}
