"use client";
import { useState } from "react";

export default function AdminClients() {
  const [password, setPassword] = useState("");
  const [clients, setClients] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resettingId, setResettingId] = useState("");

  async function load() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ? `${data.error} (${data.detail})` : (data.error || "Erreur"));
      setClients(data.clients);
    } catch (e) {
      setError(e.message);
      setClients(null);
    } finally {
      setLoading(false);
    }
  }

  async function resetOne(id, name) {
    if (!window.confirm(`Remettre à zéro les scans de « ${name} » ? Cette action est irréversible.`)) return;
    setResettingId(id); setError("");
    try {
      const res = await fetch("/api/admin/reset-scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, client: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ? `${data.error} (${data.detail})` : (data.error || "Erreur"));
      setClients((prev) => prev.map((c) => (c.id === id ? { ...c, taps: 0 } : c)));
    } catch (e) {
      setError(e.message);
    } finally {
      setResettingId("");
    }
  }

  return (
    <>
      <div className="hero"><div className="hero-inner">
        <div className="eyebrow"><span className="dot"></span>AvisBoost · Admin</div>
        <h1 className="hero-title">Mes clients</h1>
        <p className="hero-sub">Vue d'ensemble du parc : scans, accès dashboard, remise à zéro.</p>
      </div></div>

      <div className="container pull-up">
        <div className="card reveal" style={{ maxWidth: 480, margin: clients ? "0 0 20px" : "0 auto" }}>
          <div className="field">
            <label className="label">Mot de passe admin</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && password) load(); }}
            />
          </div>
          <button className="btn btn-primary btn-block" onClick={load} disabled={loading || !password}>
            {loading ? "Chargement…" : clients ? "Rafraîchir la liste" : "Afficher mes clients"}
          </button>
          {error && <p className="err">{error}</p>}
        </div>

        {clients && (
          <div className="card reveal">
            <div className="card-head">
              <h2 className="card-title">{clients.length} client{clients.length > 1 ? "s" : ""}</h2>
            </div>

            {clients.length === 0 ? (
              <p className="footnote">Aucun client pour l'instant.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {clients.map((c) => (
                  <div
                    key={c.id}
                    className="hoverable"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "14px 16px",
                      border: "1px solid var(--line)",
                      borderRadius: 14,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>{c.name}</div>
                      <div className="footnote" style={{ margin: 0 }}>{c.id} · {c.taps} scan{c.taps > 1 ? "s" : ""}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <a className="btn btn-ghost" href={`/${c.id}`} target="_blank" rel="noopener noreferrer">
                        Ouvrir le dashboard
                      </a>
                      <button
                        className="btn btn-ghost"
                        onClick={() => resetOne(c.id, c.name)}
                        disabled={resettingId === c.id}
                      >
                        {resettingId === c.id ? "…" : "Reset scans"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
