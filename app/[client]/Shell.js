"use client";
import { useState } from "react";

const TABS = [
  { id: "overview", label: "Vue d'ensemble", icon: "home" },
  { id: "reviews", label: "Avis & Réponses", icon: "chat" },
  { id: "studio", label: "Studio", icon: "image" },
  { id: "coaching", label: "Coaching", icon: "target" },
];

function Icon({ name }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    home: <><path d="M3 10.5 12 3l9 7.5" {...p} /><path d="M5 9.5V21h14V9.5" {...p} /></>,
    chat: <><path d="M20 15a3 3 0 0 1-3 3H8l-4 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3z" {...p} /></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="3" {...p} /><circle cx="8.5" cy="9.5" r="1.5" {...p} /><path d="m4 17 4.5-4.5 3 3L15 12l5 5" {...p} /></>,
    target: <><circle cx="12" cy="12" r="9" {...p} /><circle cx="12" cy="12" r="4" {...p} /></>,
    logo: <><path d="M4 17.5 9.5 12l3 2.5L19 6.5" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="m18.6 3.6 1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z" fill="#fff" /></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" {...p} /><path d="m16 17 5-5-5-5M21 12H9" {...p} /></>,
  };
  return <svg viewBox="0 0 24 24">{paths[name]}</svg>;
}

export default function Shell({ clientId, name, address, logoUrl, isDemo, tabs }) {
  const [active, setActive] = useState("overview");
  const initial = (name || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="dash">
      {/* HEADER */}
      <header className="dash-header">
        <div className="dash-header-inner">
          <div className="dash-brand">
            <div className="dash-brand-logo"><Icon name="logo" /></div>
            <div className="dash-brand-txt">
              <span className="dash-brand-name">BoostRepu</span>
              <span className="dash-brand-sub">MMAxis</span>
            </div>
          </div>
          <a href={`/api/auth/logout?client=${clientId}`} className="dash-logout" title="Se déconnecter">
            <Icon name="logout" />
            <span>Déconnexion</span>
          </a>
        </div>

        {/* bandeau établissement */}
        <div className="dash-estab">
          <div className="dash-estab-logo">
            {logoUrl ? <img src={logoUrl} alt={name} /> : <span>{initial}</span>}
          </div>
          <div className="dash-estab-txt">
            <h1 className="dash-estab-name">
              {name}
              {isDemo && <span className="dash-badge">Démonstration</span>}
            </h1>
            {address ? (
              <p className="dash-estab-addr">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                {address}
              </p>
            ) : (
              <p className="dash-estab-addr">Le suivi de vos avis Google, en direct.</p>
            )}
          </div>
        </div>

        {/* ONGLETS */}
        <nav className="dash-tabs">
          {TABS.map((t) => (
            <button key={t.id}
              className={"dash-tab" + (active === t.id ? " active" : "")}
              onClick={() => { setActive(t.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <Icon name={t.icon} />
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* CONTENU DE L'ONGLET ACTIF */}
      <main className="dash-body">
        {TABS.map((t) => (
          <div key={t.id} className="dash-panel" hidden={active !== t.id}>
            {tabs[t.id]}
          </div>
        ))}
      </main>

      {/* NAV MOBILE BASSE */}
      <nav className="dash-mobile">
        {TABS.map((t) => (
          <button key={t.id}
            className={active === t.id ? "active" : ""}
            onClick={() => { setActive(t.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <Icon name={t.icon} />
            <span>{t.label.split(" ")[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
