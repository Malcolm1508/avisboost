import { NextResponse } from "next/server";
import { setReviews, getClient } from "@/lib/db";
import { verifySession, cookieName } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { client, count } = await req.json();
    if (!client) return NextResponse.json({ error: "Client manquant." }, { status: 400 });

    const token = req.cookies.get(cookieName(client))?.value;
    if (!verifySession(token, client)) {
      return NextResponse.json({ error: "Non autorisé. Reconnectez-vous." }, { status: 401 });
    }

    const c = await getClient(client);
    if (!c) return NextResponse.json({ error: "Client inconnu." }, { status: 404 });

    if (count == null || isNaN(Number(count)) || Number(count) < 0) {
      return NextResponse.json({ error: "Nombre d'avis invalide." }, { status: 400 });
    }

    await setReviews(client, count);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur.", detail: String(e && e.message ? e.message : e) }, { status: 500 });
  }
}
