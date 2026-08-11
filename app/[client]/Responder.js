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
      if (!res.ok) throw new Error(data.detail ? `${data.error} (${data.detail})` : (data.error || "Erreur"));
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
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div>
      <div className="field">
        <label className="label">Avis du client</label>
        <textarea
          className="textarea"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Collez ici l'avis laissé sur Google…"
        />
      </div>

      <div className="row2">
        <div style={{ flex: 1, minWidth: 130 }}>
          <label className="label">Note</label>
          <select className="select" value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="">— (facultatif)</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{"★".repeat(n)} {n}/5</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 2, minWidth: 180 }}>
          <label className="label">Ton de la réponse</label>
          <input className="input" value={tone} onChange={(e) => setTone(e.target.value)} />
        </div>
      </div>

      <button className="btn btn-primary btn-block btn-icon" onClick={generate} disabled={loading || !review.trim()}>
        {loading ? "Génération…" : (
          <>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/>
            </svg>
            Générer une réponse
          </>
        )}
      </button>

      {error && <p className="err">{error}</p>}

      {reply && (
        <div className="reply">
          <div className="reply-head">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Réponse proposée
          </div>
          <div className="reply-body">{reply}</div>
          <div className="reply-actions">
            <button className="btn btn-ghost btn-icon" onClick={copy}>
              {copied ? "Copié ✓" : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  Copier la réponse
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
