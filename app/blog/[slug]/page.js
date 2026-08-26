import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, getArticle } from "@/lib/articles";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }) {
  const a = getArticle(params.slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    keywords: a.keywords,
    alternates: { canonical: `https://boostrepu.fr/blog/${a.slug}` },
    openGraph: {
      type: "article",
      title: a.title,
      description: a.description,
      url: `https://boostrepu.fr/blog/${a.slug}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
  };
}

export default function Article({ params }) {
  const a = getArticle(params.slug);
  if (!a) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    dateModified: a.date,
    author: { "@type": "Organization", name: "BoostRepu" },
    publisher: {
      "@type": "Organization",
      name: "BoostRepu",
      logo: { "@type": "ImageObject", url: "https://boostrepu.fr/icon-512.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://boostrepu.fr/blog/${a.slug}` },
    image: "https://boostrepu.fr/og-image.png",
  };

  const dateFr = new Date(a.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="lp">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="lp-hero">
        <span className="lp-orb lp-orb-1" />
        <div className="lp-hero-inner">
          <Link href="/blog" className="article-back">← Tous les articles</Link>
          <h1 className="lp-h1" style={{ marginTop: 14 }}>{a.title}</h1>
          <p className="lp-lead" style={{ marginTop: 14 }}>{dateFr} · {a.readingTime} min de lecture</p>
        </div>
      </header>

      <article className="lp-sec article-body">
        {a.body.map((block, i) => {
          if (block.h2) return <h2 key={i} className="article-h2">{block.h2}</h2>;
          if (block.cta) {
            return (
              <div key={i} className="article-cta">
                <p>{block.cta}</p>
                <a href="mailto:contact@boostrepu.fr?subject=Demande%20d'information%20BoostRepu" className="lp-btn lp-btn-primary" style={{ display: "inline-block", textDecoration: "none", marginTop: 12 }}>
                  Nous contacter
                </a>
              </div>
            );
          }
          return <p key={i} className="article-p">{block.p}</p>;
        })}
      </article>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <span className="lp-footer-brand">BoostRepu</span>
          <nav className="lp-footer-links" style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            <Link href="/">Accueil</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/mentions-legales">Mentions légales</Link>
          </nav>
          <span style={{ opacity: 0.55 }}>© {new Date().getFullYear()} BoostRepu · une marque MMAxis</span>
        </div>
      </footer>
    </div>
  );
}
