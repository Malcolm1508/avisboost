"use client";
import { useState } from "react";

const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

export default function Activity({ data }) {
  const [view, setView] = useState("7j");

  function build() {
    if (view === "7j" || view === "30j") {
      const N = view === "7j" ? 7 : 30;
      const cur = data.slice(-N);
      const prev = data.slice(-2 * N, -N);
      const bars = cur.map((d, i) => ({
        value: d.value,
        label: d.date.slice(8, 10) + "/" + d.date.slice(5, 7),
        showLabel: N <= 7 ? true : (i % 5 === 0 || i === cur.length - 1),
        today: i === cur.length - 1,
      }));
      const total = cur.reduce((s, d) => s + d.value, 0);
      const prevTotal = prev.reduce((s, d) => s + d.value, 0);
      return {
        bars, total, curForDelta: total, prevTotal,
        deltaLabel: view === "7j" ? "vs 7 j précédents" : "vs 30 j précédents",
        totalLabel: view === "7j" ? "scans · 7 jours" : "scans · 30 jours",
      };
    }
    const months = {};
    data.forEach((d) => { const m = d.date.slice(0, 7); months[m] = (months[m] || 0) + d.value; });
    const now = new Date();
    const keys = [];
    for (let i = 11; i >= 0; i--) {
      const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
      keys.push({ key: `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`, mi: dt.getMonth() });
    }
    const bars = keys.map((k, i) => ({
      value: months[k.key] || 0,
      label: MONTHS[k.mi],
      showLabel: true,
      today: i === keys.length - 1,
    }));
    const total = bars.reduce((s, b) => s + b.value, 0);
    const cur = bars[bars.length - 1].value;
    const prev = bars.length > 1 ? bars[bars.length - 2].value : 0;
    return { bars, total, curForDelta: cur, prevTotal: prev, deltaLabel: "ce mois vs mois dernier", totalLabel: "scans · 12 mois" };
  }

  const B = build();
  const max = Math.max(1, ...B.bars.map((b) => b.value));
  let delta = null;
  if (B.prevTotal > 0) delta = Math.round(((B.curForDelta - B.prevTotal) / B.prevTotal) * 100);
  else if (B.curForDelta > 0) delta = 100;
  const deltaClass = delta == null ? "flat" : (delta > 0 ? "up" : (delta < 0 ? "down" : "flat"));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <div className="seg">
          {["7j", "30j", "12 mois"].map((v) => (
            <button key={v} className={view === v ? "active" : ""} onClick={() => setView(v)}>{v}</button>
          ))}
        </div>
        {delta != null && (
          <span className={"delta " + deltaClass}>
            {delta > 0 ? "▲" : delta < 0 ? "▼" : "→"} {delta > 0 ? "+" : ""}{delta}%
            <span style={{ fontWeight: 500, opacity: 0.85 }}>{B.deltaLabel}</span>
          </span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
        <span className="period-total">{B.total}</span>
        <span style={{ color: "var(--muted)", fontSize: 14 }}>{B.totalLabel}</span>
      </div>

      <div className="chart">
        <div className="chart-bars">
          {B.bars.map((b, i) => (
            <div key={i} className={"bar" + (b.today ? " today" : "")}>
              <span className="bar-val">{b.value}</span>
              <div className="bar-fill" style={{ height: `${(b.value / max) * 100}%`, animationDelay: `${i * 20}ms` }}></div>
              {b.showLabel && <span className="bar-label">{b.label}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
