"use client";
import { useEffect, useRef, useState } from "react";

const FORMATS = {
  carre: { w: 1080, h: 1080, label: "Carré (post)" },
  story: { w: 1080, h: 1920, label: "Story" },
};

const STYLES = {
  guillemet: { label: "Citation (guillemet)" },
  google: { label: "Avis Google" },
  magazine: { label: "Magazine" },
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
    accent: hsl(h, clamp(sat + 10, 45, 80), 55),
  };
}

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
    if (l > 92 || l < 8 || s < 16) continue;
    const key = Math.round(h / 12) * 12;
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

// dessine un rectangle arrondi (compat tous navigateurs)
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export default function PostVisual({ businessName, logoUrl }) {
  const canvasRef = useRef(null);
  const [review, setReview] = useState("");
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [format, setFormat] = useState("carre");
  const [style, setStyle] = useState("guillemet");
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
    [review, author, rating, format, style, theme, autoTheme, fontsReady, businessName]);

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const F = FORMATS[format];
    canvas.width = F.w; canvas.height = F.h;
    const ctx = canvas.getContext("2d");

    // fond commun
    const T = activeTheme;
    const grad = ctx.createLinearGradient(0, 0, F.w, F.h);
    grad.addColorStop(0, T.bg1);
    grad.addColorStop(1, T.bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, F.w, F.h);

    if (style === "google") drawGoogle(ctx, F, T);
    else if (style === "magazine") drawMagazine(ctx, F, T);
    else drawGuillemet(ctx, F, T);
  }

  const nStars = () => Math.max(1, Math.min(5, Number(rating) || 5));
  const footTag = "AVIS CLIENT · GOOGLE";

  /* ---------- STYLE 1 : GUILLEMET (existant) ---------- */
  function drawGuillemet(ctx, F, T) {
    const W = F.w, H = F.h, P = format === "story" ? 130 : 100;
    ctx.fillStyle = T.star;
    ctx.globalAlpha = 0.18;
    ctx.font = `700 ${format === "story" ? 320 : 240}px Georgia, serif`;
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.fillText("\u201C", P - 10, format === "story" ? 430 : 330);
    ctx.globalAlpha = 1;

    ctx.textAlign = "center";
    ctx.font = `${format === "story" ? 78 : 64}px "Inter", Arial, sans-serif`;
    ctx.fillStyle = T.star;
    const n = nStars();
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
    if (lines.length > maxLines) { lines = lines.slice(0, maxLines); lines[lines.length - 1] = lines[lines.length - 1].replace(/[.,;:\s]+$/, "") + "\u2026"; }

    ctx.font = `600 ${size}px "Inter", Arial, sans-serif`;
    ctx.fillStyle = T.text;
    const centerY = H * (format === "story" ? 0.50 : 0.52);
    let y = centerY - (lines.length * lh) / 2 + lh * 0.7;
    for (const line of lines) { ctx.fillText(line, W / 2, y); y += lh; }

    if (author.trim()) {
      ctx.font = `500 ${format === "story" ? 44 : 38}px "Inter", Arial, sans-serif`;
      ctx.fillStyle = T.muted;
      ctx.fillText("— " + author.trim(), W / 2, y + (format === "story" ? 40 : 28));
    }
    drawFooter(ctx, F, T);
  }

  /* ---------- STYLE 2 : AVIS GOOGLE ---------- */
  function drawGoogle(ctx, F, T) {
    const W = F.w, H = F.h;
    const light = theme === "clair";
    const P = format === "story" ? 120 : 96;
    const cardX = P, cardW = W - 2 * P;
    const cardY = H * (format === "story" ? 0.20 : 0.16);
    const pad = format === "story" ? 78 : 64;

    // carte blanche
    const txt = review || "Collez un avis pour voir l'aperçu…";
    ctx.textAlign = "left";
    const innerW = cardW - 2 * pad;
    const bodySize = format === "story" ? 46 : 40;
    ctx.font = `400 ${bodySize}px "Inter", Arial, sans-serif`;
    let lines = wrap(ctx, txt, innerW);
    const maxLines = format === "story" ? 12 : 9;
    if (lines.length > maxLines) { lines = lines.slice(0, maxLines); lines[lines.length - 1] = lines[lines.length - 1].replace(/[.,;:\s]+$/, "") + "\u2026"; }
    const lh = bodySize * 1.45;
    const headH = format === "story" ? 190 : 168;
    const cardH = headH + lines.length * lh + pad * 1.6;

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,.28)";
    ctx.shadowBlur = 48; ctx.shadowOffsetY = 20;
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, cardX, cardY, cardW, cardH, 40);
    ctx.fill();
    ctx.restore();

    // pastille initiale
    const av = (author.trim() || "Client").charAt(0).toUpperCase();
    const avR = format === "story" ? 46 : 40;
    const avX = cardX + pad + avR, avY = cardY + pad + avR;
    ctx.fillStyle = T.bg2;
    ctx.beginPath(); ctx.arc(avX, avY, avR, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = `600 ${avR}px "Plus Jakarta Sans", Arial, sans-serif`;
    ctx.fillText(av, avX, avY + 2);

    // nom + "il y a peu"
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#202124";
    ctx.font = `600 ${format === "story" ? 42 : 36}px "Inter", Arial, sans-serif`;
    ctx.fillText(author.trim() || "Client Google", avX + avR + 28, avY - 6);
ctx.fillStyle = "#70757a";
    ctx.font = `400 ${format === "story" ? 30 : 26}px "Inter", Arial, sans-serif`;
    ctx.fillText("récemment", avX + avR + 28, avY + (format === "story" ? 40 : 34));

   // étoiles Google (jaune fixe), dessinées une par une pour un espacement net
    const starY = cardY + headH - (format === "story" ? 6 : 4);
    const sSize = format === "story" ? 44 : 38;
    const gap = sSize * 1.18;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.font = `${sSize}px Arial, sans-serif`;
    const n = nStars();
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i < n ? "#fbbc04" : "#dadce0";
      ctx.fillText("\u2605", cardX + pad + i * gap, starY);
    }

    // logo "G" Google (petit, en haut à droite de la carte)
    ctx.textAlign = "right";
    ctx.font = `700 ${format === "story" ? 40 : 34}px "Inter", Arial, sans-serif`;
    ctx.fillStyle = "#4285F4";
    ctx.fillText("G", cardX + cardW - pad, cardY + pad + (format === "story" ? 24 : 20));

    // corps de l'avis
    ctx.textAlign = "left";
    ctx.fillStyle = "#3c4043";
    ctx.font = `400 ${bodySize}px "Inter", Arial, sans-serif`;
    let y = starY + lh * 1.2;
    for (const line of lines) { ctx.fillText(line, cardX + pad, y); y += lh; }

    drawFooter(ctx, F, T);
  }

  /* ---------- STYLE 3 : MAGAZINE ---------- */
  function drawMagazine(ctx, F, T) {
    const W = F.w, H = F.h, P = format === "story" ? 120 : 96;

    // filet + étoiles en haut
    ctx.textAlign = "left";
    ctx.fillStyle = T.star;
    ctx.font = `${format === "story" ? 60 : 52}px "Inter", Arial, sans-serif`;
    const n = nStars();
    ctx.fillText("\u2605".repeat(n) + "\u2606".repeat(5 - n), P, H * (format === "story" ? 0.16 : 0.17));

    // gros texte éditorial, aligné à gauche, qui occupe le visuel
    const txt = review || "Collez un avis pour voir l'aperçu…";
    const maxW = W - 2 * P;
    const maxH = H * (format === "story" ? 0.50 : 0.48);
    const start = format === "story" ? 108 : 92;
    let size = start, lines = [], lh = 0;
    for (let s = start; s >= 44; s -= 2) {
      ctx.font = `700 ${s}px "Plus Jakarta Sans", Georgia, serif`;
      const ls = wrap(ctx, txt, maxW);
      lh = s * 1.18;
      if (ls.length * lh <= maxH) { size = s; lines = ls; break; }
      size = s; lines = ls;
    }
    const maxLines = Math.floor(maxH / lh);
    if (lines.length > maxLines) { lines = lines.slice(0, maxLines); lines[lines.length - 1] = lines[lines.length - 1].replace(/[.,;:\s]+$/, "") + "\u2026"; }

    ctx.fillStyle = T.text;
    ctx.font = `700 ${size}px "Plus Jakarta Sans", Georgia, serif`;
    let y = H * (format === "story" ? 0.26 : 0.27) + lh * 0.7;
    for (const line of lines) { ctx.fillText(line, P, y); y += lh; }

    // signature
    if (author.trim()) {
      y += format === "story" ? 30 : 20;
      ctx.fillStyle = T.star;
      ctx.fillRect(P, y, format === "story" ? 90 : 74, 6);
      ctx.fillStyle = T.muted;
      ctx.font = `500 ${format === "story" ? 44 : 38}px "Inter", Arial, sans-serif`;
      ctx.fillText(author.trim(), P + (format === "story" ? 112 : 92), y + (format === "story" ? 18 : 15));
    }
    drawFooter(ctx, F, T, "left");
  }

/* ---------- pied commun ---------- */
  function drawFooter(ctx, F, T, align = "center") {
    const W = F.w, H = F.h, P = format === "story" ? 120 : 96;
    const x = align === "left" ? P : W / 2;
    const maxW = W - 2 * P;
    ctx.textAlign = align;
    ctx.font = `600 ${format === "story" ? 32 : 27}px "Inter", Arial, sans-serif`;
    ctx.fillStyle = T.tag;
    ctx.fillText(footTag, x, H - P - (format === "story" ? 66 : 56));

    const name = businessName || "Votre établissement";
    let ns = format === "story" ? 62 : 52;
    for (; ns >= 30; ns -= 2) {
      ctx.font = `700 ${ns}px "Plus Jakarta Sans", Georgia, serif`;
      if (ctx.measureText(name).width <= maxW) break;
    }
    ctx.fillStyle = T.name;
    ctx.fillText(name, x, H - P - (format === "story" ? 8 : 6));
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const slug = (businessName || "avis").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      a.href = url;
      a.download = `avis-${slug}-${style}-${format}.png`;
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
          <label className="label">Style de visuel</label>
          <select className="select" value={style} onChange={(e) => setStyle(e.target.value)}>
            {Object.entries(STYLES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 150 }}>
          <label className="label">Format</label>
          <select className="select" value={format} onChange={(e) => setFormat(e.target.value)}>
            {Object.entries(FORMATS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      <div className="row2">
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
