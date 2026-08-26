import Link from "next/link";
import { ARTICLES } from "@/lib/articles";

export const metadata = {
  title: "Blog — Conseils avis Google pour commerçants",
  description:
    "Conseils pratiques pour obtenir plus d'avis Google, améliorer sa réputation en ligne et développer son commerce à Nancy et dans le Grand Est.",
  alternates: { canonical: "https://boostrepu.fr/blog" },
};

export default function Blog() {
  const sorted = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="lp">
      <header className="lp-hero">
        <span className="lp-orb lp-orb-1" />
        <div className="lp-hero-inner">
          <span className="lp-ai-pill">Le blog BoostRepu</span>
          <h1 className="lp-h1">Conseils avis Google<br />pour les commerçants</h1>
          <p className="lp-lead" style={{ marginTop: 16 }}>
            Tout ce qu'il faut savoir pour obtenir plus d'avis Google et développer votre commerce à Nancy et dans le Grand Est.
          </p>
        </div>
      </header>

      <section className="lp-sec">
        <div className="blog-grid">
          {sorted.map((a) => (
            <Link key={a.slug} href={`/blog/${a.slug}`} className="blog-card">
              <div className="blog-card-body">
                <div className="blog-card-meta">{a.readingTime} min de lecture</div>
                <h2 className="blog-card-title">{a.title}</h2>
                <p className="blog-card-desc">{a.description}</p>
                <span className="blog-card-link">Lire l'article →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <span className="lp-footer-brand">BoostRepu</span>
          <nav className="lp-footer-links" style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            <Link href="/">Accueil</Link>
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/cgv">CGV</Link>
            <Link href="/confidentialite">Confidentialité</Link>
          </nav>
          <span style={{ opacity: 0.55 }}>© {new Date().getFullYear()} BoostRepu · une marque MMAxis</span>
        </div>
      </footer>
    </div>
  );
}
