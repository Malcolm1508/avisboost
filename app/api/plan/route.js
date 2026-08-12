import { NextResponse } from "next/server";
import { getClient, getTaps, getReviews } from "@/lib/db";

// Feature 3 : plan d'action IA. Croise les avis collés avec les stats réelles du client.
export const dynamic = "force-dynamic";

const GEMINI_MODEL = "gemini-3.5-flash-lite";

export async function POST(req) {
  try {
    const { client, reviews } = await req.json();
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Clé API Gemini manquante côté serveur." }, { status: 500 });
    }

    let stats = "";
    if (client) {
      const c = await getClient(client);
      const taps = await getTaps(client);
      const rev = await getReviews(client);
      if (c) {
        stats += `Établissement : ${c.name}${c.specialty ? " (" + c.specialty + ")" : ""}.\n`;
      }
      stats += `Scans de la carte au total : ${taps}.\n`;
      if (rev) {
        const generated = Math.max(0, rev.current - rev.base);
        const scansSince = Math.max(0, taps - rev.tapsAtBase);
        const conv = scansSince > 0 ? Math.round((generated / scansSince) * 100) : null;
        stats += `Avis Google actuels : ${rev.current}.\n`;
        stats += `Avis générés depuis le suivi : ${generated}.\n`;
        if (conv != null) stats += `Taux de conversion scan → avis : ${conv}%.\n`;
      }
    }

    const system = [
      "Tu es un consultant en réputation Google pour un commerce local.",
      "À partir des avis clients et des statistiques fournies, produis un plan d'action concret, priorisé et réaliste.",
      "Réponds UNIQUEMENT avec un objet JSON valide, sans texte autour, au format exact :",
      "{",
      '  "focus": "une phrase : la priorité numéro 1 à retenir",',
      '  "semaine": [ { "niveau": "rouge" ou "orange" ou "vert", "action": "action concrète", "pourquoi": "raison courte" } ],',
      '  "mois": [ "objectif mesurable 1", "objectif mesurable 2" ]',
      "}",
      "Règles : en français ; maximum 4 actions pour la semaine, maximum 3 objectifs pour le mois ; 'rouge' = urgent, 'orange' = important, 'vert' = à entretenir ; sois concret (ex : 'mettre une file prioritaire entre 12h et 14h') ; appuie-toi sur les statistiques fournies quand c'est pertinent (ex : si la conversion est faible, recommande de demander plus d'avis) ; n'invente aucun chiffre que tu n'as pas ; si peu d'avis sont fournis, propose surtout d'en collecter davantage.",
    ].join("\n");

    const userMsg =
      `STATISTIQUES :\n${stats || "Non fournies."}\n\n` +
      `AVIS RÉCENTS :\n"""${(reviews || "").trim() || "Aucun avis fourni."}"""`;

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

    return NextResponse.json({ plan: parsed });
  } catch (e) {
    return NextResponse.json({ error: "Erreur inattendue.", detail: String(e) }, { status: 500 });
  }
}
