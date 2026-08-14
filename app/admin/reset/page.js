"use client";
import { useState } from "react";

export default function ResetScans() {
  const [password, setPassword] = useState("");
  const [client, setClient] = useState("");
  const [done, setDone] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function reset() {
    if (!window.confirm(`Remettre à zéro les scans de « ${client} » ? Cette action est irréversible.`)) return;
    setLoading(true); setError(""); setDone(null);
    try {
      const res = await fetch("/api/admin/reset-scans", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, client: client.trim() }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.detail ? `${j.error} (${j.detail})` : (j.error || "Erreur"));
      setDone(j.name || client);
      setClient("");
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }

  return (
    <>
      <div className="hero"><div className="hero-inner">
        <div className="eyebrow"><span className="dot"></span>BoostRepu · Admin</div>
        <h1 className="hero-title">Réinitialiser les scans</h1>
        <p className="hero-sub">Remet le compteur d'un client à zéro (total + historique). Idéal après une phase de test.</p>
      </div></div>
      <div className="container pull-up">
        <div className="card reveal" style={{ maxWidth: 480, margin: "0 auto" }}>
          <div className="field">
            <label className="label">Mot de passe admin</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="field">
            <label className="label">Identifiant du client</label>
            <input className="input" value={client} onChange={(e) => setClient(e.target.value)} placeholder="Ex : marie-ergo (tel qu'il apparaît dans l'adresse)" />
            <p className="footnote">C'est la partie après le domaine dans l'adresse du tableau de bord (…vercel.app/<b>marie-ergo</b>).</p>
          </div>
          <button className="btn btn-primary btn-block" onClick={reset} disabled={loading || !password || !client.trim()}>
            {loading ? "Réinitialisation…" : "Remettre les scans à zéro"}
          </button>
          {error && <p className="err">{error}</p>}
          {done && (
            <div className="focus-box" style={{ marginTop: 14 }}>
              ✓ Les scans de <b>{done}</b> ont été remis à zéro.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
