import { NextResponse } from "next/server";
import { getPlan, setPlan } from "@/lib/db";
import { verifySession, cookieName } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { client, type, index } = await req.json();
    if (!client) return NextResponse.json({ error: "Client manquant." }, { status: 400 });

    const token = req.cookies.get(cookieName(client))?.value;
    if (!verifySession(token, client)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

    const plan = await getPlan(client);
    if (!plan) return NextResponse.json({ error: "Aucun plan." }, { status: 404 });

    if (type === "semaine" && plan.semaine && plan.semaine[index]) plan.semaine[index].done = !plan.semaine[index].done;
    else if (type === "mois" && plan.mois && plan.mois[index]) plan.mois[index].done = !plan.mois[index].done;
    else return NextResponse.json({ error: "Élément introuvable." }, { status: 400 });

    await setPlan(client, plan);
    return NextResponse.json({ plan });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur.", detail: String(e && e.message ? e.message : e) }, { status: 500 });
  }
}
