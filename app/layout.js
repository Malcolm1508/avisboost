import "./globals.css";

export const metadata = {
  title: "AvisBoost",
  description: "Collecte d'avis Google + réponses IA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
