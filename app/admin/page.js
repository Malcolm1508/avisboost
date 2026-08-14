"use client";
import { useState } from "react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [tone, setTone] = useState("chaleureux et professionnel");
  const [clientPassword, setClientPassword] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [address, setAddress] = useState("");
  const [owner, setOwner] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [style, setStyle] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function create() {
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, name, googleUrl, tone, clientPassword, logoUrl, address, owner, specialty, style }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ? `${data.error} (${data.detail})` : (data.error || "Erreur"));
      setResult({ ...data, pw: clientPassword });
      setName(""); setGoogleUrl(""); setClientPassword(""); setLogoUrl(""); setAddress("");
      setOwner(""); setSpecialty(""); setStyle("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="hero"><div className="hero-inner">
      <div className="eyebrow"><span className="dot"></span>BoostRepu · Admin</div>
        <h1 className="hero-title">Nouveau client</h1>
        <p className="hero-sub">Remplis, clique, et tout est prêt : les liens et l'accès du commerçant.</p>
      </div></div>

      <div className="container pull-up">
        <div className="card reveal">
          <div className="field">
            <label className="label">Mot de passe admin</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="field">
            <label className="label">Nom de l'établissement</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex : Salon Marie" />
          </div>

          <div className="field">
            <label className="label">Lien d'avis Google du client</label>
            <input className="input" value={googleUrl} onChange={(e) => setGoogleUrl(e.target.value)}
              placeholder="https://g.page/r/…  ou  …/writereview?placeid=…" />
          </div>

          <div className="field">
            <label className="label">Adresse (facultatif)</label>
            <input className="input" value={address} onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex : 12 rue Saint-Dizier, 54000 Nancy" />
          </div>

          <div className="field">
            <label className="label">URL du logo (facultatif)</label>
            <input className="input" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://… (lien direct vers une image)" />
            <p className="footnote">Clic droit sur le logo du commerçant (site, Facebook, fiche Google) → « Copier l'adresse de l'image ». S'il n'y en a pas, laisse vide : son initiale s'affichera joliment.</p>
          </div>

          <div style={{ borderTop: "1px solid var(--line)", margin: "20px 0 4px", paddingTop: 16 }}>
            <p className="card-hint" style={{ margin: 0 }}>Personnalisation de l'assistant IA (facultatif mais recommandé)</p>
          </div>

          <div className="field">
            <label className="label">Prénom du dirigeant</label>
            <input className="input" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Ex : Marie" />
          </div>

          <div className="field">
            <label className="label">Activité / spécialité</label>
            <input className="input" value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="Ex : institut de beauté, cuisine italienne, garage auto…" />
          </div>

          <div className="field">
            <label className="label">Style de communication</label>
            <input className="input" value={style} onChange={(e) => setStyle(e.target.value)} placeholder="Ex : humain et jamais robotique, tutoiement, ton premium…" />
          </div>

          <div className="field">
            <label className="label">Ton des réponses IA</label>
            <input className="input" value={tone} onChange={(e) => setTone(e.target.value)} />
          </div>

          <div className="field">
            <label className="label">Mot de passe du client (pour son tableau de bord)</label>
            <input className="input" value={clientPassword} onChange={(e) => setClientPassword(e.target.value)}
              placeholder="Ex : Marie2026" />
          </div>

          <button className="btn btn-primary btn-block" onClick={create}
            disabled={loading || !password || !name || !googleUrl || !clientPassword}>
            {loading ? "Création…" : "Créer le client"}
          </button>
          {error && <p className="err">{error}</p>}
        </div>

        {result && (
          <div className="card reveal">
            <h2 className="card-title" style={{ marginBottom: 14 }}>{result.updated ? "Client mis à jour ✓" : "Client créé ✓"}</h2>
            <label className="label">1. À programmer dans la carte NFC</label>
            <div className="mono">{result.cardUrl}</div>
            <label className="label" style={{ marginTop: 14 }}>2. Adresse du tableau de bord (à donner au commerçant)</label>
            <div className="mono">{result.dashboardUrl}</div>
            <label className="label" style={{ marginTop: 14 }}>3. Son mot de passe de connexion</label>
            <div className="mono">{result.pw}</div>
            <p className="footnote">Note bien ce mot de passe : il est chiffré côté serveur, tu ne pourras plus le relire ensuite (il faudra recréer le client pour le changer).</p>
          </div>
        )}
      </div>
    </>
  );
}
