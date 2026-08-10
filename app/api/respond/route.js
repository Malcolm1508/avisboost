import { NextResponse } from "next/server";

// Feature 2 : génère une réponse à un avis Google via l'IA (Google Gemini, gratuit).
// La clé API reste cachée côté serveur (jamais dans le navigateur).
export const dynamic = "force-dynamic";

// Modèle utilisé : les modèles "Flash-Lite" sont ceux qui offrent le quota gratuit
// le plus généreux chez Google. Google renomme/retire ses modèles assez souvent
// (dernière mise à jour connue : juillet 2026, modèle "gemini-3.5-flash-lite").
// Si tu revois une erreur "model ... is no longer available", va sur
// ai.google.dev/gemini-api/docs/models et remplace la valeur ci-dessous.
const GEMINI_MODEL = "gemini-3.5-flash-lite";

export async function POST(req) {
  try {
    const { review, rating, tone, businessName } = await req.json();
    if (!review || !review.trim()) {
      return NextResponse.json({ error: "Avis vide." }, { status: 400 });
    }
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Clé API Gemini manquante côté serveur." }, { status: 500 });
    }

    const system = [
      `Tu es le/la gérant(e) de l'établissement "${businessName || "l'établissement"}".`,
      "Rédige une réponse à un avis client Google, en français.",
      "Règles strictes :",
      "- 2 à 4 phrases maximum, ton naturel et humain.",
      "- Remercie sincèrement la personne.",
      "- Si l'avis est négatif : reste courtois, ne te justifie pas de façon agressive, montre que tu prends note et propose de continuer l'échange en privé (ou de recontacter l'établissement).",
      "- N'invente aucun fait et ne promets ni remise ni compensation.",
      "- Pas de guillemets autour de la réponse, pas de préambule : donne uniquement le texte de la réponse.",
      tone ? `- Ton souhaité : ${tone}.` : "",
    ].filter(Boolean).join("\n");

    const userMsg =
      (rating ? `Note laissée : ${rating}/5.\n` : "") +
      `Avis du client :\n"""${review.trim()}"""`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: userMsg }] }],
        generationConfig: { maxOutputTokens: 300 },
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      return NextResponse.json({ error: "Erreur API IA (Gemini).", detail }, { status: 502 });
    }

    const data = await r.json();
    const text = (data.candidates?.[0]?.content?.parts || [])
      .map((p) => p.text || "")
      .join("\n")
      .trim();

    if (!text) {
      return NextResponse.json({ error: "Réponse IA vide.", detail: JSON.stringify(data).slice(0, 300) }, { status: 502 });
    }

    return NextResponse.json({ reply: text });
  } catch (e) {
    return NextResponse.json({ error: "Erreur inattendue.", detail: String(e) }, { status: 500 });
  }
}
