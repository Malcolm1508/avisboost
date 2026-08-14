// Si erreur de build : remplace "@/lib/auth" par "../../../../lib/auth"
import { Redis } from "@upstash/redis";
import { hashPassword } from "@/lib/auth";

const DEMO_ID = "demo";
const DEMO_NAME = "Le Comptoir Saint-Léon (démonstration)";

function getRedis() {
  const url = process.env.KV_REST_API_URL || process.env.REDIS_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.REDIS_TOKEN;
  if (!url || !token) throw new Error("Base de données non configurée.");
  return new Redis({ url, token });
}

// Générateur pseudo-aléatoire déterministe : mêmes données à chaque exécution
function rng(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
}

export async function POST(req) {
  try {
    const { password, demoPassword } = await req.json();

    if (!process.env.ADMIN_PASSWORD) {
      return Response.json({ error: "Configuration serveur incomplète", detail: "ADMIN_PASSWORD manquant" }, { status: 500 });
    }
    if (password !== process.env.ADMIN_PASSWORD) {
      return Response.json({ error: "Mot de passe admin incorrect" }, { status: 401 });
    }

    const redis = getRedis();
    const pw = String(demoPassword || "demo2026");
    const rand = rng(20260814);

    // --- 1. Historique de scans sur 90 jours (croissance + effet week-end + dimanche fermé)
    const daily = {};
    let total = 0;
    for (let i = 89; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const day = d.toISOString().slice(0, 10);
      const dow = d.getDay();
      const progress = (89 - i) / 89;

      let base = 1.4 + progress * 4.2;      // montée progressive : ~1,4 → ~5,6 scans/jour
      if (dow === 6) base *= 1.7;           // samedi chargé
      if (dow === 5) base *= 1.25;          // vendredi
      if (dow === 0) base = 0;              // dimanche fermé

      const v = Math.max(0, Math.round(base + (rand() - 0.5) * 2.6));
      if (v > 0) { daily[`taps:${DEMO_ID}:${day}`] = String(v); total += v; }
    }

    // --- 2. Nettoyage de l'ancien jeu de données
    const oldKeys = [`taps:${DEMO_ID}`];
    for (let i = 0; i < 400; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      oldKeys.push(`taps:${DEMO_ID}:${d.toISOString().slice(0, 10)}`);
    }
    await redis.del(...oldKeys);

    // --- 3. Écriture
    await redis.mset({ ...daily, [`taps:${DEMO_ID}`]: String(total) });

    const pwhash = await hashPassword(pw);
    await redis.hset(`client:${DEMO_ID}`, {
      name: DEMO_NAME,
      googleUrl: "https://www.google.com/maps",
      tone: "chaleureux et professionnel",
      pwhash,
      logoUrl: "",
      address: "12 rue Saint-Dizier, 54000 Nancy",
      owner: "Léa",
      specialty: "café-restaurant de quartier",
      style: "humain, chaleureux, jamais robotique",
    });
    await redis.sadd("clients", DEMO_ID);

    // --- 4. Avis : point de départ figé à 0 scan → conversion calculée sur toute la période
    const gained = Math.round(total * 0.23);
    await redis.hset(`reviews:${DEMO_ID}`, {
      current: String(38 + gained),
      base: "38",
      tapsAtBase: "0",
      updatedAt: new Date().toISOString().slice(0, 10),
    });

    // --- 5. Plan d'action partiellement coché
    await redis.set(`plan:${DEMO_ID}`, JSON.stringify({
      focus: "Transformer les clients satisfaits en avis, et ne plus laisser un seul avis sans réponse.",
      semaine: [
        { niveau: "Facile", action: "Poser la carte juste à côté du terminal de paiement", pourquoi: "C'est le moment où le client attend : c'est là qu'il scanne.", done: true },
        { niveau: "Facile", action: "Répondre aux 4 avis en attente", pourquoi: "Une fiche où le gérant répond inspire confiance et remonte dans Google.", done: true },
        { niveau: "Moyen", action: "Demander l'avis à voix haute aux habitués", pourquoi: "Un mot du gérant multiplie par 3 le passage à l'acte.", done: false },
      ],
      mois: [
        { text: "Publier 2 visuels d'avis clients sur Instagram", done: true },
        { text: "Atteindre 150 avis Google", done: false },
        { text: "Mettre à jour les photos de la fiche Google", done: false },
      ],
      createdAt: new Date().toISOString(),
    }));

    return Response.json({
      ok: true, id: DEMO_ID, name: DEMO_NAME, totalScans: total,
      reviews: 38 + gained, conversion: `${Math.round((gained / total) * 100)}%`, pw,
    });
  } catch (e) {
    return Response.json({ error: "Erreur serveur", detail: e.message }, { status: 500 });
  }
}
