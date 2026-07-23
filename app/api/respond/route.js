import { NextResponse } from "next/server";

// Feature 2 : génère une réponse à un avis Google via l'IA.
// La clé API reste cachée côté serveur (jamais dans le navigateur).
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { review, rating, tone, businessName } = await req.json();
    if (!review || !review.trim()) {
      return NextResponse.json({ error: "Avis vide." }, { status: 400 });
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "Clé API manquante côté serveur." }, { status: 500 });
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

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001", // rapide + peu cher ; tu peux changer de modèle
        max_tokens: 400,
        system,
        messages: [{ role: "user", content: userMsg }],
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      return NextResponse.json({ error: "Erreur API IA.", detail }, { status: 502 });
    }

    const data = await r.json();
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return NextResponse.json({ reply: text });
  } catch (e) {
    return NextResponse.json({ error: "Erreur inattendue.", detail: String(e) }, { status: 500 });
  }
}
