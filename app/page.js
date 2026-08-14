export default function Home() {
  return (
    <>
      <div className="hero"><div className="hero-inner">
        <div className="eyebrow"><span className="dot"></span>BoostRepu</div>
        <h1 className="hero-title">BoostRepu</h1>
        <p className="hero-sub">
          Le système pour obtenir, comprendre et exploiter vos avis Google.
        </p>
      </div></div>

      <div className="container pull-up">
        <div className="card reveal" style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 className="card-title" style={{ marginBottom: 14 }}>Espace de gestion</h2>
          <p className="card-hint" style={{ marginBottom: 18 }}>
            Vous êtes commerçant ? Utilisez l'adresse personnelle qui vous a été remise lors de l'installation.
          </p>
          <a href="/admin" className="btn btn-primary btn-icon" style={{ display: "inline-flex", textDecoration: "none" }}>
            Accéder à l'espace admin
          </a>
          <p className="footnote" style={{ marginTop: 20 }}>
            BoostRepu est une marque exploitée par MMAxis.
          </p>
        </div>
      </div>
    </>
  );
}
