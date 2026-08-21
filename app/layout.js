import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://boostrepu.fr"),
  title: {
    default: "BoostRepu — Carte NFC avis Google pour commerçants à Nancy",
    template: "%s · BoostRepu",
  },
  description:
    "Obtenez plus d'avis Google grâce à une carte NFC posée sur votre comptoir. Suivi des scans, taux de conversion et réponses IA. Installé chez vous à Nancy et dans le Grand Est.",
  keywords: [
    "carte avis Google", "carte NFC Google", "carte NFC avis", "améliorer ses avis Google",
    "plus d'avis Google", "avis Google commerçant", "carte avis Nancy", "avis Google Nancy",
    "réputation en ligne Nancy", "carte NFC Grand Est", "obtenir des avis Google",
  ],
  authors: [{ name: "MMAxis" }],
  creator: "MMAxis",
  publisher: "BoostRepu",
  applicationName: "BoostRepu",
  manifest: "/api/manifest",
  alternates: { canonical: "https://boostrepu.fr" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://boostrepu.fr",
    siteName: "BoostRepu",
    title: "BoostRepu — La carte NFC qui booste vos avis Google",
    description:
      "Une carte à poser sur votre comptoir, un scan de 5 secondes, et un tableau de bord qui suit vos avis Google. Pour les commerçants de Nancy et du Grand Est.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BoostRepu — carte NFC avis Google" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BoostRepu — Carte NFC avis Google",
    description: "Plus d'avis Google pour les commerçants de Nancy et du Grand Est.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  appleWebApp: { capable: true, title: "BoostRepu", statusBarStyle: "black-translucent" },
  icons: {
    icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  formatDetection: { telephone: false },
};

export const viewport = {
  themeColor: "#0f1024",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://boostrepu.fr/#business",
    name: "BoostRepu",
    legalName: "MMAxis",
    description:
      "Carte NFC et tableau de bord pour aider les commerçants à obtenir et suivre leurs avis Google.",
    url: "https://boostrepu.fr",
    email: "contact@boostrepu.fr",
    telephone: "+33777760772",
    priceRange: "€€",
    areaServed: [
      { "@type": "City", name: "Nancy" },
      { "@type": "AdministrativeArea", name: "Meurthe-et-Moselle" },
      { "@type": "AdministrativeArea", name: "Grand Est" },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nancy",
      addressRegion: "Grand Est",
      postalCode: "54000",
      addressCountry: "FR",
    },
    sameAs: [
      "https://www.instagram.com/boostrepu",
      "https://www.facebook.com/boostrepu",
      "https://www.linkedin.com/company/boostrepu",
    ],
  };

  return (
    <html lang="fr">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
