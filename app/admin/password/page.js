"use client";
import { useState } from "react";

export default function AdminPassword() {
  const [password, setPassword] = useState("");
  const [client, setClient] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [done, setDone] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function change() {
    setLoading(true); setError(""); setDone(null);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, client: client.trim(), newPassword }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.detail ? `${j.error} (${j.detail})` : (j.error || "Erreur"));
      setDone({ name: j.name, pw: newPassword });
      setClient(""); setNewPassword("");
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }

  return (
    <>
      <div className="hero"><div className="hero-inner">
        <div className="eyebrow"><span className="dot"></span>BoostRepu · Admin</div>
        <h1 className="hero-title">Mot de passe client</h1>
        <p className="hero-sub">Le commerçant a perdu son accès ? Donne-lui un nouveau mot de passe en 10 secondes.</p>
      </div></div>

      <div className="container pull-up">
        <div className="card reveal" style={{ maxWidth: 480, margin: "0 auto" }}>
          <div className="field">
            <label className="label">Mot de passe admin</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="field">
            <label className="label">Identifiant du client</label>
            <input className="input" value={client} onChange={(e) => setClient(e.target.value)}
              placeholder="Ex : marie-ergo" />
            <p className="footnote">La partie après le domaine dans l'adresse de son tableau de bord.</p>
          </div>

          <div className="field">
            <label className="label">Nouveau mot de passe</label>
            <input className="input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Ex : Marie2026" />
          </div>

          <button className="btn btn-primary btn-block" onClick={change}
            disabled={loading || !password || !client.trim() || newPassword.length < 4}>
            {loading ? "Modification…" : "Changer le mot de passe"}
          </button>

          {error && <p className="err">{error}</p>}
          {done && (
            <div className="focus-box" style={{ marginTop: 14 }}>
              ✓ Nouveau mot de passe pour <b>{done.name}</b> :<br />
              <span className="mono" style={{ display: "inline-block", marginTop: 8 }}>{done.pw}</span>
              <p className="footnote" style={{ marginBottom: 0 }}>Note-le maintenant, il ne sera plus lisible ensuite.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
