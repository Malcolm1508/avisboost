"use client";
import { useState } from "react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [tone, setTone] = useState("chaleureux et professionnel");
  const [pin, setPin] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function create() {
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, name, googleUrl, tone, pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setResult(data);
      setName(""); setGoogleUrl(""); setPin("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="wrap">
      <span className="pill">Espace admin</span>
      <h1 style={{ marginTop: 8 }}>Nouveau client</h1>
      <p className="sub">Remplis, clique, et les deux liens sont prêts. Aucun code à toucher.</p>

      <div className="card">
        <label>Mot de passe admin</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <label>Nom de l'établissement</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex : Salon Marie" />

        <label>Lien d'avis Google du client</label>
        <input value={googleUrl} onChange={(e) => setGoogleUrl(e.target.value)}
          placeholder="https://g.page/r/…  ou  …/writereview?placeid=…" />

        <label>Ton des réponses IA</label>
        <input value={tone} onChange={(e) => setTone(e.target.value)} />

        <label>Code PIN du tableau de bord (facultatif)</label>
        <input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Ex : 4821" />

        <button onClick={create} disabled={loading || !password || !name || !googleUrl}>
          {loading ? "Création…" : "Créer le client"}
        </button>
        {error && <p className="err" style={{ marginTop: 12 }}>{error}</p>}
      </div>

      {result && (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>{result.updated ? "Client mis à jour" : "Client créé"} ✓</h2>
          <label>1. À programmer dans la carte NFC</label>
          <div className="mono">{result.cardUrl}</div>
          <label>2. À donner au commerçant (son tableau de bord)</label>
          <div className="mono">{result.dashboardUrl}</div>
        </div>
      )}
    </main>
  );
}
