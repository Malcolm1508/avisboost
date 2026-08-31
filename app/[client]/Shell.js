"use client";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "tableau", label: "Tableau de bord", short: "Accueil", icon: "home" },
  { id: "objectif", label: "Objectif & coaching", short: "Coaching", icon: "target" },
  { id: "conversion", label: "Performance", short: "Perf.", icon: "gauge" },
  { id: "activite", label: "Activité", short: "Activité", icon: "chart" },
  { id: "analyse", label: "Analyse & Insights", short: "Analyse", icon: "sparkle" },
  { id: "plan", label: "Plan d'action", short: "Plan", icon: "check" },
  { id: "repondre", label: "Réponses IA", short: "Répondre", icon: "chat" },
  { id: "visuel", label: "Studio visuel", short: "Studio", icon: "image" },
];

const MOBILE = ["tableau", "objectif", "activite", "repondre", "visuel"];

function Icon({ name }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    home: <><path d="M3 10.5 12 3l9 7.5" {...p} /><path d="M5 9.5V21h14V9.5" {...p} /></>,
    target: <><circle cx="12" cy="12" r="9" {...p} /><circle cx="12" cy="12" r="4" {...p} /></>,
    gauge: <><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" {...p} /><path d="M12 12 8 8" {...p} /><path d="M4 18a9 9 0 1 1 16 0" {...p} /></>,
    chart: <><path d="M3 20h18" {...p} /><path d="M6 16v-5M11 16V7M16 16v-8M21 16v-3" {...p} /></>,
    sparkle: <><path d="m12 3 2 5.5L19.5 10 14 12l-2 5.5L10 12 4.5 10 10 8.5z" {...p} /></>,
    check: <><path d="M9 11.5 11.5 14 16 9" {...p} /><rect x="3.5" y="3.5" width="17" height="17" rx="5" {...p} /></>,
    chat: <><path d="M20 15a3 3 0 0 1-3 3H8l-4 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3z" {...p} /></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="3" {...p} /><circle cx="8.5" cy="9.5" r="1.5" {...p} /><path d="m4 17 4.5-4.5 3 3L15 12l5 5" {...p} /></>,
    logo: <><path d="M4 17.5 9.5 12l3 2.5L19 6.5" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="m18.6 3.6 1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z" fill="#fff" /></>,
  };
  return <svg viewBox="0 0 24 24">{paths[name]}</svg>;
}

export default function Shell({ clientId, name, address, logoUrl, isDemo, children }) {
  const [active, setActive] = useState("tableau");
  const initial = (name || "?").trim().charAt(0).toUpperCase();

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  function go(e, id) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); setActive(id); }
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo"><Icon name="logo" /></div>
          <div>
            <div className="sidebar-name">BoostRepu</div>
            <div className="sidebar-sub">MMAxis</div>
          </div>
        </div>

        <nav className="nav">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} onClick={(e) => go(e, s.id)}
               className={"nav-item" + (active === s.id ? " active" : "")}>
              <Icon name={s.icon} />{s.label}
            </a>
          ))}
        </nav>

        <div className="sidebar-promo">
          <h4>Besoin d'un coup de main ?</h4>
          <p>Une question sur votre carte ou vos avis : appelez-moi, je réponds.</p>
          <a href={`/api/auth/logout?client=${clientId}`} className="pill">Se déconnecter</a>
        </div>

        <div className="sidebar-foot">
          <a href="/mentions-legales">Mentions légales</a>
          <a href="/cgv">CGV</a>
          <a href="/confidentialite">Confidentialité</a>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar-inner">
            <div className="topbar-logo">
              {logoUrl ? <img src={logoUrl} alt={name} /> : <span className="brand-mono">{initial}</span>}
            </div>
            <div className="topbar-text">
              <h1 className="topbar-title">
                {name}
                {isDemo && <span className="badge-demo">Démonstration</span>}
              </h1>
              {address ? (
                <p className="topbar-addr">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  {address}
                </p>
              ) : (
                <p className="topbar-addr">Le suivi de vos avis Google, en direct.</p>
              )}
            </div>
          </div>
        </header>

        {children}
      </div>

      <nav className="mobile-nav">
        {SECTIONS.filter((s) => MOBILE.includes(s.id)).map((s) => (
          <a key={s.id} href={`#${s.id}`} onClick={(e) => go(e, s.id)}
             className={active === s.id ? "active" : ""}>
            <Icon name={s.icon} />{s.short}
          </a>
        ))}
      </nav>
    </div>
  );
}
