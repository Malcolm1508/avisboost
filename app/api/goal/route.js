import { NextResponse } from "next/server";
import { setGoal, getClient } from "@/lib/db";
import { verifySession, cookieName } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { client, target } = await req.json();
    if (!client) return NextResponse.json({ error: "Client manquant." }, { status: 400 });
    const token = req.cookies.get(cookieName(client))?.value;
    if (!verifySession(token, client)) {
      return NextResponse.json({ error: "Non autorisé. Reconnectez-vous." }, { status: 401 });
    }
    const c = await getClient(client);
    if (!c) return NextResponse.json({ error: "Client inconnu." }, { status: 404 });
    await setGoal(client, target);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur.", detail: String(e?.message || e) }, { status: 500 });
  }
}
