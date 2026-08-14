"use client";
import { useState } from "react";

export default function AdminDemo() {
  const [password, setPassword] = useState("");
  const [demoPassword, setDemoPassword] = useState("demo2026");
  const [res, setRes] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function seed() {
    if (!window.confirm("Regénérer le compte de démonstration ? Les données actuelles du compte « demo » seront écrasées.")) return;
    setLoading(true); setError(""); setRes(null);
    try {
      const r = await fetch("/api/admin/seed-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, demoPassword }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.detail ? `${j.error} (${j.detail})` : (j.error || "Erreur"));
      setRes(j);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }

  return (
    <>
      <div className="hero"><div className="hero-inner">
        <div className="eyebrow"><span className="dot"></span>BoostRepu · Admin</div>
        <h1 className="hero-title">Compte de démonstration</h1>
        <p className="hero-sub">Génère 90 jours d'historique réaliste pour tes démos en boutique.</p>
      </div></div>

      <div className="container pull-up">
        <div className="card reveal" style={{ maxWidth: 480, margin: "0 auto" }}>
          <div className="field">
            <label className="label">Mot de passe admin</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="field">
            <label className="label">Mot de passe du compte démo</label>
            <input className="input" value={demoPassword} onChange={(e) => setDemoPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-block" onClick={seed} disabled={loading || !password}>
            {loading ? "Génération…" : "Générer la démo"}
          </button>
          {error && <p className="err">{error}</p>}

          {res && (
            <div className="focus-box" style={{ marginTop: 14 }}>
              ✓ <b>{res.name}</b><br />
              {res.totalScans} scans · {res.reviews} avis · {res.conversion} de conversion
              <p className="footnote" style={{ marginBottom: 0 }}>
                Accès : <b>/{res.id}</b> — mot de passe <b>{res.pw}</b>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
