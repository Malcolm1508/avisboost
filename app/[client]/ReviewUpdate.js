"use client";
import { useState } from "react";

export default function ReviewUpdate({ current }) {
  const [val, setVal] = useState(current === 0 || current ? String(current) : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setLoading(true); setError("");
    try {
      const client = decodeURIComponent(window.location.pathname.split("/").filter(Boolean)[0] || "");
      const res = await fetch("/api/reviews/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client, count: Number(val) }),
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
    <div style={{ marginTop: 16, borderTop: "1px solid var(--line)", paddingTop: 16 }}>
      <label className="label">Mettre à jour votre nombre d'avis Google</label>
      <div className="row2" style={{ marginTop: 0 }}>
        <input className="input" type="number" min="0" value={val}
          onChange={(e) => setVal(e.target.value)} placeholder="Ex : 128" style={{ flex: 2, minWidth: 160 }} />
        <button className="btn btn-primary" onClick={save} disabled={loading || val === ""} style={{ flex: 1, minWidth: 130 }}>
          {loading ? "…" : "Mettre à jour"}
        </button>
      </div>
      <p className="footnote">Regardez le total affiché sur votre fiche Google et reportez-le ici de temps en temps (une fois par semaine suffit).</p>
      {error && <p className="err">{error}</p>}
    </div>
  );
}
