export const dynamic = "force-dynamic";

const BLOCKED = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.|\[?::1\]?)/i;

export async function GET(req) {
  try {
    const raw = new URL(req.url).searchParams.get("url");
    if (!raw) return new Response("URL manquante", { status: 400 });

    let target;
    try { target = new URL(raw); } catch { return new Response("URL invalide", { status: 400 }); }

    if (!["http:", "https:"].includes(target.protocol)) {
      return new Response("Protocole non autorisé", { status: 400 });
    }
    if (BLOCKED.test(target.hostname) || target.hostname.endsWith(".local")) {
      return new Response("Hôte non autorisé", { status: 400 });
    }

    const upstream = await fetch(target.toString(), {
      headers: { "User-Agent": "BoostRepu/1.0" },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });

    if (!upstream.ok) return new Response("Image inaccessible", { status: 502 });

    const type = upstream.headers.get("content-type") || "";
    if (!type.startsWith("image/")) return new Response("Ce lien ne pointe pas vers une image", { status: 415 });

    const buf = await upstream.arrayBuffer();
    if (buf.byteLength > 5_000_000) return new Response("Image trop lourde", { status: 413 });

    return new Response(buf, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (e) {
    return new Response("Erreur : " + e.message, { status: 500 });
  }
}
