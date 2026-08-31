export const metadata = { title: "Politique de confidentialité — BoostRepu" };

export default function Confidentialite() {
  return (
    <>
      <div className="hero"><div className="hero-inner">
        <div className="eyebrow"><span className="dot"></span>BoostRepu</div>
        <h1 className="hero-title">Politique de confidentialité</h1>
      </div></div>

      <div className="container pull-up">
        <div className="card reveal" style={{ maxWidth: 760, margin: "0 auto", lineHeight: 1.7 }}>
        <h2 className="card-title">Responsable du traitement</h2>
          <p>
            <b>MMAxis</b> — Malcolm Malglaive — 911824753 — contact : contact@boostrepu.fr.<br />
            Le traitement est mis en œuvre dans le cadre du service BoostRepu, édité par MMAxis.
          </p>

          <h2 className="card-title" style={{ marginTop: 24 }}>Données collectées</h2>
          <p>
            <b>Concernant le client professionnel</b> : nom de l'établissement, adresse, prénom du dirigeant, activité,
            lien de la fiche Google, mot de passe (stocké sous forme chiffrée, jamais en clair), et les contenus qu'il
            saisit lui-même dans l'outil (avis copiés, nombre d'avis, plan d'action).<br /><br />
            <b>Concernant les personnes qui scannent la carte</b> : aucune donnée personnelle n'est collectée. Seul un
            compteur anonyme est incrémenté ; ni identité, ni adresse IP, ni identifiant publicitaire ne sont
            conservés. Aucun cookie de mesure d'audience n'est déposé.
          </p>

          <h2 className="card-title" style={{ marginTop: 24 }}>Finalités et bases légales</h2>
          <p>
            Les données sont traitées pour fournir le service souscrit et en assurer le suivi (exécution du contrat),
            pour la facturation et la conservation comptable (obligation légale), et pour la sécurité des accès
            (intérêt légitime).
          </p>

          <h2 className="card-title" style={{ marginTop: 24 }}>Cookies</h2>
          <p>
            Un unique cookie strictement nécessaire est déposé lors de la connexion au tableau de bord, afin de
            maintenir la session ouverte pendant trente jours. Il ne sert à aucune finalité publicitaire ou
            statistique, et ne requiert donc pas de consentement préalable.
          </p>

          <h2 className="card-title" style={{ marginTop: 24 }}>Destinataires et sous-traitants</h2>
          <p>
            Vercel Inc. (hébergement), Upstash Inc. (base de données, serveurs situés dans l'Union européenne),
            Stripe Payments Europe Ltd (paiement), Google LLC (service Gemini, pour les fonctions d'analyse et de
            génération de texte). Les contenus transmis à Gemini se limitent aux avis et informations que le client
            saisit volontairement dans l'outil. Aucune donnée n'est vendue ni cédée à des tiers à des fins
            commerciales.
          </p>

          <h2 className="card-title" style={{ marginTop: 24 }}>Durée de conservation</h2>
          <p>
            Les données du compte sont conservées pendant toute la durée de l'abonnement, puis supprimées dans les
            douze mois suivant sa résiliation. Les pièces comptables sont conservées dix ans, conformément à la loi.
          </p>

          <h2 className="card-title" style={{ marginTop: 24 }}>Vos droits</h2>
          <p>
            Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de
            portabilité de vos données. Pour l'exercer, écrivez à À COMPLÉTER (e-mail) ; une réponse vous sera
            apportée sous un mois. Vous pouvez également introduire une réclamation auprès de la CNIL (cnil.fr).
          </p>

          <p className="footnote" style={{ marginTop: 24 }}>Dernière mise à jour : août 2026.</p>
        </div>
      </div>
    </>
  );
}
