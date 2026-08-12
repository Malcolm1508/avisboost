"use client";
import { useState } from "react";

const BLOCS = [
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "site", label: "Site web" },
  { key: "story", label: "Story Instagram" },
];

export default function Posts() {
  const [review, setReview] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  async function generate() {
    setLoading(true); setError(""); setData(null); setCopied("");
    try {
      const client = decodeURIComponent(window.location.pathname.split("/").filter(Boolean)[0] || "");
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client, review }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.detail ? `${j.error} (${j.detail})` : (j.error || "Erreur"));
      setData(j.posts);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function copy(key, txt) {
    await navigator.clipboard.writeText(txt);
    setCopied(key);
    setTimeout(() => setCopied(""), 1600);
  }

  return (
    <div>
      <div className="field">
        <label className="label">Un bon avis à mettre en avant</label>
        <textarea
          className="textarea"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Collez ici un avis 4 ou 5 étoiles…"
        />
      </div>

      <button className="btn btn-primary btn-block btn-icon" onClick={generate} disabled={loading || !review.trim()}>
        {loading ? "Génération…" : (
          <>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11l19-9-9 19-2-8-8-2z"/>
            </svg>
            Créer mes publications
          </>
        )}
      </button>

      {error && <p className="err">{error}</p>}

      {data && (
        <div style={{ marginTop: 8 }}>
          {BLOCS.map(({ key, label }) =>
            data[key] ? (
              <div className="reply" key={key} style={{ marginTop: 14 }}>
                <div className="reply-head">{label}</div>
                <div className="reply-body">{data[key]}</div>
                <div className="reply-actions">
                  <button className="btn btn-ghost btn-icon" onClick={() => copy(key, data[key])}>
                    {copied === key ? "Copié ✓" : (
                      <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copier
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
