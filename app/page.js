"use client";
import { useState } from "react";

const CONTACT_EMAIL = "contact@boostrepu.fr";
const CONTACT_TEL = "07 77 76 07 72";

function Logo({ size = 30 }) {
  return (
    <span className="lp-logo">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id="lpg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a855f7" />
            <stop offset="1" stopColor="#6d28d9" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#lpg)" />
        <polygon points="16,8 18.1,13.1 23.6,13.5 19.4,17.1 20.7,22.5 16,19.6 11.3,22.5 12.6,17.1 8.4,13.5 13.9,13.1" fill="#fff" />
      </svg>
      <span className="lp-word">BoostRepu</span>
    </span>
  );
}

function Check() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
}
function Sparkle() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8z" /></svg>;
}

// Icônes fonctionnalités
const FeatIcon = ({ d }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);

export default function Home() {
  const mail = `mailto:${CONTACT_EMAIL}?subject=Demande%20d'information%20BoostRepu`;
  const tel = `tel:${CONTACT_TEL}`;
  const [contactOpen, setContactOpen] = useState(false);
  const openContact = () => setContactOpen(true);
  const bars = [34, 48, 40, 62, 55, 72, 90, 68, 84, 100, 76, 94];

  const features = [
    { t: "Suivi des scans", p: "Combien de personnes scannent, par jour, par mois, avec la progression dans le temps.", d: <><path d="M3 3v18h18" /><path d="M7 14l3-4 3 3 4-6" /></> },
    { t: "Taux de conversion", p: "Voyez précisément combien de scans se transforment en avis Google.", d: <><path d="M12 20V10M18 20V4M6 20v-4" /></> },
    { t: "Analyse par IA", p: "L'assistant ressort les points forts et les points faibles qui reviennent dans vos avis.", d: <><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" /></> },
    { t: "Plan d'action", p: "Vos priorités concrètes de la semaine, à cocher au fur et à mesure.", d: <><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></> },
    { t: "Réponses aux avis", p: "Une réponse personnalisée et professionnelle générée en un clic.", d: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></> },
    { t: "Visuels à poster", p: "Transformez un bel avis en image prête pour Instagram, Facebook ou votre site.", d: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></> },
  ];

  const coaching = [
    { t: "Objectif d'avis", p: "Fixez un cap — 100 avis, 200 avis — et suivez votre progression avec une estimation de date.", d: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3" /></> },
    { t: "Carte qui dort", p: "Une alerte vous prévient si votre carte n'a plus été scannée depuis plusieurs jours.", d: <><path d="M3 12h3l2-6 4 12 3-9 2 3h4" /></> },
    { t: "Rappel de la semaine", p: "L'outil analyse vos scans et vos avis et vous dit quoi faire pour en obtenir plus.", d: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></> },
    { t: "Fraîcheur de fiche", p: "Google favorise les fiches actives. On surveille l'ancienneté de vos avis pour vous.", d: <><path d="M12 2a7 7 0 0 0-7 7c0 3 2 5 2 7h10c0-2 2-4 2-7a7 7 0 0 0-7-7z" /><path d="M9 22h6" /></> },
  ];

  return (
    <div className="lp lp-dark">
      {/* NAV */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <a href="/" className="lp-brand"><Logo /></a>
          <div className="lp-links">
            <a className="lp-navlink" href="#fonctionnement">Fonctionnement</a>
            <a className="lp-navlink" href="#outil">L'outil</a>
            <a className="lp-navlink" href="#tarifs">Tarifs</a>
            <a className="lp-navlink" href="#faq">FAQ</a>
            <a href="/blog" className="lp-nav-blog">Blog</a>
            <button onClick={openContact} className="lp-btn lp-btn-primary" style={{ padding: "9px 18px", fontSize: 14 }}>Nous contacter</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="lp-hero">
        <span className="lp-glow lp-glow-1" />
        <span className="lp-glow lp-glow-2" />
        <div className="lp-grid-bg" />
        <div className="lp-hero-inner">
          <div>
            <span className="lp-pill"><Sparkle /> La carte + le tableau de bord · fait à Nancy</span>
            <h1 className="lp-h1">Transformez chaque client satisfait en <span className="lp-grad">avis Google</span>.</h1>
            <p className="lp-lead">Une carte à poser sur votre comptoir — sans contact ou par QR code — un scan de 5 secondes, et un tableau de bord qui suit vos avis et vous dit quoi améliorer.</p>
            <div className="lp-hero-btns">
              <button onClick={openContact} className="lp-btn lp-btn-primary lp-btn-lg">Nous contacter</button>
              <a href="#outil" className="lp-btn lp-btn-outline lp-btn-lg">Découvrir l'outil</a>
            </div>
            <div className="lp-hero-rea">
              <span><Check /> Sans engagement</span>
              <span><Check /> Satisfait ou remboursé 14 jours</span>
            </div>
          </div>

          {/* MOCKUP */}
          <div className="lp-mock-wrap">
            <div className="lp-mock">
              <div className="lp-mock-bar"><i /><i /><i /><span className="lp-mock-url">boostrepu.fr/salon-marie</span></div>
              <div className="lp-mock-body">
                <div className="lp-mock-hd">
                  <div className="lp-mock-logo">M</div>
                  <div style={{ flex: 1 }}>
                    <div className="lp-mock-name">Salon Marie</div>
                    <div className="lp-mock-subt">Tableau de bord · Nancy</div>
                  </div>
                  <div className="lp-mock-delta">▲ +23%</div>
                </div>
                <div className="lp-mock-stat"><b>1 248</b><span>scans ce mois-ci</span></div>
                <div className="lp-mock-chart">
                  {bars.map((h, i) => <span key={i} style={{ height: `${h}%`, opacity: i === bars.length - 1 ? 1 : 0.5 }} />)}
                </div>
                <div className="lp-mock-kpis">
                  <div className="lp-mock-kpi"><b>42%</b><span>conversion</span></div>
                  <div className="lp-mock-kpi"><b>+37</b><span>avis générés</span></div>
                  <div className="lp-mock-kpi"><b>4,8 ★</b><span>note Google</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* barre de confiance */}
        <div className="lp-trust">
          <span>🇫🇷 Conçu à Nancy</span><i />
          <span>Sans engagement</span><i />
          <span>Données hébergées en France</span><i />
          <span>0 application à installer</span>
        </div>
      </header>

      {/* PROBLÈME */}
      <section className="lp-sec lp-sec-narrow">
        <div className="lp-eyebrow">Le constat</div>
        <h2 className="lp-h2">Vos meilleurs clients ne laissent presque jamais d'avis.</h2>
        <div className="lp-problem">
          <p className="lp-p">
            Chercher votre fiche, se connecter, écrire… c'est trop pénible, alors ils oublient. Et pendant ce temps,
            un commerce excellent reste invisible face à un concurrent moins bon mais mieux noté.
          </p>
          <div className="lp-bigstat">
            <div className="lp-bigstat-n">83%</div>
            <div className="lp-bigstat-l">des clients consultent vos avis Google avant de pousser votre porte.</div>
          </div>
        </div>
      </section>

      {/* FONCTIONNEMENT */}
      <section className="lp-sec" id="fonctionnement">
        <div className="lp-eyebrow lp-center">Comment ça marche</div>
        <h2 className="lp-h2 lp-center">Un geste. Cinq secondes. Un avis.</h2>
        <div className="lp-steps">
          {[
            { n: "1", t: "Le client approche son téléphone", p: "En sans contact (NFC) ou via le QR code imprimé sur la carte. Aucune application, sur tous les smartphones." },
            { n: "2", t: "Votre page Google s'ouvre", p: "Directement, en une fraction de seconde. Il n'a plus qu'à mettre ses étoiles." },
            { n: "3", t: "Il publie son avis", p: "Un avis récent de plus, et un scan compté dans votre tableau de bord." },
          ].map((s, i) => (
            <div className="lp-step" key={i}>
              <div className="lp-step-num">{s.n}</div>
              <h3 className="lp-card-t">{s.t}</h3>
              <p className="lp-card-p">{s.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DÉMO PRODUIT (remontée) */}
      <section className="lp-sec" id="demo">
        <div className="lp-demo">
          <div className="lp-demo-text">
            <div className="lp-eyebrow">Ce que personne d'autre ne fait</div>
            <h2 className="lp-h2">Vous saurez si ça marche. Pas si vous le croyez.</h2>
            <p className="lp-p">
              La plupart des cartes se contentent de rediriger vers Google. BoostRepu compte chaque scan et mesure
              combien d'avis en découlent réellement. Vous voyez le vrai chiffre, en direct.
            </p>
            <ul className="lp-demo-list">
              <li><Check /> Le nombre exact de scans de votre carte</li>
              <li><Check /> Le taux de conversion scan → avis</li>
              <li><Check /> La progression semaine après semaine</li>
            </ul>
            <button onClick={openContact} className="lp-btn lp-btn-primary">Voir une démonstration</button>
          </div>
          <div className="lp-demo-visual">
            <div className="lp-demo-kpi"><span className="lp-demo-kpi-n">1 248</span><span className="lp-demo-kpi-l">scans ce mois</span></div>
            <div className="lp-demo-kpi featured"><span className="lp-demo-kpi-n">42%</span><span className="lp-demo-kpi-l">conversion en avis</span></div>
            <div className="lp-demo-kpi"><span className="lp-demo-kpi-n">+37</span><span className="lp-demo-kpi-l">avis générés</span></div>
            <div className="lp-demo-kpi"><span className="lp-demo-kpi-n">4,8★</span><span className="lp-demo-kpi-l">note moyenne</span></div>
          </div>
        </div>
      </section>

      {/* OUTIL — fonctionnalités */}
      <section className="lp-sec" id="outil">
        <div className="lp-eyebrow lp-center">Votre espace personnel</div>
        <h2 className="lp-h2 lp-center">Bien plus qu'une carte : un vrai outil de pilotage.</h2>
        <div className="lp-feats">
          {features.map((f, i) => (
            <div className="lp-feat" key={i}>
              <div className="lp-feat-ic"><FeatIcon d={f.d} /></div>
              <h3 className="lp-card-t">{f.t}</h3>
              <p className="lp-card-p">{f.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COACHING (nouveau, met en avant les features intelligentes) */}
      <section className="lp-sec">
        <div className="lp-eyebrow lp-center">Votre coach réputation</div>
        <h2 className="lp-h2 lp-center">L'outil ne se contente pas de mesurer. Il vous guide.</h2>
        <div className="lp-feats lp-feats-4">
          {coaching.map((f, i) => (
            <div className="lp-feat lp-feat-coach" key={i}>
              <div className="lp-feat-ic violet"><FeatIcon d={f.d} /></div>
              <h3 className="lp-card-t">{f.t}</h3>
              <p className="lp-card-p">{f.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NFC + QR */}
      <section className="lp-sec lp-sec-narrow">
        <div className="lp-eyebrow lp-center">Sans contact ou QR code</div>
        <h2 className="lp-h2 lp-center">Une carte, deux façons de laisser un avis.</h2>
        <div className="lp-duo">
          <div className="lp-duo-card">
            <div className="lp-duo-emo">📲</div>
            <h3 className="lp-card-t">Le sans contact (NFC)</h3>
            <p className="lp-card-p">Le client approche son téléphone de la carte : votre page d'avis s'ouvre instantanément. La méthode la plus rapide, compatible avec la grande majorité des smartphones.</p>
          </div>
          <div className="lp-duo-card">
            <div className="lp-duo-emo">📷</div>
            <h3 className="lp-card-t">Le QR code</h3>
            <p className="lp-card-p">Un QR code est imprimé sur chaque carte. Pour les téléphones sans puce NFC, le client l'ouvre avec son appareil photo. Personne n'est laissé de côté.</p>
          </div>
        </div>
        <p className="lp-note lp-center">Les deux mènent à la même page, et chaque scan est compté — quelle que soit la méthode.</p>
      </section>

      {/* TARIFS */}
      <section className="lp-sec" id="tarifs">
        <div className="lp-eyebrow lp-center">Tarifs</div>
        <h2 className="lp-h2 lp-center">Simple, et sans engagement.</h2>
        <p className="lp-p lp-center" style={{ maxWidth: "52ch", margin: "0 auto 8px" }}>La carte une fois pour toutes, l'outil au mois. Vous arrêtez quand vous voulez.</p>
        <div className="lp-prices">
          <div className="lp-price-card">
            <div className="lp-price-head"><h3 className="lp-price-name">La carte</h3><p className="lp-price-sub">Paiement unique</p></div>
            <div className="lp-price"><span className="lp-price-num">39 €</span><span className="lp-price-per">une fois</span></div>
            <div className="lp-price-list">
              <div className="lp-check"><Check /> Carte NFC + QR code à votre nom</div>
              <div className="lp-check"><Check /> Prête à l'emploi immédiatement</div>
              <div className="lp-check"><Check /> Réutilisable à l'infini</div>
            </div>
            <button onClick={openContact} className="lp-btn lp-btn-ghost lp-btn-block">Nous contacter</button>
          </div>
          <div className="lp-price-card featured">
            <span className="lp-price-badge"><Sparkle /> Le plus complet</span>
            <div className="lp-price-head"><h3 className="lp-price-name">L'abonnement</h3><p className="lp-price-sub">Le tableau de bord + l'assistant IA</p></div>
            <div className="lp-price"><span className="lp-price-num">15 €</span><span className="lp-price-per">/ mois · sans engagement</span></div>
            <div className="lp-price-list">
              <div className="lp-check"><Check /> Suivi des scans et de la conversion</div>
              <div className="lp-check"><Check /> Coaching : objectif, alertes, fraîcheur</div>
              <div className="lp-check"><Check /> Analyse, réponses et visuels illimités</div>
              <div className="lp-check"><Check /> Résiliable à tout moment</div>
            </div>
            <button onClick={openContact} className="lp-btn lp-btn-primary lp-btn-block">Nous contacter</button>
          </div>
        </div>
        <p className="lp-note lp-center">Un seul client supplémentaire dans le mois, et votre abonnement est déjà rentabilisé.</p>
      </section>

      {/* SEO LOCAL */}
      <section className="lp-sec lp-sec-narrow">
        <div className="lp-eyebrow">Nancy &amp; Grand Est</div>
        <h2 className="lp-h2">La carte d'avis Google pensée pour les commerçants de Nancy.</h2>
        <p className="lp-p">
          BoostRepu accompagne les commerçants, restaurateurs et artisans de Nancy et de son agglomération —
          Vandœuvre, Laxou, Maxéville, Villers-lès-Nancy, Saint-Max — pour transformer leurs clients satisfaits en
          avis Google. La carte se pose sur le comptoir : le client approche son téléphone, votre page d'avis
          s'ouvre, et il laisse son évaluation en quelques secondes.
        </p>
        <p className="lp-p">
          Contrairement à une simple carte ou un QR code, BoostRepu mesure combien de fois votre carte est scannée
          et combien d'avis elle génère réellement. Une solution locale, installée et accompagnée sur place dans
          tout le Grand Est.
        </p>
      </section>

      {/* FAQ */}
      <section className="lp-sec lp-sec-narrow" id="faq">
        <div className="lp-eyebrow lp-center">Questions fréquentes</div>
        <h2 className="lp-h2 lp-center">Tout ce que vous vous demandez.</h2>
        <div className="lp-faq">
          <details><summary>Est-ce que c'est légal / autorisé par Google ?</summary><p>Oui, totalement. Ce sont vos vrais clients qui laissent un vrai avis — on leur simplifie juste le geste. Aucun faux avis, aucune manipulation : c'est parfaitement conforme aux règles de Google.</p></details>
          <details><summary>Mes clients doivent-ils installer une application ?</summary><p>Non. Ils approchent leur téléphone de la carte, et leur navigateur s'ouvre sur votre page d'avis. Un QR code est aussi présent en secours.</p></details>
          <details><summary>J'ai déjà un QR code pour mes avis, quelle différence ?</summary><p>Un QR code classique renvoie vers votre page Google, et c'est tout. BoostRepu fait la même chose, mais compte chaque scan, mesure combien d'avis en découlent, rédige vos réponses et vous dit quoi améliorer. Vous pouvez même garder votre QR code : BoostRepu s'ajoute par-dessus.</p></details>
          <details><summary>Ça marche sur tous les téléphones ?</summary><p>Le sans contact (NFC) fonctionne sur la très grande majorité des smartphones récents. Pour les rares exceptions, le QR code prend le relais.</p></details>
          <details><summary>Y a-t-il un engagement ?</summary><p>Aucun. La carte est un achat unique, et l'abonnement est résiliable quand vous le souhaitez. Vous êtes aussi couvert par notre garantie satisfait ou remboursé de 14 jours.</p></details>
          <details><summary>Comment se passe l'installation ?</summary><p>On configure votre carte et votre tableau de bord à votre nom. Vous n'avez plus qu'à poser la carte sur votre comptoir. Contactez-nous, on s'occupe de tout.</p></details>
          <details><summary>Et mes données ?</summary><p>Vos données restent les vôtres. Nous suivons uniquement les scans de votre carte et les avis que vous choisissez d'analyser. Rien n'est revendu.</p></details>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="lp-sec">
        <div className="lp-cta">
          <span className="lp-glow lp-glow-3" />
          <div className="lp-eyebrow lp-center" style={{ color: "#d6c8ff", position: "relative" }}>On se lance ?</div>
          <h2 className="lp-h2 lp-center" style={{ color: "#fff", marginTop: 6, position: "relative" }}>Votre réputation mérite mieux que le hasard.</h2>
          <p className="lp-p lp-center" style={{ color: "#cdbcf5", maxWidth: "52ch", margin: "10px auto 24px", position: "relative" }}>Équipez votre commerce aujourd'hui et commencez à récolter des avis dès demain.</p>
          <div style={{ position: "relative", textAlign: "center" }}>
            <button onClick={openContact} className="lp-btn lp-btn-light lp-btn-lg">Nous contacter</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div>
            <Logo />
            <p style={{ marginTop: 12, maxWidth: "34ch", color: "#9b93c9" }}>La carte qui récolte vos avis Google, et le logiciel qui vous dit quoi en faire.</p>
          </div>
          <div className="lp-footer-contact">
            <p><a href={tel}>{CONTACT_TEL}</a></p>
            <p><a href={mail}>{CONTACT_EMAIL}</a></p>
            <p style={{ marginTop: 10 }}>
              <a href="/blog">Blog</a> · <a href="/mentions-legales">Mentions légales</a> · <a href="/cgv">CGV</a> · <a href="/confidentialite">Confidentialité</a>
            </p>
            <p style={{ opacity: 0.5, marginTop: 10 }}>© {new Date().getFullYear()} BoostRepu · une marque MMAxis</p>
          </div>
        </div>
      </footer>

      {/* BOX CONTACT */}
      {contactOpen && (
        <div className="lp-modal-overlay" onClick={() => setContactOpen(false)}>
          <div className="lp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="lp-modal-close" onClick={() => setContactOpen(false)} aria-label="Fermer">×</button>
            <Logo />
            <h3 className="lp-modal-t">Parlons-en</h3>
            <p className="lp-modal-p">Appelez ou écrivez-moi, je vous réponds vite et je m'occupe de tout mettre en place.</p>
            <a href={tel} className="lp-modal-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
              <span><b>{CONTACT_TEL}</b><small>Appeler</small></span>
            </a>
            <a href={mail} className="lp-modal-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg>
              <span><b>{CONTACT_EMAIL}</b><small>Envoyer un e-mail</small></span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
