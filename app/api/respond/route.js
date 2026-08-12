import { NextResponse } from "next/server";
import { getClient } from "@/lib/db";

// Feature 2 : génère une réponse à un avis Google via l'IA (Google Gemini, gratuit).
// Personnalisée avec les infos de l'entreprise (dirigeant, spécialité, style).
export const dynamic = "force-dynamic";

const GEMINI_MODEL = "gemini-3.5-flash-lite";

export async function POST(req) {
  try {
    const { review, rating, tone, businessName, client } = await req.json();
    if (!review || !review.trim()) {
      return NextResponse.json({ error: "Avis vide." }, { status: 400 });
    }
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Clé API Gemini manquante côté serveur." }, { status: 500 });
    }

    let c = null;
    if (client) c = await getClient(client);

    const nom = businessName || (c && c.name) || "l'établissement";
    const owner = c && c.owner ? c.owner : "";
    const specialty = c && c.specialty ? c.specialty : "";
    const style = c && c.style ? c.style : "";
    const finalTone = tone || (c && c.tone) || "chaleureux et professionnel";

    const system = [
      `Tu es ${owner ? owner + ", " : ""}le/la gérant(e) de "${nom}"${specialty ? ` (${specialty})` : ""}.`,
      "Rédige une réponse à un avis client Google, en français, comme si c'était vraiment toi qui répondais.",
      "Règles strictes :",
      "- 2 à 4 phrases maximum, ton naturel et humain, jamais robotique.",
      "- Remercie sincèrement la personne ; si son prénom apparaît dans l'avis, tu peux l'utiliser.",
      "- Si l'avis est négatif : reste courtois, ne te justifie pas de façon agressive, montre que tu prends note et propose de continuer l'échange en privé ou de recontacter l'établissement.",
      "- N'invente aucun fait et ne promets ni remise ni compensation.",
      "- Pas de guillemets autour de la réponse, pas de préambule : donne uniquement le texte de la réponse.",
      `- Ton souhaité : ${finalTone}.`,
      style ? `- Style de communication à respecter : ${style}.` : "",
      owner ? `- Tu peux signer avec le prénom ${owner} si c'est naturel.` : "",
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
