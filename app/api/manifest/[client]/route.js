import { getClient } from "@/lib/db";

export async function GET(req, { params }) {
  const { client } = await params;
  const c = await getClient(client);

  const name = c?.name || "BoostRepu";
  const short = name.length > 14 ? name.slice(0, 13) + "…" : name;

  const manifest = {
    name: `${name} — BoostRepu`,
    short_name: short,
    description: "Votre tableau de bord BoostRepu : scans, avis et réputation Google.",
    start_url: `/${client}`,
    scope: `/${client}`,
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

  return Response.json(manifest, {
    headers: { "Cache-Control": "public, max-age=3600" },
  });
}
