// Si erreur de build : remplace "@/lib/db" par "../../../../lib/db" et "@/lib/auth" par "../../../../lib/auth"
import { getClient, saveClient } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req) {
  try {
    const { password, client, newPassword } = await req.json();

    if (!process.env.ADMIN_PASSWORD) {
      return Response.json({ error: "Configuration serveur incomplète", detail: "ADMIN_PASSWORD manquant" }, { status: 500 });
    }
    if (password !== process.env.ADMIN_PASSWORD) {
      return Response.json({ error: "Mot de passe admin incorrect" }, { status: 401 });
    }

    const id = String(client || "").trim();
    const pw = String(newPassword || "");

    if (!id) return Response.json({ error: "Identifiant client manquant" }, { status: 400 });
    if (pw.length < 4) return Response.json({ error: "Le nouveau mot de passe doit faire au moins 4 caractères" }, { status: 400 });

    const existing = await getClient(id);
    if (!existing) return Response.json({ error: `Aucun client avec l'identifiant « ${id} »` }, { status: 404 });

    const pwhash = await hashPassword(pw);
    await saveClient(id, { pwhash });

    return Response.json({ ok: true, id, name: existing.name || id });
  } catch (e) {
    return Response.json({ error: "Erreur serveur", detail: e.message }, { status: 500 });
  }
}
