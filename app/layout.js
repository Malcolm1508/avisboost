import "./globals.css";

export const metadata = {
  title: "BoostRepu",
  description: "Collecte d'avis Google + réponses IA pour commerçants",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <footer className="site-footer">
          <div className="site-footer-inner">
            <span className="site-footer-brand">BoostRepu</span>
            <nav className="site-footer-links">
              <a href="/mentions-legales">Mentions légales</a>
              <a href="/cgv">CGV</a>
              <a href="/confidentialite">Confidentialité</a>
            </nav>
            <span className="site-footer-copy">© {new Date().getFullYear()} BoostRepu — une marque MMAxis</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
