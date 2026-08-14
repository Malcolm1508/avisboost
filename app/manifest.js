export default function manifest() {
  return {
    name: "BoostRepu — Vos avis Google",
    short_name: "BoostRepu",
    description: "Suivez vos scans, vos avis Google et votre réputation en direct.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0f1024",
    theme_color: "#0f1024",
    lang: "fr",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
