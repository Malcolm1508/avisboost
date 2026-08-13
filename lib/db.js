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

// --- SUIVI DES AVIS ---
export async function getReviews(id) {
  const data = await getRedis().hgetall(`reviews:${id}`);
  if (!data || !Object.keys(data).length) return null;
  return { current: Number(data.current || 0), base: Number(data.base || 0), tapsAtBase: Number(data.tapsAtBase || 0), updatedAt: data.updatedAt || "" };
}
export async function setReviews(id, count) {
  const n = Math.max(0, Math.floor(Number(count) || 0));
  const today = new Date().toISOString().slice(0, 10);
  const existing = await getRedis().hgetall(`reviews:${id}`);
  if (!existing || !Object.keys(existing).length) {
    const taps = await getTaps(id);
    await getRedis().hset(`reviews:${id}`, { current: n, base: n, tapsAtBase: taps, updatedAt: today });
  } else {
    await getRedis().hset(`reviews:${id}`, { current: n, updatedAt: today });
  }
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
