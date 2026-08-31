import { Redis } from "@upstash/redis";

let _redis = null;
function getRedis() {
  if (_redis) return _redis;
  const url = process.env.KV_REST_API_URL || process.env.REDIS_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.REDIS_TOKEN;
  if (!url || !token) throw new Error("Base de données non configurée (KV_REST_API_URL / KV_REST_API_TOKEN).");
  if (!url.startsWith("https://")) throw new Error(`URL Redis invalide (doit commencer par https://). Utilise KV_REST_API_URL. Reçu : "${url}"`);
  _redis = new Redis({ url, token });
  return _redis;
}

export function slugify(str) {
  return String(str).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}

export async function getClient(id) {
  const data = await getRedis().hgetall(`client:${id}`);
  return data && Object.keys(data).length ? data : null;
}
export async function saveClient(id, data) {
  await getRedis().hset(`client:${id}`, data);
  await getRedis().sadd("clients", id);
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

export async function incrTap(id) {
  const day = new Date().toISOString().slice(0, 10);
  await getRedis().incr(`taps:${id}`);
  await getRedis().incr(`taps:${id}:${day}`);
}
export async function getTaps(id) {
  const total = await getRedis().get(`taps:${id}`);
  return Number(total || 0);
}
export async function getDailyTaps(id, days = 14) {
  const keys = [], labels = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const day = d.toISOString().slice(0, 10);
    keys.push(`taps:${id}:${day}`); labels.push(day.slice(5));
  }
  const values = keys.length ? await getRedis().mget(...keys) : [];
  return labels.map((label, i) => ({ label, value: Number(values[i] || 0) }));
}
export async function getDailyRange(id, days = 365) {
  const keys = [], dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const day = d.toISOString().slice(0, 10);
    keys.push(`taps:${id}:${day}`); dates.push(day);
  }
  const values = keys.length ? await getRedis().mget(...keys) : [];
  return dates.map((date, i) => ({ date, value: Number(values[i] || 0) }));
}

// Remet à zéro les scans d'un client (total + historique).
// La référence de conversion (base avis + tapsAtBase) est réalignée sur ce
// nouveau départ pour que le suivi reparte proprement d'une feuille blanche.
export async function resetScans(id) {
  const keys = [`taps:${id}`];
  for (let i = 0; i < 400; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    keys.push(`taps:${id}:${d.toISOString().slice(0, 10)}`);
  }
  await getRedis().del(...keys);
  const rev = await getRedis().hgetall(`reviews:${id}`);
  if (rev && Object.keys(rev).length) {
    const current = Number(rev.current || 0);
    await getRedis().hset(`reviews:${id}`, { base: current, tapsAtBase: 0 });
  }
}

// --- SUIVI DES AVIS ---
export async function getReviews(id) {
  const data = await getRedis().hgetall(`reviews:${id}`);
  if (!data || !Object.keys(data).length) return null;
  const current = Number(data.current || 0);
  let base = Number(data.base || 0);
  let tapsAtBase = Number(data.tapsAtBase || 0);
  // Garde-fous : jamais de base au-dessus du courant (avis générés négatifs),
  // jamais de tapsAtBase négatif.
  if (base > current) base = current;
  if (tapsAtBase < 0) tapsAtBase = 0;
  return { current, base, tapsAtBase, updatedAt: data.updatedAt || "" };
}
export async function setReviews(id, count) {
  const n = Math.max(0, Math.floor(Number(count) || 0));
  const today = new Date().toISOString().slice(0, 10);
  const existing = await getRedis().hgetall(`reviews:${id}`);

  if (!existing || !Object.keys(existing).length) {
    // Première saisie : on fige le point de départ.
    const taps = await getTaps(id);
    await getRedis().hset(`reviews:${id}`, { current: n, base: n, tapsAtBase: taps, updatedAt: today });
    return;
  }

  // Saisies suivantes : on met à jour le nombre actuel. Garde-fou : si le
  // nouveau total passe sous la base (ce qui donnerait des avis générés
  // négatifs), on réaligne la base sur ce nouveau total.
  const base = Number(existing.base || 0);
  const patch = { current: n, updatedAt: today };
  if (n < base) patch.base = n;
  await getRedis().hset(`reviews:${id}`, patch);
}

// --- PLAN D'ACTION PERSISTANT ---
export async function getPlan(id) {
  const data = await getRedis().get(`plan:${id}`);
  if (!data) return null;
  if (typeof data === "string") { try { return JSON.parse(data); } catch { return null; } }
  return data;
}
export async function setPlan(id, plan) {
  await getRedis().set(`plan:${id}`, JSON.stringify(plan));
}
// --- OBJECTIF D'AVIS (fixé par le commerçant) ---
export async function getGoal(id) {
  const raw = await getRedis().get(`goal:${id}`);
  if (raw == null) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}
export async function setGoal(id, target) {
  const n = Math.max(0, Math.floor(Number(target) || 0));
  if (n === 0) { await getRedis().del(`goal:${id}`); return; }
  await getRedis().set(`goal:${id}`, String(n));
}

// --- DATE DU DERNIER SCAN (pour la carte "qui dort") ---
// On lit l'historique quotidien pour trouver le dernier jour avec au moins 1 scan.
export async function getLastScanInfo(id, days = 60) {
  const range = await getDailyRange(id, days);
  let lastActiveDate = null;
  for (let i = range.length - 1; i >= 0; i--) {
    if (range[i].value > 0) { lastActiveDate = range[i].date; break; }
  }
  return { lastActiveDate };
}
