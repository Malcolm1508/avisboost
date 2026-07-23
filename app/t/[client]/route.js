import { NextResponse } from "next/server";
import { getClient, incrTap } from "@/lib/db";

// C'EST L'URL QUE TU PROGRAMMES DANS LA CARTE NFC :
//   https://ton-app.vercel.app/t/salon-marie
// Quand un client tape -> on compte le tap -> on le renvoie vers la vraie fiche Google.
export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  try {
    const { client } = await params;
    const c = await getClient(client);

    if (!c || !c.googleUrl) {
      return new NextResponse("Carte non configurée.", { status: 404 });
    }

    await incrTap(client);              // +1 tap (pour le dashboard)
    return NextResponse.redirect(c.googleUrl); // redirection vers Google
  } catch (e) {
    return new NextResponse("Erreur serveur.", { status: 500 });
  }
}
