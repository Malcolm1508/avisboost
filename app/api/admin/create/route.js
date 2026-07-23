import { NextResponse } from "next/server";
import { saveClient, getClient, slugify } from "@/lib/db";

// Crée (ou met à jour) un client. Protégé par ADMIN_PASSWORD.
export const dynamic = "force-dynamic";

export async function POST(req) {
  const { password, name, googleUrl, tone, pin } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Mot de passe admin incorrect." }, { status: 401 });
  }
  if (!name || !googleUrl) {
    return NextResponse.json({ error: "Nom et lien Google obligatoires." }, { status: 400 });
  }

  const id = slugify(name);
  if (!id) return NextResponse.json({ error: "Nom invalide." }, { status: 400 });

  const existing = await getClient(id);
  await saveClient(id, {
    name,
    googleUrl,
    tone: tone || "chaleureux et professionnel",
    pin: pin || "",
  });

  const base = process.env.PUBLIC_BASE_URL || "";
  return NextResponse.json({
    id,
    updated: !!existing,
    cardUrl: `${base}/t/${id}`,             // à programmer dans la carte NFC
    dashboardUrl: `${base}/${id}${pin ? `?pin=${pin}` : ""}`, // à donner au client
  });
}
