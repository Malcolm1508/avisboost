import { listClients } from "@/lib/db";

export async function POST(req) {
  try {
    const { password } = await req.json();

    if (!process.env.ADMIN_PASSWORD) {
      return Response.json({ error: "Configuration serveur incomplète", detail: "ADMIN_PASSWORD manquant" }, { status: 500 });
    }
    if (password !== process.env.ADMIN_PASSWORD) {
      return Response.json({ error: "Mot de passe admin incorrect" }, { status: 401 });
    }

    const clients = await listClients();
    return Response.json({ clients });
  } catch (e) {
    return Response.json({ error: "Erreur serveur", detail: e.message }, { status: 500 });
  }
}
