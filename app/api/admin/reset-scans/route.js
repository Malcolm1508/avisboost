import { NextResponse } from "next/server";
import { resetScans, getClient } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { password, client } = await req.json();
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Mot de passe admin incorrect." }, { status: 401 });
    }
    if (!client) return NextResponse.json({ error: "Identifiant client manquant." }, { status: 400 });

    const c = await getClient(client);
    if (!c) return NextResponse.json({ error: "Client inconnu (vérifie l'identifiant)." }, { status: 404 });

    await resetScans(client);
    return NextResponse.json({ ok: true, name: c.name });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur.", detail: String(e && e.message ? e.message : e) }, { status: 500 });
  }
}
