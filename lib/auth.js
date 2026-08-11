import crypto from "crypto";

// --- Hachage des mots de passe clients (jamais stockés en clair) ---
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const dk = crypto.scryptSync(String(password), salt, 32).toString("hex");
  return `${salt}:${dk}`;
}

export function verifyPassword(password, stored) {
  try {
    if (!stored || !stored.includes(":")) return false;
    const [salt, dk] = stored.split(":");
    const test = crypto.scryptSync(String(password), salt, 32).toString("hex");
    const a = Buffer.from(dk, "hex");
    const b = Buffer.from(test, "hex");
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// --- Sessions signées (cookie), sans base de sessions à gérer ---
function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET manquant dans les variables d'environnement Vercel.");
  return s;
}

export function signSession(client, maxAgeSec = 60 * 60 * 24 * 30) {
  const exp = Date.now() + maxAgeSec * 1000;
  const payload = `${client}.${exp}`;
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySession(token, client) {
  try {
    if (!token) return false;
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [c, exp, sig] = parts;
    if (c !== client) return false;
    if (Number(exp) < Date.now()) return false;
    const expected = crypto.createHmac("sha256", secret()).update(`${c}.${exp}`).digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function cookieName(client) {
  return `ab_session_${client}`;
}
