import { NextResponse } from "next/server";
import { saveClient, getClient, slugify } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { password, name, googleUrl, tone, clientPassword } = await req.json();

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Mot de passe admin incorrect." }, { status: 401 });
    }
    if (!name || !googleUrl) {
      return NextResponse.json({ error: "Nom et lien Google obligatoires." }, { status: 400 });
    }
    if (!clientPassword || String(clientPassword).length < 4) {
      return NextResponse.json({ error: "Mot de passe du client obligatoire (4 caractères minimum)." }, { status: 400 });
    }

    const id = slugify(name);
    if (!id) return NextResponse.json({ error: "Nom invalide." }, { status: 400 });

    const existing = await getClient(id);
    await saveClient(id, {
      name,
      googleUrl,
      tone: tone || "chaleureux et professionnel",
      pwhash: hashPassword(clientPassword),
    });

    const base = process.env.PUBLIC_BASE_URL || "";
    return NextResponse.json({
      id,
      updated: !!existing,
      cardUrl: `${base}/t/${id}`,
      dashboardUrl: `${base}/${id}`,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du client.", detail: String(e && e.message ? e.message : e) },
      { status: 500 }
    );
  }
}
