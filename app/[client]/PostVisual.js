"use client";
import { useEffect, useRef, useState } from "react";

const FORMATS = {
  carre: { w: 1080, h: 1080, label: "Carré (post)" },
  story: { w: 1080, h: 1920, label: "Story" },
};

const BASE_THEMES = {
  violet: { label: "Violet BoostRepu", bg1: "#1a1038", bg2: "#5b21b6", text: "#ffffff", muted: "#c4b5fd", star: "#fbbf24", name: "#ffffff", tag: "#a78bfa" },
  emeraude: { label: "Émeraude", bg1: "#083b34", bg2: "#0b6b5b", text: "#ffffff", muted: "#a9d8cc", star: "#e2a112", name: "#ffffff", tag: "#8fc7ba" },
  sombre: { label: "Noir", bg1: "#111114", bg2: "#2b2b33", text: "#ffffff", muted: "#b7b7c2", star: "#fbbf24", name: "#ffffff", tag: "#9a9aa8" },
  clair: { label: "Clair", bg1: "#ffffff", bg2: "#f1f1f8", text: "#16172a", muted: "#5c6070", star: "#f59e0b", name: "#5b21b6", tag: "#7c8090" },
};

/* ---------- couleurs ---------- */
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, s * 100, l * 100];
}
const hsl = (h, s, l) => `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function themeFromHue(h, s) {
  const sat = clamp(s, 22, 62);
  return {
    label: "D'après le logo",
    bg1: hsl(h, clamp(sat * 0.85, 20, 50), 11),
    bg2: hsl(h, sat, 33),
    text: "#ffffff",
    muted: hsl(h, clamp(sat * 0.6, 15, 45), 78),
    star: hsl(h, clamp(sat + 25, 60, 95), 62),
    name: "#ffffff",
    tag: hsl(h, clamp(sat * 0.7, 18, 50), 68),
  };
}

/* Couleur dominante : on ignore le quasi-blanc, le quasi-noir et le gris */
function dominantColor(img) {
  const S = 64;
  const c = document.createElement("canvas");
  c.width = S; c.height = S;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, S, S);
  let data;
  try { data = ctx.getImageData(0, 0, S, S).data; } catch { return null; }

  const buckets = new Map();
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a < 160) continue;
    const [h, s, l] = rgbToHsl(r, g, b);
    if (l > 92 || l < 8 || s < 16) continue;   // blanc, noir, gris
    const key = Math.round(h / 12) * 12;        // regroupement par teinte
    const cur = buckets.get(key) || { n: 0, h: 0, s: 0 };
    cur.n++; cur.h += h; cur.s += s;
    buckets.set(key, cur);
  }
  if (!buckets.size) return null;
  let best = null;
  for (const v of buckets.values()) if (!best || v.n > best.n) best = v;
  return { h: best.h / best.n, s: best.s / best.n };
}

function wrap(ctx, text, maxWidth) {
  const words = String(text).replace(/\s+/g, " ").trim().split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    const t = cur ? cur + " " + w : w;
    if (ctx.measureText(t).width > maxWidth && cur) { lines.push(cur); cur = w; }
    else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}

export default function PostVisual({ businessName, logoUrl }) {
  const canvasRef = useRef(null);
  const [review, setReview] = useState("");
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [format, setFormat] = useState("carre");
  const [theme, setTheme] = useState(logoUrl ? "auto" : "violet");
  const [fontsReady, setFontsReady] = useState(false);

  const [autoTheme, setAutoTheme] = useState(null);
  const [logoState, setLogoState] = useState(logoUrl ? "loading" : "none");

  const [caps, setCaps] = useState(null);
  const [capLoading, setCapLoading] = useState(false);
  const [capErr, setCapErr] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => setFontsReady(true));
    } else setFontsReady(true);
  }, []);

  /* Extraction de la couleur du logo */
  useEffect(() => {
    if (!logoUrl) { setLogoState("none"); return; }
    let cancelled = false;
    setLogoState("loading");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      const d = dominantColor(img);
      if (d) { setAutoTheme(themeFromHue(d.h, d.s)); setLogoState("ok"); }
      else { setLogoState("fail"); setTheme((t) => (t === "auto" ? "violet" : t)); }
    };
    img.onerror = () => {
      if (cancelled) return;
      setLogoState("fail");
      setTheme((t) => (t === "auto" ? "violet" : t));
    };
    img.src = `/api/logo?url=${encodeURIComponent(logoUrl)}`;
    return () => { cancelled = true; };
  }, [logoUrl]);

  const activeTheme = (theme === "auto" && autoTheme) ? autoTheme : (BASE_THEMES[theme] || BASE_THEMES.violet);

  useEffect(() => { draw(); },
    [review, author, rating, format, theme, autoTheme, fontsReady, businessName]);

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const F = FORMATS[format];
    const T = activeTheme;
    canvas.width = F.w; canvas.height = F.h;
    const ctx = canvas.getContext("2d");
    const W = F.w, H = F.h;
    const P = format === "story" ? 130 : 100;

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, T.bg1);
    grad.addColorStop(1, T.bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = T.star;
    ctx.globalAlpha = 0.18;
    ctx.font = `700 ${format === "story" ? 320 : 240}px Georgia, serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("\u201C", P - 10, format === "story" ? 430 : 330);
    ctx.globalAlpha = 1;

    ctx.textAlign = "center";

    const starSize = format === "story" ? 78 : 64;
    ctx.font = `${starSize}px "Inter", Arial, sans-serif`;
    ctx.fillStyle = T.star;
    const n = Math.max(1, Math.min(5, Number(rating) || 5));
    ctx.fillText("\u2605".repeat(n) + "\u2606".repeat(5 - n), W / 2, H * (format === "story" ? 0.28 : 0.30));

    const txt = review || "Collez un avis pour voir l'aperçu…";
    const maxW = W - 2 * P;
    const maxH = H * (format === "story" ? 0.34 : 0.36);
    const start = format === "story" ? 82 : 70;
    let size = start, lines = [], lh = 0;
    for (let s = start; s >= 34; s -= 2) {
      ctx.font = `600 ${s}px "Inter", Arial, sans-serif`;
      const ls = wrap(ctx, txt, maxW);
      lh = s * 1.28;
      if (ls.length * lh <= maxH) { size = s; lines = ls; break; }
      size = s; lines = ls;
    }
    const maxLines = Math.floor(maxH / lh);
    if (lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      lines[lines.length - 1] = lines[lines.length - 1].replace(/[.,;:\s]+$/, "") + "\u2026";
    }

    ctx.font = `600 ${size}px "Inter", Arial, sans-serif`;
    ctx.fillStyle = T.text;
    const blockH = lines.length * lh;
    const centerY = H * (format === "story" ? 0.50 : 0.52);
    let y = centerY - blockH / 2 + lh * 0.7;
    for (const line of lines) { ctx.fillText(line, W / 2, y); y += lh; }

    if (author.trim()) {
      ctx.font = `500 ${format === "story" ? 44 : 38}px "Inter", Arial, sans-serif`;
      ctx.fillStyle = T.muted;
      ctx.fillText("— " + author.trim(), W / 2, y + (format === "story" ? 40 : 28));
    }

    ctx.font = `600 ${format === "story" ? 32 : 27}px "Inter", Arial, sans-serif`;
    ctx.fillStyle = T.tag;
    ctx.fillText("AVIS CLIENT · GOOGLE", W / 2, H - P - (format === "story" ? 78 : 66));
    ctx.font = `700 ${format === "story" ? 62 : 52}px "Plus Jakarta Sans", Georgia, serif`;
    ctx.fillStyle = T.name;
    ctx.fillText(businessName || "Votre établissement", W / 2, H - P - (format === "story" ? 18 : 14));
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const slug = (businessName || "avis").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      a.href = url;
      a.download = `avis-${slug}-${format}.png`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  async function genCaptions() {
    setCapLoading(true); setCapErr(""); setCaps(null); setCopied("");
    try {
      const client = decodeURIComponent(window.location.pathname.split("/").filter(Boolean)[0] || "");
      const res = await fetch("/api/posts", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client, review }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.detail ? `${j.error} (${j.detail})` : (j.error || "Erreur"));
      setCaps(j.posts);
    } catch (e) { setCapErr(e.message); } finally { setCapLoading(false); }
  }

  async function copy(key, txt) {
    await navigator.clipboard.writeText(txt);
    setCopied(key); setTimeout(() => setCopied(""), 1600);
  }

  const CAPS = [
    { key: "instagram", label: "Instagram" },
    { key: "facebook", label: "Facebook" },
    { key: "site", label: "Site web" },
  ];

  return (
    <div>
      <div className="field">
        <label className="label">L'avis à mettre en image</label>
        <textarea className="textarea" value={review} onChange={(e) => setReview(e.target.value)}
          placeholder="Collez un avis 4 ou 5 étoiles…" />
      </div>

      <div className="row2">
        <div style={{ flex: 2, minWidth: 160 }}>
          <label className="label">Prénom du client (facultatif)</label>
          <input className="input" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Ex : Julie" />
        </div>
        <div style={{ flex: 1, minWidth: 110 }}>
          <label className="label">Étoiles</label>
          <select className="select" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[5, 4, 3].map((n) => <option key={n} value={n}>{n} ★</option>)}
          </select>
        </div>
      </div>

      <div className="row2">
        <div style={{ flex: 1, minWidth: 150 }}>
          <label className="label">Format</label>
          <select className="select" value={format} onChange={(e) => setFormat(e.target.value)}>
            {Object.entries(FORMATS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 150 }}>
          <label className="label">Couleur</label>
          <select className="select" value={theme} onChange={(e) => setTheme(e.target.value)}>
            {logoState === "ok" && <option value="auto">D'après votre logo ✨</option>}
            {Object.entries(BASE_THEMES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          {logoState === "loading" && <p className="footnote">Lecture des couleurs de votre logo…</p>}
          {logoState === "fail" && <p className="footnote">Logo illisible : couleurs par défaut appliquées.</p>}
        </div>
      </div>

      <div style={{ marginTop: 18, display: "flex", justifyContent: "center", background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", padding: 16 }}>
        <canvas ref={canvasRef}
          style={{ width: "auto", maxWidth: "100%", maxHeight: 420, height: "auto", borderRadius: 10, boxShadow: "var(--shadow-md)" }} />
      </div>

      <button className="btn btn-primary btn-block btn-icon" onClick={download} disabled={!review.trim()}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Télécharger l'image
      </button>

      <button className="btn btn-ghost btn-block btn-icon" style={{ marginTop: 10 }} onClick={genCaptions} disabled={capLoading || !review.trim()}>
        {capLoading ? "Génération…" : "Générer les légendes (facultatif)"}
      </button>

      {capErr && <p className="err">{capErr}</p>}

      {caps && (
        <div style={{ marginTop: 6 }}>
          {CAPS.map(({ key, label }) => caps[key] ? (
            <div className="reply" key={key} style={{ marginTop: 14 }}>
              <div className="reply-head">{label}</div>
              <div className="reply-body">{caps[key]}</div>
              <div className="reply-actions">
                <button className="btn btn-ghost btn-icon" onClick={() => copy(key, caps[key])}>
                  {copied === key ? "Copié ✓" : "Copier"}
                </button>
              </div>
            </div>
          ) : null)}
        </div>
      )}
    </div>
  );
}
