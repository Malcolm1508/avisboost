import { NextResponse } from "next/server";
import { getClient } from "@/lib/db";
import { verifyPassword, signSession, cookieName } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { client, password } = await req.json();
    const c = await getClient(client);
    if (!c) return NextResponse.json({ error: "Établissement inconnu." }, { status: 404 });
    if (!c.pwhash) {
      return NextResponse.json(
        { error: "Aucun mot de passe défini pour ce tableau de bord. Recréez le client dans /admin avec un mot de passe." },
        { status: 403 }
      );
    }
    if (!password || !verifyPassword(password, c.pwhash)) {
      return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
    }

    const token = signSession(client);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(cookieName(client), token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur.", detail: String(e && e.message ? e.message : e) }, { status: 500 });
  }
}
