"use client";
import { useState } from "react";

export default function Analyzer({ businessName }) {
  const [reviews, setReviews] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyze() {
    setLoading(true); setError(""); setData(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviews, businessName }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.detail ? `${j.error} (${j.detail})` : (j.error || "Erreur"));
      setData(j.analysis);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const sentClass = data
    ? ({ "positif": "sent-pos", "mitigé": "sent-mid", "négatif": "sent-neg" }[data.sentiment] || "sent-mid")
    : "";

  const themeList = (arr, kind) =>
    (arr && arr.length ? (
      arr.map((t, i) => (
        <div className="theme" key={i}>
          <div className="theme-main">
            <div className="theme-name">{t.theme}</div>
            {t.exemple && <div className="theme-ex">{t.exemple}</div>}
          </div>
          {typeof t.frequence === "number" && <span className="freq">×{t.frequence}</span>}
        </div>
      ))
    ) : (
      <p className="empty-note">{kind === "neg" ? "Aucun point faible marquant. 👏" : "Rien à signaler ici."}</p>
    ));

  return (
    <div>
      <div className="field">
        <label className="label">Avis à analyser</label>
        <textarea
          className="textarea"
          style={{ minHeight: 160 }}
          value={reviews}
          onChange={(e) => setReviews(e.target.value)}
          placeholder="Collez plusieurs avis, idéalement un par ligne…"
        />
        <p className="footnote">Copiez les avis depuis votre page Google, un par ligne. Plus il y en a, plus l'analyse est fiable.</p>
      </div>

      <button className="btn btn-primary btn-block btn-icon" onClick={analyze} disabled={loading || !reviews.trim()}>
        {loading ? "Analyse…" : (
          <>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18"/><path d="M7 14l3-4 3 3 4-6"/>
            </svg>
            Analyser les avis
          </>
        )}
      </button>

      {error && <p className="err">{error}</p>}

      {data && (
        <div className="analysis">
          <div className="analysis-top">
            {data.sentiment && <span className={"sent " + sentClass}>{data.sentiment}</span>}
            {data.resume && <p className="analysis-resume">{data.resume}</p>}
          </div>

          <div className="asec">
            <div className="asec-head"><span className="adot pos"></span>Ce qui plaît le plus</div>
            {themeList(data.positifs, "pos")}
          </div>

          <div className="asec">
            <div className="asec-head"><span className="adot neg"></span>Points à améliorer</div>
            {themeList(data.negatifs, "neg")}
          </div>

          {data.axes && data.axes.length > 0 && (
            <div className="asec">
              <div className="asec-head"><span className="adot axe"></span>Axes d'amélioration</div>
              <ul className="axes">
                {data.axes.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
