"use client";
import { useState } from "react";

export default function Login({ client, name }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client, password }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Erreur");
      window.location.reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="hero"><div className="hero-inner">
        <div className="eyebrow"><span className="dot"></span>AvisBoost</div>
        <h1 className="hero-title">{name || "Tableau de bord"}</h1>
        <p className="hero-sub">Connectez-vous pour accéder à votre tableau de bord.</p>
      </div></div>

      <div className="container pull-up">
        <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
          <div className="field">
            <label className="label">Mot de passe</label>
            <input
              className="input"
              type="password"
              value={password}
              autoFocus
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            />
          </div>
          <button className="btn btn-primary btn-block" onClick={submit} disabled={loading || !password}>
            {loading ? "Connexion…" : "Se connecter"}
          </button>
          {error && <p className="err">{error}</p>}
        </div>
      </div>
    </>
  );
}
