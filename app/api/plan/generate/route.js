import { NextResponse } from "next/server";
import { getClient, getTaps, getReviews, setPlan } from "@/lib/db";
import { verifySession, cookieName } from "@/lib/auth";

export const dynamic = "force-dynamic";
const GEMINI_MODEL = "gemini-3.5-flash-lite";

export async function POST(req) {
  try {
    const { client, reviews } = await req.json();
    if (!client) return NextResponse.json({ error: "Client manquant." }, { status: 400 });

    const token = req.cookies.get(cookieName(client))?.value;
    if (!verifySession(token, client)) return NextResponse.json({ error: "Non autorisé. Reconnectez-vous." }, { status: 401 });
    if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: "Clé API Gemini manquante côté serveur." }, { status: 500 });

    const c = await getClient(client);
    const taps = await getTaps(client);
    const rev = await getReviews(client);
    let stats = "";
    if (c) stats += `Établissement : ${c.name}${c.specialty ? " (" + c.specialty + ")" : ""}.\n`;
    stats += `Scans de la carte au total : ${taps}.\n`;
    if (rev) {
      const generated = Math.max(0, rev.current - rev.base);
      const scansSince = Math.max(0, taps - rev.tapsAtBase);
      const conv = scansSince > 0 ? Math.round((generated / scansSince) * 100) : null;
      stats += `Avis Google actuels : ${rev.current}.\n`;
      stats += `Avis générés depuis le suivi : ${generated}.\n`;
      if (conv != null) stats += `Taux de conversion scan → avis : ${conv}%.\n`;
    }

    const system = [
      "Tu es un consultant en réputation Google pour un commerce local.",
      "À partir des avis et des statistiques, produis un plan d'action concret, priorisé et réaliste.",
      "Réponds UNIQUEMENT avec un objet JSON valide, sans texte autour, au format exact :",
      '{ "focus": "phrase : la priorité n°1", "semaine": [ { "niveau": "rouge|orange|vert", "action": "...", "pourquoi": "court" } ], "mois": [ "objectif 1", "objectif 2" ] }',
      "Règles : en français ; max 4 actions semaine, max 3 objectifs mois ; sois concret ; appuie-toi sur les stats ; n'invente aucun chiffre ; formule les actions de façon vérifiable/cochable (ex : 'Répondre aux avis sans réponse', 'Demander un avis à chaque client cette semaine').",
    ].join("\n");

    const userMsg = `STATISTIQUES :\n${stats}\n\nAVIS RÉCENTS :\n"""${(reviews || "").trim() || "Aucun avis fourni."}"""`;

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
    if (!r.ok) { const detail = await r.text(); return NextResponse.json({ error: "Erreur API IA (Gemini).", detail }, { status: 502 }); }

    const data = await r.json();
    let text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("\n").trim();
    text = text.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
    let parsed;
    try { parsed = JSON.parse(text); } catch (e) { return NextResponse.json({ error: "Réponse IA illisible.", detail: text.slice(0, 300) }, { status: 502 }); }

    const plan = {
      focus: parsed.focus || "",
      semaine: (parsed.semaine || []).slice(0, 4).map((a) => ({
        niveau: a.niveau || "orange", action: a.action || "", pourquoi: a.pourquoi || "", done: false,
      })),
      mois: (parsed.mois || []).slice(0, 3).map((m) => ({
        text: typeof m === "string" ? m : (m.text || String(m)), done: false,
      })),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    await setPlan(client, plan);
    return NextResponse.json({ plan });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur.", detail: String(e && e.message ? e.message : e) }, { status: 500 });
  }
}
