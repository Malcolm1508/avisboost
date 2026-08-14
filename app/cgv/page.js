export const metadata = { title: "Conditions générales de vente — BoostRepu" };

export default function CGV() {
  return (
    <>
      <div className="hero"><div className="hero-inner">
        <div className="eyebrow"><span className="dot"></span>BoostRepu</div>
        <h1 className="hero-title">Conditions générales de vente</h1>
      </div></div>

      <div className="container pull-up">
        <div className="card reveal" style={{ maxWidth: 760, margin: "0 auto", lineHeight: 1.7 }}>
          <h2 className="card-title">1. Objet</h2>
          <p>
            Les présentes conditions régissent la vente, par BoostRepu (À COMPLÉTER — SIRET), à des clients
            professionnels, d'une carte NFC et d'un abonnement à un service logiciel en ligne de suivi et de gestion
            de la réputation Google.
          </p>

          <h2 className="card-title" style={{ marginTop: 24 }}>2. Prestations</h2>
          <p>
            <b>La carte NFC</b> : support physique programmé pour rediriger le client final vers la page d'avis Google
            de l'établissement, vendue au prix unitaire de 30 € TTC, payable en une fois.<br /><br />
            <b>L'abonnement</b> : accès à un tableau de bord en ligne comprenant le comptage des scans, l'historique,
            le suivi de conversion, l'analyse des avis, la génération de réponses et de visuels, au prix de 15 € TTC
            par mois et par établissement.
          </p>

          <h2 className="card-title" style={{ marginTop: 24 }}>3. Commande et paiement</h2>
          <p>
            La commande est validée lors du paiement. Les paiements sont traités par Stripe Payments Europe Ltd.
            L'abonnement est prélevé automatiquement chaque mois à date anniversaire. Une facture est adressée par
            e-mail à chaque échéance. TVA non applicable, article 293 B du CGI.
          </p>

          <h2 className="card-title" style={{ marginTop: 24 }}>4. Durée et résiliation</h2>
          <p>
            L'abonnement est conclu sans engagement de durée. Le client peut y mettre fin à tout moment ; la
            résiliation prend effet à la fin de la période mensuelle en cours, sans remboursement au prorata. La carte
            NFC demeure la propriété du client et continue de fonctionner comme simple lien de redirection.
            L'éditeur peut résilier en cas de manquement grave, notamment en cas d'usage contraire à l'article 6.
          </p>

          <h2 className="card-title" style={{ marginTop: 24 }}>5. Livraison et mise en service</h2>
          <p>
            La carte est remise et programmée en main propre, ou expédiée sous 7 jours ouvrés. Les accès au tableau
            de bord sont fournis lors de la mise en service. Le client est responsable de la confidentialité de son
            mot de passe.
          </p>

          <h2 className="card-title" style={{ marginTop: 24 }}>6. Obligations du client</h2>
          <p>
            Le client s'engage à utiliser le service dans le respect des règles de Google relatives aux avis. Il
            s'interdit notamment de rémunérer ou de récompenser un avis, de publier de faux avis, et de filtrer ou
            trier les clients avant redirection. Le service ne permet aucune de ces pratiques et ne saurait être
            détourné à cette fin.
          </p>

          <h2 className="card-title" style={{ marginTop: 24 }}>7. Garanties et responsabilité</h2>
          <p>
            BoostRepu fournit un outil de mesure et d'aide à l'action. Aucun résultat chiffré, en nombre d'avis, en
            note ou en positionnement sur Google, n'est garanti. Le service dépend de la disponibilité de
            prestataires tiers (Google, Vercel, Upstash) dont les interruptions ne peuvent engager la responsabilité
            de l'éditeur. La responsabilité de l'éditeur est en tout état de cause limitée aux sommes effectivement
            versées par le client au cours des douze derniers mois.
          </p>

          <h2 className="card-title" style={{ marginTop: 24 }}>8. Droit de rétractation</h2>
          <p>
            Les présentes conditions s'adressent à des professionnels agissant dans le cadre de leur activité. Le
            droit de rétractation prévu par le Code de la consommation ne s'applique pas, sauf dans les cas où le
            client emploie moins de six salariés et où l'objet du contrat n'entre pas dans le champ de son activité
            principale ; il dispose alors de quatorze jours pour se rétracter.
          </p>

          <h2 className="card-title" style={{ marginTop: 24 }}>9. Données personnelles</h2>
          <p>
            Le traitement des données est décrit dans la politique de confidentialité, accessible sur le site.
          </p>

          <h2 className="card-title" style={{ marginTop: 24 }}>10. Droit applicable et litiges</h2>
          <p>
            Les présentes sont soumises au droit français. En cas de litige, les parties rechercheront une solution
            amiable avant toute action judiciaire. À défaut, compétence est attribuée aux tribunaux du ressort du
            siège de l'éditeur.
          </p>

          <p className="footnote" style={{ marginTop: 24 }}>Dernière mise à jour : août 2026.</p>
        </div>
      </div>
    </>
  );
}
