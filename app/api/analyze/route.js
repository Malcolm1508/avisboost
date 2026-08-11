import { NextResponse } from "next/server";

// Analyse des verbatims : à partir d'avis collés, ressort les thèmes récurrents
// (points forts / points faibles) et des axes d'amélioration. Via Gemini (gratuit).
export const dynamic = "force-dynamic";

const GEMINI_MODEL = "gemini-3.5-flash-lite";

export async function POST(req) {
  try {
    const { reviews, businessName } = await req.json();
    if (!reviews || !reviews.trim()) {
      return NextResponse.json({ error: "Aucun avis fourni." }, { status: 400 });
    }
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Clé API Gemini manquante côté serveur." }, { status: 500 });
    }

    const system = [
      "Tu analyses des avis clients Google pour un commerce local.",
      "Identifie les THÈMES qui reviennent, séparés en points forts et points faibles, et propose des axes d'amélioration concrets et actionnables.",
      "Réponds UNIQUEMENT avec un objet JSON valide, sans aucun texte autour, au format exact :",
      "{",
      '  "resume": "une phrase de synthèse en français",',
      '  "sentiment": "positif" ou "mitigé" ou "négatif",',
      '  "nb_avis": nombre entier d\'avis analysés,',
      '  "positifs": [ { "theme": "libellé court", "frequence": entier, "exemple": "exemple reformulé court" } ],',
      '  "negatifs": [ { "theme": "libellé court", "frequence": entier, "exemple": "exemple reformulé court" } ],',
      '  "axes": [ "action concrète 1", "action concrète 2" ]',
      "}",
      "Règles : tout en français ; 'frequence' = nombre d'avis où le thème apparaît ; classe du plus fréquent au moins fréquent ; maximum 6 thèmes par catégorie ; maximum 5 axes ; si aucun point faible, renvoie un tableau negatifs vide ; ne recopie jamais un avis mot pour mot, reformule brièvement les exemples.",
    ].join("\n");

    const userMsg =
      `Établissement : ${businessName || "non précisé"}\n\n` +
      `Avis à analyser (un par ligne en général) :\n"""${reviews.trim()}"""`;

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
        generationConfig: { maxOutputTokens: 1400, responseMimeType: "application/json" },
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      return NextResponse.json({ error: "Erreur API IA (Gemini).", detail }, { status: 502 });
    }

    const data = await r.json();
    let text = (data.candidates?.[0]?.content?.parts || [])
      .map((p) => p.text || "")
      .join("\n")
      .trim();

    text = text.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      return NextResponse.json({ error: "Réponse IA illisible.", detail: text.slice(0, 300) }, { status: 502 });
    }

    return NextResponse.json({ analysis: parsed });
  } catch (e) {
    return NextResponse.json({ error: "Erreur inattendue.", detail: String(e) }, { status: 500 });
  }
}
