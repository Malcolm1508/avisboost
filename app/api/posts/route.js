import { NextResponse } from "next/server";
import { getClient } from "@/lib/db";

// Feature 4 : transforme un avis en contenus marketing (Insta, Facebook, site, story).
export const dynamic = "force-dynamic";

const GEMINI_MODEL = "gemini-3.5-flash-lite";

export async function POST(req) {
  try {
    const { client, review } = await req.json();
    if (!review || !review.trim()) {
      return NextResponse.json({ error: "Collez d'abord un avis." }, { status: 400 });
    }
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Clé API Gemini manquante côté serveur." }, { status: 500 });
    }

    let c = null;
    if (client) c = await getClient(client);
    const nom = (c && c.name) || "l'établissement";
    const specialty = c && c.specialty ? c.specialty : "";

    const system = [
      `Tu es le responsable communication de "${nom}"${specialty ? ` (${specialty})` : ""}.`,
      "À partir d'un avis client positif, crée des contenus prêts à publier pour valoriser cet avis.",
      "Réponds UNIQUEMENT avec un objet JSON valide, sans texte autour, au format exact :",
      "{",
      '  "instagram": "légende Instagram engageante avec 3 à 5 hashtags pertinents",',
      '  "facebook": "post Facebook chaleureux, un peu plus long",',
      '  "site": "courte citation à afficher sur le site web (1 phrase percutante)",',
      '  "story": "texte très court pour une story Instagram"',
      "}",
      "Règles : tout en français ; ton positif et authentique ; n'invente aucun fait ; n'utilise le prénom du client que s'il apparaît dans l'avis (sinon reste général) ; reste sobre, jamais racoleur ; les hashtags doivent être adaptés à l'activité.",
    ].join("\n");

    const userMsg = `Avis du client :\n"""${review.trim()}"""`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: userMsg }] }],
        generationConfig: { maxOutputTokens: 900, responseMimeType: "application/json" },
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      return NextResponse.json({ error: "Erreur API IA (Gemini).", detail }, { status: 502 });
    }

    const data = await r.json();
    let text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("\n").trim();
    text = text.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();

    let parsed;
    try { parsed = JSON.parse(text); }
    catch (e) { return NextResponse.json({ error: "Réponse IA illisible.", detail: text.slice(0, 300) }, { status: 502 }); }

    return NextResponse.json({ posts: parsed });
  } catch (e) {
    return NextResponse.json({ error: "Erreur inattendue.", detail: String(e) }, { status: 500 });
  }
}
