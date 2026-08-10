import { Redis } from "@upstash/redis";

// Un seul client Redis pour toute l'app.
// Vercel nomme parfois les variables différemment selon l'intégration choisie
// (REDIS_URL/REDIS_TOKEN ou KV_REST_API_URL/KV_REST_API_TOKEN) : on accepte les deux,
// pour ne jamais avoir à renommer quoi que ce soit sur Vercel.
//
// IMPORTANT : on ne crée la connexion qu'à la première utilisation réelle (lazy),
// jamais au chargement du fichier. Sinon, à l'étape de build de Vercel (qui charge
// les fichiers sans les variables d'environnement disponibles), la création plante
// et bloque tout le déploiement ("Failed to collect page data").
let _redis = null;
function getRedis() {
  if (_redis) return _redis;
  const url = process.env.REDIS_URL || process.env.KV_REST_API_URL;
  const token = process.env.REDIS_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error(
      "Base de données non configurée : ajoute REDIS_URL/REDIS_TOKEN (ou KV_REST_API_URL/KV_REST_API_TOKEN) dans les variables d'environnement Vercel, puis redéploie."
    );
  }
  _redis = new Redis({ url, token });
  return _redis;
}

// Transforme "Salon Marie & Co" en "salon-marie-co" (l'id utilisé dans l'URL)
export function slugify(str) {
  return String(str)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // enlève les accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

// --- CONFIG D'UN CLIENT ---
// Rangé dans un "hash" Redis à la clé client:<id> => { name, googleUrl, tone, pin }
export async function getClient(id) {
  const data = await getRedis().hgetall(`client:${id}`);
  return data && Object.keys(data).length ? data : null;
}

export async function saveClient(id, data) {
  await getRedis().hset(`client:${id}`, data);
  await getRedis().sadd("clients", id); // on garde la liste de tous les ids
}

export async function listClients() {
  const ids = await getRedis().smembers("clients");
  const out = [];
  for (const id of ids) {
    const c = (await getClient(id)) || {};
    out.push({ id, name: c.name || id, taps: await getTaps(id) });
  }
  return out.sort((a, b) => b.taps - a.taps);
}

// --- COMPTEUR DE TAPS ---
export async function incrTap(id) {
  const day = new Date().toISOString().slice(0, 10); // AAAA-MM-JJ
  await getRedis().incr(`taps:${id}`);        // total
  await getRedis().incr(`taps:${id}:${day}`); // par jour
}

export async function getTaps(id) {
  const total = await getRedis().get(`taps:${id}`);
  return Number(total || 0);
}

// Renvoie les taps des 14 derniers jours pour le petit graphique
export async function getDailyTaps(id, days = 14) {
  const keys = [];
  const labels = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const day = d.toISOString().slice(0, 10);
    keys.push(`taps:${id}:${day}`);
    labels.push(day.slice(5)); // MM-JJ
  }
  const values = keys.length ? await getRedis().mget(...keys) : [];
  return labels.map((label, i) => ({ label, value: Number(values[i] || 0) }));
}
