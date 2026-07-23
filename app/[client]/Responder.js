"use client";
import { useState } from "react";

export default function Responder({ businessName, defaultTone }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState("");
  const [tone, setTone] = useState(defaultTone || "chaleureux et professionnel");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true); setError(""); setReply(""); setCopied(false);
    try {
      const res = await fetch("/api/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review, rating, tone, businessName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setReply(data.reply);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div>
      <label>Avis du client</label>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Collez ici l'avis laissé sur Google…"
      />

      <div className="row">
        <div style={{ flex: 1, minWidth: 130 }}>
          <label>Note (facultatif)</label>
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="">—</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n} / 5</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 2, minWidth: 180 }}>
          <label>Ton de la réponse</label>
          <input value={tone} onChange={(e) => setTone(e.target.value)} />
        </div>
      </div>

      <button onClick={generate} disabled={loading || !review.trim()}>
        {loading ? "Génération…" : "Générer une réponse"}
      </button>

      {error && <p className="err" style={{ marginTop: 12 }}>{error}</p>}

      {reply && (
        <>
          <div className="out">{reply}</div>
          <button className="ghost" onClick={copy}>
            {copied ? "Copié ✓" : "Copier"}
          </button>
        </>
      )}
    </div>
  );
}
