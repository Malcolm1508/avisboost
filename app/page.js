// ⬇️ REMPLACE ces 2 valeurs par tes vraies coordonnées
const CONTACT_EMAIL = "ton-email@exemple.com";
const CONTACT_TEL = "+33600000000";

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
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Sparkle() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8z" />
    </svg>
  );
}

export default function Home() {
  const mail = `mailto:${CONTACT_EMAIL}?subject=Demande%20d'information%20BoostRepu`;
  const tel = `tel:${CONTACT_TEL}`;

  return (
    <div className="lp">
      {/* NAV */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <a href="/" className="lp-brand"><Logo /></a>
          <div className="lp-links">
            <a className="lp-navlink" href="#fonctionnement">Fonctionnement</a>
            <a className="lp-navlink" href="#outil">L'outil</a>
            <a className="lp-navlink" href="#tarifs">Tarifs</a>
            <a className="lp-navlink" href="#faq">FAQ</a>
            <a href={mail} className="lp-btn lp-btn-primary" style={{ padding: "9px 18px", fontSize: 14 }}>Nous contacter</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="lp-hero">
        <span className="lp-orb lp-orb-1" />
        <span className="lp-orb lp-orb-2" />
        <div className="lp-hero-inner">
          <div>
            <span className="lp-ai-pill"><Sparkle /> Propulsé par l'intelligence artificielle</span>
            <h1 className="lp-h1">Transformez chaque client satisfait en <span className="lp-grad">avis Google</span>.</h1>
            <p className="lp-lead">Une carte à poser sur votre comptoir, un scan de 5 secondes, et un tableau de bord intelligent qui suit vos avis et vous dit quoi améliorer.</p>
            <div className="lp-hero-btns">
              <a href={mail} className="lp-btn lp-btn-primary">Nous contacter</a>
              <a href="#tarifs" className="lp-btn lp-btn-outline">Voir les tarifs</a>
            </div>
          </div>
          <div className="lp-shot" style={{ backgroundImage: "url('/produit.jpg')" }}>
            <span className="lp-shot-badge">Carte NFC BoostRepu</span>
          </div>
        </div>
      </header>

      {/* STRIP */}
      <div className="lp-strip">
        <div className="lp-strip-inner">
          <div className="it"><b>5 sec</b><span>pour laisser un avis</span></div>
          <div className="it"><b>0 appli</b><span>à installer pour le client</span></div>
          <div className="it"><b>9/10</b><span>clients lisent les avis</span></div>
          <div className="it"><b>Sans engagement</b><span>résiliable à tout moment</span></div>
        </div>
      </div>

      {/* PROBLÈME */}
      <section className="lp-sec">
        <div className="lp-eyebrow">Le constat</div>
        <h2 className="lp-h2">Vos meilleurs clients ne laissent presque jamais d'avis</h2>
        <p className="lp-p">C'est trop pénible : chercher votre fiche, se connecter, écrire… ils oublient. Résultat, un commerce excellent peut rester invisible face à un concurrent mieux noté. BoostRepu supprime cette friction — et vous donne les outils pour exploiter chaque avis.</p>
      </section>

      {/* FONCTIONNEMENT */}
      <div className="lp-band">
        <section className="lp-sec" id="fonctionnement">
          <div className="lp-eyebrow">Comment ça marche</div>
          <h2 className="lp-h2">Un geste. Cinq secondes. Un avis.</h2>
          <div className="lp-grid g3">
            <div className="lp-card">
              <div className="lp-step-n">1</div>
              <h3 className="lp-card-t">Le client approche son téléphone</h3>
              <p className="lp-card-p">Pas d'application, rien à installer. Ça marche sur quasiment tous les smartphones.</p>
            </div>
            <div className="lp-card">
              <div className="lp-step-n">2</div>
              <h3 className="lp-card-t">Votre page d'avis Google s'ouvre</h3>
              <p className="lp-card-p">Directement, en une fraction de seconde. Il n'a plus qu'à écrire.</p>
            </div>
            <div className="lp-card">
              <div className="lp-step-n">3</div>
              <h3 className="lp-card-t">Il met 5 étoiles et publie</h3>
              <p className="lp-card-p">Un avis récent de plus, et un scan compté dans votre tableau de bord.</p>
            </div>
          </div>
        </section>
      </div>

      {/* OUTIL / FEATURES */}
      <section className="lp-sec" id="outil">
        <div className="lp-eyebrow">Votre espace personnel</div>
        <h2 className="lp-h2">Bien plus qu'une carte : un vrai outil de pilotage</h2>
        <p className="lp-p">Chaque carte est reliée à un tableau de bord privé, à votre nom, avec votre logo. Vous y suivez tout, et un assistant IA vous fait gagner un temps précieux.</p>
        <div className="lp-grid g3">
          <div className="lp-card">
            <div className="lp-feat-ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M7 14l3-4 3 3 4-6"/></svg></div>
            <h3 className="lp-card-t">Suivi des scans</h3>
            <p className="lp-card-p">Combien de personnes scannent, par jour, par mois, avec la progression dans le temps.</p>
          </div>
          <div className="lp-card">
            <div className="lp-feat-ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg></div>
            <h3 className="lp-card-t">Taux de conversion</h3>
            <p className="lp-card-p">Voyez précisément combien de scans se transforment en avis.</p>
          </div>
          <div className="lp-card">
            <div className="lp-feat-ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg></div>
            <h3 className="lp-card-t">Analyse des avis par IA</h3>
            <p className="lp-card-p">L'IA ressort les points forts et les points faibles qui reviennent.</p>
          </div>
          <div className="lp-card">
            <div className="lp-feat-ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
            <h3 className="lp-card-t">Plan d'action</h3>
            <p className="lp-card-p">Vos priorités concrètes de la semaine, à cocher au fur et à mesure.</p>
          </div>
          <div className="lp-card">
            <div className="lp-feat-ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
            <h3 className="lp-card-t">Réponses aux avis</h3>
            <p className="lp-card-p">Une réponse personnalisée et professionnelle en un clic.</p>
          </div>
          <div className="lp-card">
            <div className="lp-feat-ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>
            <h3 className="lp-card-t">Visuels prêts à poster</h3>
            <p className="lp-card-p">Transformez un bel avis en image pour Instagram, Facebook ou votre site.</p>
          </div>
        </div>
      </section>

      {/* TARIFS */}
      <div className="lp-band">
        <section className="lp-sec" id="tarifs">
          <div className="lp-eyebrow">Tarifs</div>
          <h2 className="lp-h2">Simple, et sans engagement</h2>
          <p className="lp-p">La carte une fois pour toutes, l'outil au mois. Vous arrêtez quand vous voulez. Pas d'achat en ligne : contactez-nous, on configure tout pour vous.</p>
          <div className="lp-prices">
            <div className="lp-price-card">
              <div className="lp-price-head">
                <h3 className="lp-price-name">La carte</h3>
                <p className="lp-price-sub">Paiement unique</p>
              </div>
              <div className="lp-price"><span className="lp-price-num">39 €</span><span className="lp-price-per">une fois</span></div>
              <div className="lp-price-list">
                <div className="lp-check"><Check /> Carte NFC programmée à votre nom</div>
                <div className="lp-check"><Check /> Prête à l'emploi immédiatement</div>
                <div className="lp-check"><Check /> Réutilisable à l'infini</div>
              </div>
              <a href={mail} className="lp-btn lp-btn-ghost lp-btn-block">Nous contacter</a>
            </div>

            <div className="lp-price-card featured">
              <span className="lp-price-badge"><Sparkle /> Le plus complet</span>
              <div className="lp-price-head">
                <h3 className="lp-price-name">L'abonnement</h3>
                <p className="lp-price-sub">Le tableau de bord + l'assistant IA</p>
              </div>
              <div className="lp-price"><span className="lp-price-num">15 €</span><span className="lp-price-per">/ mois · sans engagement</span></div>
              <div className="lp-price-list">
                <div className="lp-check"><Check /> Suivi des scans et de la conversion</div>
                <div className="lp-check"><Check /> Analyse et plan d'action IA</div>
                <div className="lp-check"><Check /> Réponses et visuels illimités</div>
                <div className="lp-check"><Check /> Résiliable à tout moment</div>
              </div>
              <a href={mail} className="lp-btn lp-btn-primary lp-btn-block">Nous contacter</a>
            </div>
          </div>
          <p className="lp-note">Un seul client supplémentaire dans le mois, et votre abonnement est déjà rentabilisé.</p>
        </section>
      </div>

      {/* FAQ */}
      <section className="lp-sec" id="faq">
        <div className="lp-eyebrow" style={{ justifyContent: "center" }}>Questions fréquentes</div>
        <h2 className="lp-h2" style={{ textAlign: "center" }}>Tout ce que vous vous demandez</h2>
        <div className="lp-faq">
          <details>
            <summary>Est-ce que c'est légal / autorisé par Google ?</summary>
            <p>Oui, totalement. Ce sont vos vrais clients qui laissent un vrai avis — on leur simplifie juste le geste. Aucun faux avis, aucune manipulation : c'est parfaitement conforme aux règles de Google.</p>
          </details>
          <details>
            <summary>Mes clients doivent-ils installer une application ?</summary>
            <p>Non. Ils approchent simplement leur téléphone de la carte, et leur navigateur s'ouvre sur votre page d'avis. Un QR code est aussi présent en secours.</p>
          </details>
          <details>
            <summary>Ça marche sur tous les téléphones ?</summary>
            <p>Le sans-contact (NFC) fonctionne sur la très grande majorité des smartphones récents. Pour les rares exceptions, le QR code prend le relais.</p>
          </details>
          <details>
            <summary>Y a-t-il un engagement ?</summary>
            <p>Aucun. La carte est un achat unique, et l'abonnement au tableau de bord est résiliable quand vous le souhaitez.</p>
          </details>
          <details>
            <summary>Comment se passe l'installation ?</summary>
            <p>On configure votre carte et votre tableau de bord à votre nom. Vous n'avez plus qu'à poser la carte sur votre comptoir. Contactez-nous, on s'occupe de tout.</p>
          </details>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="lp-sec">
        <div className="lp-cta">
          <span className="lp-orb lp-orb-3" />
          <div className="lp-eyebrow" style={{ color: "#d6c8ff", justifyContent: "center", position: "relative" }}>On se lance ?</div>
          <h2 className="lp-h2" style={{ color: "#fff", marginTop: 6, position: "relative" }}>Votre réputation mérite mieux que le hasard</h2>
          <p style={{ color: "#cdbcf5", fontSize: 18, maxWidth: "52ch", margin: "10px auto 24px", position: "relative" }}>Équipez votre commerce aujourd'hui et commencez à récolter des avis dès demain.</p>
          <a href={mail} className="lp-btn lp-btn-light" style={{ position: "relative" }}>Nous contacter</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div>
            <Logo />
            <p style={{ marginTop: 10, maxWidth: "34ch" }}>La carte qui récolte vos avis Google, et le logiciel qui vous dit quoi en faire.</p>
          </div>
          <div className="lp-footer-contact">
            <p><a href={mail}>{CONTACT_EMAIL}</a></p>
            <p><a href={tel}>{CONTACT_TEL}</a></p>
            <p style={{ opacity: 0.55, marginTop: 10 }}>© {new Date().getFullYear()} BoostRepu</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
