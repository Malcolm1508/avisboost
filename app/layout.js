import "./globals.css";

export const metadata = {
  title: "BoostRepu",
  description: "Collecte d'avis Google + assistant IA pour commerçants",
  applicationName: "BoostRepu",
  manifest: "/api/manifest",
  appleWebApp: {
    capable: true,
    title: "BoostRepu",
    statusBarStyle: "black-translucent",
  },
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
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
