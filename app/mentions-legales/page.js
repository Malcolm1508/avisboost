export const metadata = { title: "Mentions légales — BoostRepu" };

export default function MentionsLegales() {
  return (
    <>
      <div className="hero"><div className="hero-inner">
        <div className="eyebrow"><span className="dot"></span>BoostRepu</div>
        <h1 className="hero-title">Mentions légales</h1>
      </div></div>

      <div className="container pull-up">
        <div className="card reveal" style={{ maxWidth: 760, margin: "0 auto", lineHeight: 1.7 }}>
          <h2 className="card-title">Éditeur du site</h2>
          <p>
            BoostRepu — entreprise individuelle (micro-entreprise)<br />
            Responsable de la publication : À COMPLÉTER (prénom et nom)<br />
            Adresse : À COMPLÉTER<br />
            SIRET : À COMPLÉTER<br />
            E-mail : À COMPLÉTER<br />
            Téléphone : À COMPLÉTER
          </p>
          <p>TVA non applicable, article 293 B du Code général des impôts.</p>

          <h2 className="card-title" style={{ marginTop: 24 }}>Hébergement</h2>
          <p>
            Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis — vercel.com<br />
            Les données sont stockées via Upstash Inc. (base de données Redis), sur des serveurs situés dans l'Union européenne.
          </p>

          <h2 className="card-title" style={{ marginTop: 24 }}>Propriété intellectuelle</h2>
          <p>
            L'ensemble des contenus de ce site (textes, éléments graphiques, code, marque BoostRepu) est la propriété
            exclusive de l'éditeur, sauf mention contraire. Toute reproduction ou représentation, totale ou partielle,
            sans autorisation écrite préalable est interdite.
          </p>

          <h2 className="card-title" style={{ marginTop: 24 }}>Responsabilité</h2>
          <p>
            L'éditeur s'efforce d'assurer l'exactitude des informations diffusées et la disponibilité du service, sans
            pouvoir garantir l'absence totale d'interruption ou d'erreur. Le service redirige les utilisateurs vers
            Google Maps ; l'éditeur n'est pas responsable du contenu ni de la disponibilité des services de Google.
          </p>

          <h2 className="card-title" style={{ marginTop: 24 }}>Litiges</h2>
          <p>
            Le présent site est soumis au droit français. En cas de litige, et à défaut de résolution amiable, les
            tribunaux compétents seront ceux du ressort du siège de l'éditeur.
          </p>

          <p className="footnote" style={{ marginTop: 24 }}>Dernière mise à jour : août 2026.</p>
        </div>
      </div>
    </>
  );
}
